// src/Register.jsx
import React, { useState } from "react";
import supabase from "./supabase";

export default function Register({ onRegistered }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔍 Validation
  function validate() {
    if (!form.email.includes("@")) return "Valid email required";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);

    // 1️⃣ Create Supabase Auth user
    const { data: auth, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    // We only collect email and password here. Save a minimal pending profile
    // so that after the user logs in we can create the users row and then
    // show the Program Intro (program_read: false).
    let uid = auth.user?.id;

    // If no session was created, leave auth.uid blank; the login flow will
    // re-fetch the user id after signing in and the login handler will insert
    // pending_profile using the authenticated session.

    const pendingProfile = {
      auth_uid: uid || null,
      email: form.email,
      daily_posts_count: 0,
      program_read: false,
      role: "user",
    };

    try {
      localStorage.setItem(
        `pending_profile:${form.email}`,
        JSON.stringify(pendingProfile)
      );
    } catch (err) {
      console.error("Could not save pending profile:", err);
    }

    alert("🎉 Account created. Please sign in to complete setup.");
    setLoading(false);
    onRegistered(); // return to login
  }

  return (
    <div className="min-h-screen bg-[#0c1524] text-white px-6 py-10">
      <h1 className="text-center text-4xl font-extrabold text-green-400 mb-10">
        Campus Mantri Registration
      </h1>

      <form
        onSubmit={submit}
        className="max-w-5xl mx-auto bg-[#152235] p-10 rounded-2xl shadow-xl"
      >
        {error && (
          <p className="bg-red-600 p-3 mb-4 rounded text-center">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-6">
          <input name="email" placeholder="Email" onChange={handle}
            className="p-3 rounded bg-[#0d1829] border border-green-500 text-white placeholder-gray-400" />

          <input type="password" name="password" placeholder="Create Password"
            onChange={handle}
            className="p-3 rounded bg-[#0d1829] border border-green-500 text-white placeholder-gray-400" />
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-green-500 hover:bg-green-600 text-lg font-bold text-black py-3 rounded-lg"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
