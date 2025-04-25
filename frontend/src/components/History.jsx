import React from 'react';
import { useUserDataContext } from '../context/UserDataContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const History = () => {
  const { userData } = useUserDataContext();
  const navigate = useNavigate(); // Initialize the navigate function
  const history = userData?.history || [
    { title: "Two Sum", topic: "Arrays", status: "Completed", id: 1 },
    { title: "Valid Parentheses", topic: "Stacks", status: "In Progress", id: 2 },
    { title: "Merge Two Sorted Lists", topic: "Linked Lists", status: "Completed", id: 3 }
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-white">Problem History</h2>
      <div className="hidden md:flex justify-between px-4 text-lg font-semibold text-gray-400 mb-2">
        <div className="w-1/3 text-center">Title</div>
        <div className="w-1/3 text-center">Topic</div>
        <div className="w-1/3 text-center">Status</div>
      </div>
      <div className="space-y-4">
        {history.map((problem, index) => (
          <div
            key={index}
            className="p-4 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300 bg-zinc-800"
          >
            <div className="flex flex-col md:flex-row md:items-center text-center justify-between">
              <button
                className="w-full md:w-1/3 text-lg font-semibold text-blue-300 hover:underline"
                onClick={() => {
                  // Navigate to the coding playground page with question_id
                  navigate(`/codingplayground/${problem.id}`);
                }}
              >
                {problem.title}
              </button>
              <p className="w-full md:w-1/3 text-sm text-gray-300">
                {problem.topic}
              </p>
              <p className="w-full md:w-1/3 text-sm">
                <span
                  className={`font-semibold ${
                    problem.status === 'Completed'
                      ? 'text-green-400'
                      : 'text-yellow-400'
                  }`}
                >
                  {problem.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
