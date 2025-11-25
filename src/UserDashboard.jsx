// src/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import supabase from "./supabase";
import ProgramIntro from "./ProgramIntro";
import VerificationMessage from "./VerificationMessage";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayUrls, setDayUrls] = useState({});
  const [gfgProfileUrl, setGfgProfileUrl] = useState("");
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);

    try {
      // FIXED: Correct Supabase v2 response
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const authUid = auth?.user?.id;

      if (!authUid) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch user row
      const { data, error: fetchErr } = await supabase
        .from("users")
        .select("*")
        .eq("auth_uid", authUid)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (!data) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(data);

      // Store URLs separately for editing
      setDayUrls({
        day1_url: data.day1_url ?? "",
        day2_url: data.day2_url ?? "",
        day3_url: data.day3_url ?? "",
        day4_url: data.day4_url ?? "",
        day5_url: data.day5_url ?? "",
        day6_url: data.day6_url ?? "",
        day7_url: data.day7_url ?? "",
      });

      // Set GFG Connect profile link from DB
      setGfgProfileUrl(data.gfg_profile_url ?? "");
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Update Daily Post Link
  // -----------------------------
  async function updateDay(dayKey) {
    if (!profile) return alert("Profile missing.");

    // Duplicate URL validation
    const urlToSave = dayUrls[dayKey]?.trim();
    if (urlToSave) {
      const otherKeys = Object.keys(dayUrls).filter((k) => k !== dayKey);
      for (const k of otherKeys) {
        if (dayUrls[k]?.trim() === urlToSave) {
          alert("Invalid: This URL is already used in another day.");
          return;
        }
      }
    }

    setSavingKey(dayKey);

    try {
      // Calculate new daily_posts_count
      const updatedDayUrls = { ...dayUrls, [dayKey]: urlToSave };
      const postCount = Object.values(updatedDayUrls).filter((v) => v && v.trim()).length;

      const { error } = await supabase
        .from("users")
        .update({ [dayKey]: urlToSave || null, daily_posts_count: postCount })
        .eq("auth_uid", profile.auth_uid);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, [dayKey]: urlToSave, daily_posts_count: postCount }));
      alert("Saved.");
      setTimeout(loadProfile, 300); // Only reload after successful save
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSavingKey(null);
    }
  }

  // -----------------------------
  // Save GFG Connect profile URL
  // -----------------------------
  async function saveGfgProfile() {
    try {
      await supabase
        .from("users")
        .update({ gfg_profile_url: gfgProfileUrl })
        .eq("auth_uid", profile.auth_uid);

      setProfile((prev) => ({ ...prev, gfg_profile_url: gfgProfileUrl }));
      alert("Saved.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  // ================================
  // LOADING STATE
  // ================================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  // ================================
  // ERROR STATE
  // ================================
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Could not load profile. {error}
      </div>
    );

  // ================================
  // NO PROFILE
  // ================================
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-[#152235] p-8 rounded">
          <h2 className="text-xl text-green-400 mb-3">No profile found</h2>
          <p className="mb-4 text-gray-300">
            Please complete onboarding.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 px-4 py-2 rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );

  // ================================
  // SHOW PROGRAM INTRO FIRST
  // ================================
  if (!profile.program_read) {
    return (
      <ProgramIntro
        userUuid={profile.auth_uid}
        onUnlock={() => loadProfile()}
      />
    );
  }

  // ================================
  // MAIN DASHBOARD
  // ================================
  const completedCount = [
    profile.day1_url,
    profile.day2_url,
    profile.day3_url,
    profile.day4_url,
    profile.day5_url,
    profile.day6_url,
    profile.day7_url,
  ].filter(Boolean).length;

  // If all 7 days are completed, show verification message
  if (completedCount === 7) {
    return <VerificationMessage />;
  }

  return (
    <div className="min-h-screen p-8 bg-[#0c1524] text-white">
      <div className="max-w-5xl mx-auto">
        {/* INSTRUCTIONAL VIDEO SECTION */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4">How to Complete Your Daily Task</h2>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              src="https://drive.google.com/file/d/1YSgclmuaWKDbFxl_5PEMIHtbYWmExdcZ/preview"
              title="Instructional Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-64 rounded-lg border border-green-400 shadow-lg"
            ></iframe>
          </div>
          <p className="text-gray-300">Watch this video to understand what the daily task is, how to submit your post URL, and see an example submission.</p>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-400">
            Welcome, {profile.full_name}
          </h1>
          <div className="flex gap-4">
            <div className="text-gray-300">Progress: {completedCount}/7</div>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="bg-[#152235] p-6 rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400">College</p>
              <p>{profile.college}</p>
            </div>
            <div>
              <p className="text-gray-400">GfG Username</p>
              <p>{profile.gfg_username}</p>
            </div>
          </div>
        </div>

        {/* GFG PROFILE URL */}
        <div className="bg-[#152235] p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-3">GfG Connect profile</h2>
          <div className="flex gap-3">
            <input
              value={gfgProfileUrl}
              onChange={(e) => setGfgProfileUrl(e.target.value)}
              className="flex-1 p-3 bg-[#0d1829] border border-gray-700 rounded"
            />
            <button
              onClick={saveGfgProfile}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>

        {/* DAILY LINKS */}
        <div className="bg-[#152235] p-6 rounded">
          <h3 className="text-lg font-semibold mb-4">
            Daily posts — paste your post URL and save
          </h3>

          {Array.from({ length: 7 }).map((_, i) => {
            const key = `day${i + 1}_url`;
            // Check for duplicate URL in UI
            const url = dayUrls[key]?.trim();
            const isDuplicate = url && Object.keys(dayUrls).some((k) => k !== key && dayUrls[k]?.trim() === url);
            return (
              <div key={key} className="flex gap-3 items-center mb-3">
                <div className="w-20 text-gray-300">Day {i + 1}</div>
                <input
                  className={`flex-1 p-3 bg-[#0d1829] border rounded ${isDuplicate ? 'border-red-500' : 'border-gray-700'}`}
                  value={dayUrls[key] ?? ""}
                  onChange={(e) =>
                    setDayUrls({ ...dayUrls, [key]: e.target.value })
                  }
                />
                <button
                  disabled={savingKey === key || isDuplicate}
                  onClick={() => updateDay(key)}
                  className="bg-green-500 px-4 py-2 rounded"
                >
                  {savingKey === key ? "Saving..." : "Save"}
                </button>
                {isDuplicate && (
                  <span className="text-red-400 text-xs ml-2">Invalid: duplicate URL</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
