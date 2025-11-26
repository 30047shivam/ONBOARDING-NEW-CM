// src/ProgramIntro.jsx
import React from "react";
import supabase from "./supabase";

export default function ProgramIntro({ user, userUuid, onUnlock, next }) {
  const displayName =
    user?.full_name || user?.name || (userUuid ? "Participant" : "Guest");

  const markRead = async () => {
    try {
      // -------------------------------
      // FIXED: correct Supabase v2 format
      // -------------------------------
      const { data: authRes } = await supabase.auth.getUser();
      const authUid = authRes?.user?.id ?? null;

      let query = supabase.from("users");

      if (authUid) {
        query = query.update({ program_read: true }).eq("auth_uid", authUid);
      } else if (userUuid) {
        query = query.update({ program_read: true }).eq("uuid", userUuid);
      } else if (user?.uuid) {
        query = query.update({ program_read: true }).eq("uuid", user.uuid);
      } else {
        if (onUnlock) onUnlock();
        if (next) next();
        return;
      }

      const { error } = await query;
      if (error) {
        alert("Error marking program read: " + error.message);
        console.error(error);
        return;
      }

      if (onUnlock) onUnlock();
      if (next) next();
    } catch (err) {
      alert("Unexpected error: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#0c1524] text-white py-12 px-4">
      <div className="w-full max-w-4xl bg-[#152235] rounded-2xl p-8 shadow-xl border border-gray-700">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-400">
            Welcome — {displayName}
          </h1>
          <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
            Read this short intro carefully — it explains what GeeksforGeeks is
            and how the <span className="font-semibold text-green-300">Campus Mantri</span> program works.
          </p>
        </header>

        {/* WHAT IS GFG */}
        <section className="bg-[#0f1720] p-6 rounded-md mb-5 border border-gray-700">
          <h2 className="text-xl font-bold text-green-300 mb-3">What is GeeksforGeeks (GfG)?</h2>

          <p className="text-gray-300 mb-3">
            <strong>GeeksforGeeks</strong> is one of India’s largest computer
            science learning platforms. It provides tutorials, practice
            problems, interview experiences, online courses, contests, and a
            developer community.
          </p>

          <p className="text-gray-300 mb-3">
            <strong>Founder:</strong> <em>Sandeep Jain</em>, alumnus of IIT Roorkee.
            He started GfG in <strong>2009</strong> as a blog to simplify DSA concepts.
            It grew into a full learning ecosystem used by millions.
          </p>

          <p className="text-gray-300">
            <strong>Why it matters:</strong> Students use GfG for placements,
            DSA, and interview prep. Companies and colleges trust GfG content.
          </p>
        </section>

        {/* WHAT IS GFG CONNECT */}
        <section className="bg-[#0f1720] p-6 rounded-md mb-5 border border-gray-700">
          <h3 className="text-lg font-bold text-green-300 mb-2">What is GfG Connect?</h3>
          <p className="text-gray-300">
            <strong>GfG Connect</strong> is the social platform of GeeksforGeeks
            where users create profiles, posts, and technical content. For
            Campus Mantri, you must submit daily GfG Connect posts.
          </p>
        </section>

        {/* WHAT IS CAMPUS MANTRI */}
        <section className="bg-[#0f1720] p-6 rounded-md mb-5 border border-gray-700">
          <h2 className="text-xl font-bold text-green-300 mb-3">What is the Campus Mantri Program?</h2>

          <p className="text-gray-300 mb-3">
            <strong>Campus Mantri</strong> is GfG’s ambassador program where
            selected students grow a tech community on campus and run events.
          </p>

          <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-3">
            <li><strong>Tenure:</strong> 1 year (approx).</li>
            <li><strong>Responsibilities:</strong> events, outreach, content posting.</li>
            <li><strong>Rewards:</strong> certificates, goodies, recognition.</li>
            <li><strong>Campaign task:</strong> 7 daily GfG Connect posts.</li>
          </ul>
        </section>

        {/* PROGRAM GUIDE - Download only */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-green-300 mb-3">Program Guide / PPT</h3>
          <div className="w-full flex flex-col items-center justify-center py-10">
            <p className="text-gray-300 mb-4 text-center text-lg">If you want to know more, download this file:</p>
            <a
              href="https://drive.google.com/uc?export=download&id=12sQoI8fwY2wSu-6Zhqft7k_U-90HznWO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-bold text-lg shadow"
            >
              Download Program Guide
            </a>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={markRead}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold"
          >
            I have read — Continue
          </button>

          <button
            onClick={() => {
              if (next) next();
              else if (onUnlock) onUnlock();
            }}
            className="bg-transparent border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-lg text-gray-300"
          >
            Skip (already read)
          </button>
        </div>
      </div>
    </div>
  );
}
