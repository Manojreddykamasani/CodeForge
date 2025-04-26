require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const supabase=require("./supabase.js");
const e = require("express");
const PORT = process.env.PORT || 5000; // Use PORT from environment or 5000 as default
app.use(cors());
app.use(express.json());
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const TOGETHER_API_KEY = 'tgp_v1_7H6rlv1Ow3Yf5UCn8E1ugW-shqYD9AnVOvF9XIA-lsw';
app.post("/submit", async (req, res) => {
  try {
    const { language, version, source_code, testCases } = req.body;
    if (!language || !source_code || !testCases) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    let results = [];
    for (const testCase of testCases) {
      const response = await axios.post(PISTON_URL, {
        language,
        version: version || "*",
        files: [{ content: source_code }],
        stdin: testCase.input || "",
      });
      
      const result = response.data.run;
      results.push({
        input: testCase.input,
        expected_output: testCase.output,
        actual_output: result.output || "",
        stderr: result.stderr || "",
        status_code: result.code,
        passed: result.output.trim() === testCase.output.trim()
      });
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});
app.post("/analyze", async (req, res) => {
  const { code, language,question, testResults, attempts, timeSpentInSeconds,previousWeaknesses,user_id } = req.body;
  const isFirst = !previousWeaknesses || previousWeaknesses.length === 0;
  const prompt = `
You are an expert coding mentor analyzing a student's submission to a programming problem.

📌 Problem Information:
- Title: ${question.title}
- Description: ${question.description}
- Constraints: ${question.constraints}

💻 Student's Code in ${language}:
\\\`${language}
${code}
\\\`

📊 Test Case Results:
${testResults.map(
    (r, i) =>
      `Test ${i + 1}: input = ${r.input}, expected = ${r.expected_output}, actual = ${r.actual_output}, passed = ${r.passed}`
  ).join("\n")}

📈 Metadata:
- Number of attempts: ${attempts}
- Time spent: ${timeSpentInSeconds} seconds

🔍 Evaluation Instructions:
1. Carefully check if the student's code is complete and correct. If the function is empty or partially implemented, mark it as incomplete.
2. Use the test case results to validate correctness. If any test fails, analyze the possible reason.
3. Provide a concise explanation of what the student did wrong (if anything) and how to improve.
4. If this is not the user's first attempt, the following are their **previous known weaknesses**:
${previousWeaknesses.length > 0 ? `- ${previousWeaknesses.join("\n- ")}` : "None (first attempt)"}
   - Remove weaknesses that are clearly resolved in the current solution.
   - Add any new weaknesses found in this submission.
   - Keep unresolved weaknesses that are still present.

🧠 Weaknesses are common coding issues or misconceptions. Examples include:
- Edge case handling
- Time/space inefficiency
- Incorrect looping logic
- Partial/incomplete implementation
- Indexing mistakes
- Overflow/underflow
- Not checking negative inputs or large arrays
- Misunderstanding the problem
- Poor use of language features or incorrect syntax

Respond ONLY in **valid JSON** format (no markdown or triple backticks). Follow this exact structure:
{
  "analysis": "Short and precise summary of what was right or wrong with the student's solution.",
  "weaknesses": ["list", "of", "updated", "weaknesses"]
}
`;
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        prompt,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
      }
    );
    let raw = response.data.choices[0].text.trim();
    const match = raw.match(/```json([\s\S]*?)```/);
    if (match) {
      raw = match[1].trim(); 
    } else {
      raw = raw.replace(/```/g, "").trim(); 
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log("Parsed response:", parsed);
    } catch (err) {
      return res.status(500).json({ error: "Invalid AI response format", raw });
    }
    const {data ,error}= await supabase
    .from('user_weaknesses')
    .update({ weaknesses: parsed.weaknesses })
    .eq('user_id', user_id);
    console.log(user_id)
    if(error){
      console.error("Error updating weaknesses in Supabase:", error.message);
      return res.status(500).json({ error: "Failed to update weaknesses" });
    }
    else{
      res.json(parsed)
    }

  } catch (error) {
    console.error("Together API error:", error.message);
    res.status(500).json({ error: "Failed to analyze code" });
  }
});

app.post("/generate/first",async(req,res)=>{
  const {topic , user_id}= req.body;
  const prompt= `You are a coding tutor for a student. The student is new to the topic ${topic}. Generate a coding question based on the following format.

The question should:
1. **Topic**: Arrays
2. **Difficulty**: Easy (suitable for someone starting with this topic)
3. **XP**: Based on difficulty (Easy = 30, Medium = 60, Hard = 100)
4. **Description**: Provide a concise problem description that clearly explains the task.
5. **Constraints**: Provide any relevant constraints that might apply to the problem. Example: "Array size up to 10^6".
6. **Test Cases**: Include at least **5-10 test cases** in the following format:
   - **Input**: "1 2 3 4 5\n3" (separate input values by spaces, and provide inputs and target values on new lines)(strictly dont use any whitespaces extra make it exactly like the example and no wrong testcase values)
   - **Output**: "2" (corresponding output with values separated by space, without any text or brackets)
   - Each test case should include a variety of edge cases (e.g., empty array, array with one element, large array).
7. **Hint**: Provide a useful hint that would help a student who is struggling. Example: "Think about edge cases like empty arrays or arrays with only one element."

Please format the question in the following way in strict json format:
- title: Text (Title of the problem)
- user_id: UUID (Foreign key to the user who created the problem)
- description: Text (Detailed description of the problem)
- constraints: Text (Constraints for the problem)
- testcases: JSONB (Array of test cases, formatted as JSON)
- difficulty: Text (Easy, Medium, Hard)
- xp: Integer (XP ranging from 0 to 100)
- hint: Text (A hint to assist the user)
- created_at: Timestamp (Auto-generated timestamp)
Ensure the question is **fresh, clear, and solvable** for a beginner in the topic.
`
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        prompt,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
      }
    );
    let raw = response.data.choices[0].text.trim();
    const match = raw.match(/```json([\s\S]*?)```/);
    if (match) {
      raw = match[1].trim(); 
    } else {
      raw = raw.replace(/```/g, "").trim(); 
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log("Parsed response:", parsed);
    } catch (err) {
      return res.status(500).json({ error: "Invalid AI response format", raw });
    }

    const { data, error } = await supabase
      .from('questions')  // Table name in Supabase
      .insert([
        {
          title: parsed.title, 
          user_id: user_id, 
          description: parsed.description, 
          constraints: parsed.constraints, 
          testcases: parsed.testcases, 
          difficulty: parsed.difficulty, 
          xp: parsed.xp, 
          hint: parsed.hint,
          topic: topic
        }
      ]);
      if(error) {
        console.error("Error inserting data into Supabase:", error.message);
        return res.status(500).json({ error: "Failed to generate question" });
      }
      else{
        const{data:id,error}= await supabase.from("questions").select("id").eq("title",parsed.title).eq("user_id",user_id).single()
        if(error) { 
          console.error("Error fetching question ID:", error.message);

        }
        console.log("Inserted data:", id);
        res.json({
          ...parsed,
          id: id.id
        });}
    
}
catch (error) {
    console.error("Together API error:", error.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
})
app.post("/weakness", async(req,res)=>{
  const {user_id}= req.body;
  const {data,error}= await supabase.from("user_weaknesses").select("weaknesses").eq("user_id",user_id).single();
  res.json(data)
})
app.post("/generate/next", async (req, res) => {
  const { topic, weaknesses, solved_questions, user_id } = req.body;

  const prompt = `
You are an AI coding tutor helping a student improve in the topic: ${topic}.

- The student has the following known weaknesses: ${weaknesses.join(", ") || "none"}.
- The following questions have already been solved **in order** (from earliest to most recent): ${solved_questions.join(", ") || "none"}.

Your task is to:
- **Analyze the student’s progress** based on the sequence of solved questions.
- Generate a **new, fresh, and non-repeating** coding question that:
  - Challenges one or more of the student’s weaknesses.
  - Maintains continuity with what the student has recently worked on.
  - Fits within the current topic and supports the student’s steady skill growth.
The question should:
1. **Topic**: Arrays
2. **Difficulty**: Easy (suitable for someone starting with this topic)
3. **XP**: Based on difficulty (Easy = 30, Medium = 60, Hard = 100)
4. **Description**: Provide a concise problem description that clearly explains the task.
5. **Constraints**: Provide any relevant constraints that might apply to the problem. Example: "Array size up to 10^6".
6. **Test Cases**: Include at least **5-10 test cases** in the following format:
   - **Input**: "1 2 3 4 5\n3" (separate input values by spaces, and provide inputs and target values on new lines)(strictly dont use any whitespaces extra make it exactly like the example and no wrong testcase values)
   - **Output**: "2" (corresponding output with values separated by space, without any text or brackets)
   - Each test case should include a variety of edge cases (e.g., empty array, array with one element, large array).
7. **Hint**: Provide a useful hint that would help a student who is struggling. Example: "Think about edge cases like empty arrays or arrays with only one element."


Please format the question in the following exact way in strict json:
- title: Text (Title of the problem)
- user_id: UUID (Foreign key to the user who created the problem)
- description: Text (Detailed description of the problem)
- constraints: Text (Constraints for the problem)
- testcases: JSONB (Array of test cases, formatted as JSON)
- difficulty: Text (Easy, Medium, Hard)
- xp: Integer (XP ranging from 0 to 100)
- hint: Text (A hint to assist the user)
- created_at: Timestamp (Auto-generated timestamp)

Ensure the question is **clear, well-structured, relevant to their journey, and advances their understanding**.
`;

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        prompt,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
      }
    );

    let raw = response.data.choices[0].text.trim();
    const match = raw.match(/```json([\s\S]*?)```/);
    if (match) {
      raw = match[1].trim();
    } else {
      raw = raw.replace(/```/g, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log("Parsed response:", parsed);
    } catch (err) {
      return res.status(500).json({ error: "Invalid AI response format", raw });
    }
    const { data, error } = await supabase
      .from('questions')  // Table name in Supabase
      .insert([
        {
          title: parsed.title, 
          user_id: user_id, 
          description: parsed.description, 
          constraints: parsed.constraints, 
          testcases: parsed.testcases, 
          difficulty: parsed.difficulty, 
          xp: parsed.xp, 
          hint: parsed.hint,
          topic: topic
        }
      ]);
      if(error) {
        console.error("Error inserting data into Supabase:", error.message);
        return res.status(500).json({ error: "Failed to generate question" });
      }
      else{
        const{data:id,error}= await supabase.from("questions").select("id").eq("title",parsed.title).eq("user_id",user_id).single()
        if(error) { 
          console.error("Error fetching question ID:", error.message);

        }
        console.log("Inserted data:", id);
        res.json({
          id: id.id
        });
    }
  } catch (error) {
    console.error("Together API error:", error.message);
    res.status(500).json({ error: "Failed to generate next question" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
