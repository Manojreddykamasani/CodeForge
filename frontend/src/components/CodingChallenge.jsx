import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { useUserContext } from '../context/UserContext';
import { useCodeContext } from '../context/CodeContext';
import { useNavigationContext } from '../context/NavigationContext';

const CodingChallenge = () => {
  const {questionId}=useParams()
    const { goToCodingPlayground } = useNavigationContext();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passedTests, setPassedTests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [isloading,setisloading] =useState(false);
const [hasSubmission, setHasSubmission] = useState(false);
  const { user } = useUserContext();
  const [testres,settestres]=useState([]);
  const user_id = user?.id || null;  
  const { 
    question,
    loading: questionLoading, 
    error: questionError,
    loadQuestion ,
    setQuestion
  } = useCodeContext();
  useEffect(() => {
    setHasSubmission(false);
    const fetch = async () => {
      await loadQuestion(questionId);
      
      // Check for existing submission
      const { data, error } = await supabase
        .from("submissions")
        .select("code,language")
        .eq("user_id", user_id)
        .eq("question_id", questionId)
        .single();
  
      if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error
        console.log("error fetching code:", error);
      }
  
      if (data) {
        setHasSubmission(true); // Question exists in submissions
        const safeLanguage = data.language || 'python';
        setLanguage(safeLanguage);
        setEditorLanguage(safeLanguage === 'csharp' ? 'cpp' : safeLanguage);
        setCode(data.code || '');
      } else {
        setHasSubmission(false);
        setCode('');
        setLanguage('python');
        setEditorLanguage('python');
      }
    };
    setAnalysis(null)
    setWeaknesses([]);
    setOutput('');
    setAttempts(0);
    setTimeTaken(0);
    setStartTime(null);
    setShowHint(false);
    setSubmitted(false);
    setPassedTests(0);
    setisloading(false);
    setLoading(false);
    fetch();
  }, [questionId, user_id]); // Add user_id to dependencies
  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
  ];

const visibleTestCases = question?.testcases?.slice(0,2);  // Ensure question and testcases are defined
const totalTestCases = question?.testcases?.length || 0;  // Default to 0 if testcases is not defined

  useEffect(() => {
    setCode('');
    setEditorLanguage(language === 'csharp' ? 'cpp' : language);
    setStartTime(Date.now());
  }, [language]);
  const handleNext = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
    .from("submissions")
    .select("question_id, questions(title)")
    .eq("user_id",user_id);
    if(error){
      console.log("error fetching solved questions")
    }
    const titles = data.map((item) => item.questions.title);

      const response = await axios.post("https://codeforge-2sfs.onrender.com/generate/next", {
        user_id:user_id,
        topic: question.topic,
        weaknesses:weaknesses,
        solved_questions:titles
      });
  

      goToCodingPlayground(question.topic);
  
    } catch (err) {
      console.error("Failed to load next question:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleRun = async () => {
    setisloading(true);
    setOutput("Running code against visible test cases...");
    
    try {
      const res = await axios.post("https://codeforge-2sfs.onrender.com/submit", {
        language,
        source_code: code,
        testCases: visibleTestCases,
      });

      const formattedOutput = res.data.results.map((result, index) => {
        return `Test Case ${index + 1}:\n` +
               `Input: ${visibleTestCases[index].input}\n` +
               `Expected: ${visibleTestCases[index].output}\n` +
               `Received: ${result.actual_output}\n` +
               `Status: ${result.passed ? '✓ Passed' : '✗ Failed'}\n` +
               `${result.error ? `Error: ${result.error}\n` : ''}` +
               `----------------------------------`;
      }).join('\n\n');

      setOutput(formattedOutput);
      const {data,error}= await supabase.from("questions").update({code:code,language:language}).eq("id",questionId).eq("user_id",user_id).select();
      if(error){
        console.error("Error updating code:", error);
      }
    } catch (error) {
      setOutput("Error running code. Please check your implementation.");
    } finally {
      setisloading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    setTimeTaken(timeSpent);
    setAttempts(prev => prev + 1);
    setSubmitted(true);
    
    try {
      const {data,error} = await supabase.from("questions").update({code:code,language:language}).eq("id",questionId).eq("user_id",user_id).select();
      if(error) console.log("error updating code:", error);
  
      const res = await axios.post("https://codeforge-2sfs.onrender.com/submit", {
        language,
        source_code: code,
        testCases: question.testcases,
      });
      
      settestres(res.data); // Set the test results in state
      const passedCount = res.data.results.filter(result => result.passed).length;
      setPassedTests(passedCount);
  
      if (passedCount == totalTestCases) {
        setOutput(`✓ All ${totalTestCases} test cases passed!\nTime taken: ${timeSpent} seconds\nAttempts: ${attempts + 1}`);
        
      } else {
        console.log("Not all test cases passed");
        const failedDetails = res.data.results
          .filter(result => !result.passed)
          .map((result, index) => `Failed Test ${index + 1}: Expected ${result.expected_output}, Got ${result.actual_output}`)
          .join('\n');
        
        setOutput(`✗ ${passedCount}/${totalTestCases} test cases passed\n\nFailed Cases:\n${failedDetails}\n\nTime taken: ${timeSpent} seconds\nAttempts: ${attempts + 1}`);
      }
  
      // Use res.data directly instead of testres
      try {
        const w = await axios.post("https://codeforge-2sfs.onrender.com/weakness", { user_id });
        setWeaknesses(w.data.weaknesses);
  
        const analysisRes = await axios.post("https://codeforge-2sfs.onrender.com/analyze", {
          code,
          language,
          question,
          testResults: res.data.results, // Use res.data instead of testres.results
          attempts: attempts + 1,
          timeSpentInSeconds: timeSpent,
          previousWeaknesses: weaknesses,
          user_id
        });
  
        const { error: submissionError } = await supabase.from("submissions").insert([{
          question_id: questionId,
          user_id: user_id,
          code: code,
          language: language,
          test_results: res.data.results, // Use res.data here too
          time_spent: timeSpent,
          attempts: attempts + 1,
          xp: question.xp
        }]);
  
        if(submissionError) console.error("failed saving submission:", submissionError);
        
        setAnalysis(analysisRes.data.analysis);
        setWeaknesses(analysisRes.data.weaknesses);
      } catch (analysisError) {
        console.log("Analysis failed:", analysisError);
      }
    } catch (error) {
      setOutput("Error submitting code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };
  if (!question) return <div>Loading question...</div>;


  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 bg-gray-800 overflow-y-auto p-6 border-r border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400 mb-4">{question.title}</h1>
          <p className="mb-4 text-gray-300">{question.description}</p>
          
          <div className="mb-4">
  <h2 className="text-lg font-semibold text-blue-400 mb-2">Constraints:</h2>
  <p className="font-mono text-sm text-gray-300 bg-gray-700 p-2 rounded">
    {question.constraints}
  </p>
</div>
          

<div>
  <h2 className="text-lg font-semibold text-blue-400 mb-2">Sample Test Cases:</h2>
  {visibleTestCases.map((testcase, index) => (
    <div key={index} className="mb-4 bg-gray-700 p-3 rounded">
      <p className="font-mono text-sm text-gray-200 mb-1">
        <span className="text-blue-300">Input:</span>
        {testcase.input.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : ''}
            {line}
          </span>
        ))}
      </p>
      <p className="font-mono text-sm text-gray-200">
        <span className="text-blue-300">Output:</span>
        {testcase.output.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : ''}
            {line}
          </span>
        ))}
      </p>
    </div>
  ))}
</div>
          <div>
          <button 
              onClick={handleNext}
              className="mt-4 bg-red-600 hover:bg-red-700 text-black font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              Skip
            </button>
  
</div>

          
          {attempts >= 3 && !showHint && (
            <button 
              onClick={toggleHint}
              disabled={loading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              Need Help? Get a Hint
            </button>
          )}
          
          {showHint && (
            <div className="mt-4 bg-gray-700 p-4 rounded border border-blue-500">
              <h3 className="text-blue-400 font-semibold mb-2">Hint</h3>
              <p className="text-gray-300">{question.hint}</p>
            </div>
          )}
        </div>
        
        <div className="w-1/2 flex flex-col bg-gray-800 border-l border-gray-700">
          <div className="flex items-center justify-between bg-gray-900 p-2 border-b border-gray-700">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-400">
              {attempts > 0 && <span>Attempts: {attempts} | </span>}
              {timeTaken > 0 && <span>Time: {timeTaken}s</span>}
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              width="100%"
              language={editorLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          
          <div className="bg-gray-900 p-4 border-t border-gray-700">
            <div className="flex space-x-3">
              <button 
                onClick={handleRun}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-black font-medium py-2 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isloading ? 'Running...' : 'Run (2 Tests)'}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : `Submit (${totalTestCases} Tests)`}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 border-t border-gray-700 flex-1 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Output</h3>
            <div className="bg-gray-800 p-3 rounded font-mono text-sm whitespace-pre-wrap">
              {output || "Run or submit your code to see output"}
            </div>
            
            {(analysis ) && (
              <div className="mt-3 bg-gray-800 p-3 rounded">
                <h4 className="text-md font-semibold text-green-400 mb-1">Analysis</h4>
                <p className="text-gray-300 text-sm mb-2">{analysis}</p>
                {weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-yellow-400 mb-1">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-300">
                      {weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {(hasSubmission || analysis) &&(
              <button
              onClick={handleNext}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-black font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Next Challenge
            </button>
            )

            }
            
            {submitted && !analysis && (
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(passedTests / totalTestCases) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {passedTests} of {totalTestCases} test cases passed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;