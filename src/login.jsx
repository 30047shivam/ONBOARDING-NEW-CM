// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabase";

export default function Login({ onSwitchToRegister }) {
  const navigate = useNavigate();
  // provide a fallback navigation in case the prop wasn't passed
  const goToRegister =
    onSwitchToRegister ||
    (async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out (before register) failed or no session:', e?.message || e);
      }
      navigate('/register');
    });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    // No need to call onLogin
    // App.jsx session listener handles everything
    // After successful sign-in, check for a pending profile saved during registration
    try {
      const key = `pending_profile:${email}`;
      const pending = localStorage.getItem(key);
      if (pending) {
        const profile = JSON.parse(pending);

        // Ensure email and auth_uid are present on the profile before inserting.
        // Fetch the authenticated user details (should be available after sign-in).
        try {
          const { data: authData, error: authErr } = await supabase.auth.getUser();
          if (authErr) console.warn('Could not fetch auth user for profile enrichment:', authErr.message || authErr);
          const authUser = authData?.user;
          if (authUser) {
            profile.auth_uid = profile.auth_uid || authUser.id;
            profile.email = profile.email || authUser.email;
          }
        } catch (e) {
          console.warn('Error fetching auth user:', e?.message || e);
        }

        // Insert profile using the authenticated session (satisfies RLS)
        const { error: insertErr } = await supabase.from('users').insert([profile]);
        if (insertErr) {
          console.error('Failed to insert pending profile:', insertErr);
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch (err) {
      console.error('Error handling pending profile:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#23272b] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Curved background */}
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-[#23272b] via-[#444] to-[#23272b] rounded-b-[50%] z-0" style={{height:'60vh'}}></div>
      {/* Campus Mantri Heading and Microphone stacked above login box */}
      <div className="w-full flex flex-col items-center z-10 animate-fadein" style={{marginBottom:'-2vh', marginTop:'2vh'}}>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-white text-6xl font-extrabold tracking-tight drop-shadow-lg" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>CAMPUS</span>
            {/* Microphone SVG, angled and with sound lines */}
            <span className="inline-block animate-bounce" style={{transform:'rotate(-25deg)'}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <g>
                  <rect x="16" y="10" width="8" height="14" rx="4" fill="#222"/>
                  <rect x="18" y="24" width="4" height="6" rx="2" fill="#222"/>
                  <ellipse cx="20" cy="17" rx="6" ry="6" fill="#27ae60"/>
                  {/* Sound lines */}
                  <path d="M32 8 l3 -3" stroke="#27ae60" strokeWidth="2"/>
                  <path d="M33 13 l5 -1" stroke="#27ae60" strokeWidth="2"/>
                  <path d="M32 18 l3 3" stroke="#27ae60" strokeWidth="2"/>
                </g>
              </svg>
            </span>
          </div>
          <span className="text-white text-6xl font-extrabold tracking-tight drop-shadow-lg mt-2" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>MANTRI</span>
        </div>
        <span className="text-green-400 text-2xl font-bold mt-4 tracking-wide">THE CAMPUS AMBASSADOR PROGRAM BY</span>
        <span className="text-green-500 text-3xl font-extrabold mt-2 tracking-wide" style={{fontFamily:'Montserrat, Arial, sans-serif'}}>GeeksforGeeks</span>
      </div>
      {/* Animated Login Box */}
      <div className="flex justify-center items-start w-full" style={{minHeight:'20vh', marginTop:'2vh'}}>
        <form
          onSubmit={submit}
          className="w-full max-w-md p-8 bg-[#152235] rounded-xl shadow-2xl z-20 animate-slidein"
        >
        <h2 className="text-3xl text-green-400 font-bold mb-6 text-center">Login</h2>
        {err && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm">{err}</div>
        )}
        <label className="text-gray-300 text-sm mb-1">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded bg-[#0d1829] border border-gray-700 outline-none text-white placeholder-gray-400"
        />
        <label className="text-gray-300 text-sm mb-1">Password</label>
        <div className="relative mb-4">
          <input
            required
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 rounded bg-[#0d1829] border border-gray-700 outline-none text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-gray-400 text-sm"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-semibold mb-3"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="mt-4">
          <button
            type="button"
            onClick={goToRegister}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
          >
            Start From Here
          </button>
        </div>
        </form>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(-40px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slidein { from { opacity: 0; transform: translateY(60px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes bounce { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-12px);} }
        .animate-fadein { animation: fadein 1s cubic-bezier(.4,0,.2,1) 0.2s both; }
        .animate-slidein { animation: slidein 1s cubic-bezier(.4,0,.2,1) 0.6s both; }
        .animate-bounce { animation: bounce 1.2s infinite; }
      `}</style>
    </div>
  );
}
