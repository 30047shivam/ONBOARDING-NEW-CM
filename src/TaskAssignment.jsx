// src/TaskAssignment.jsx
import React from "react";

export default function TaskAssignment({ user, next }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1524] text-white px-6 py-12">
      <div className="max-w-3xl w-full bg-[#152235] p-10 rounded-2xl shadow-xl border border-gray-700">

        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Your 7-Day Posting Challenge
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Welcome <span className="text-green-400 font-semibold">{user?.full_name}</span>!
          <br /><br />
          This is your official **Campus Mantri Task Assignment**.  
          For the next **7 days**, you must post once daily on **GFG Connect** and submit the post URL in your dashboard.
        </p>

        <div className="bg-[#0d1829] p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-green-400 mb-3">Your Daily Tasks</h2>
          <ol className="space-y-3 text-gray-300 list-decimal pl-5">
            <li>Write a daily technical, learning, or motivational post on GFG Connect.</li>
            <li>Maintain consistency for all 7 days.</li>
            <li>Copy the URL of each post.</li>
            <li>Paste it inside your User Dashboard under “Daily Posts”.</li>
            <li>Your progress will automatically update each time you save.</li>
          </ol>
        </div>

        <p className="text-gray-300 mb-8">
          After completing all 7 days, your account will be <span className="text-green-400">verified & onboarded</span>.
        </p>

        <button
          onClick={next}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition"
        >
          Start Posting →
        </button>

      </div>
    </div>
  );
}
