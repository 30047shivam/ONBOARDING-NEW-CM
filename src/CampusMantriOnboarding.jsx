// src/CampusMantriOnboarding.jsx
import React, { useState } from "react";
import supabase from "./supabase";

export default function CampusMantriOnboarding({ next }) {
  const [formData, setFormData] = useState({
    college: "",
    fullName: "",
    year: "",
    branch: "",
    phone: "",
    gfg: "",
    linkedin: "",
    instagram: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.college) newErrors.college = "College name is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Valid 10-digit phone number required";
    if (!formData.gfg) newErrors.gfg = "GFG username is required";
    if (!formData.linkedin) newErrors.linkedin = "LinkedIn URL is required";
    if (!formData.instagram) newErrors.instagram = "Instagram URL is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);

      // GET AUTH USER ID
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const auth_uid = auth?.user?.id;

      if (!auth_uid) {
        alert("Login expired. Please log in again.");
        setLoading(false);
        return;
      }

      // PAYLOAD MATCHING YOUR TABLE STRUCTURE EXACTLY
      const payload = {
        email: auth?.user?.email || null,
        auth_uid: auth_uid,
        college: formData.college,
        full_name: formData.fullName,
        year: Number(formData.year),
        branch: formData.branch,
        phone: formData.phone,
        gfg_username: formData.gfg,
        linkedin_url: formData.linkedin,
        instagram_url: formData.instagram,
        city: formData.city,
        state: formData.state,
        daily_posts_count: 0,
        role: "user",
        program_read: false, // important for ProgramIntro
      };

      console.log("Submitting onboarding payload:", payload);

      const { data: insertData, error } = await supabase.from("users").insert(payload).select();

      setLoading(false);

      if (error) {
        console.error("Insert error:", error);
        alert("❌ Error saving details: " + error.message);
        return;
      }

      console.log("Insert result:", insertData);
      alert("🎉 Details saved successfully!");

      // Await parent's next handler so App reloads the user row before UI changes
      if (next) {
        try {
          await next();
          console.log("Called next() after onboarding");
        } catch (nErr) {
          console.error("next() handler error:", nErr);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      setLoading(false);
      alert("An unexpected error occurred. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1524] text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl bg-[#152235] p-10 rounded-2xl shadow-2xl">

        <h1 className="text-center text-4xl font-extrabold text-green-400 mb-10">
          Campus Mantri Onboarding
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {[
            ["college", "College Name", "Enter college name"],
            ["fullName", "Full Name", "Enter your full name"],
            ["year", "Year", ""],
            ["branch", "Branch", "e.g., CSE, ECE"],
            ["phone", "Phone Number", "10-digit phone number"],
            ["gfg", "GFG Username", "Your GFG profile username"],
            ["city", "City", "Enter your city"],
            ["state", "State", "Enter your state"],
            ["linkedin", "LinkedIn URL", "Your LinkedIn profile URL"],
            ["instagram", "Instagram URL", "Your Instagram profile URL"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-2">
                {label}
              </label>

              {name === "year" ? (
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-[#0d1829] border border-green-500 outline-none"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                </select>
                ) : (
                <input
                  name={name}
                  type="text"
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-[#0d1829] border border-green-500 outline-none text-white placeholder-gray-400"
                />
              )}

              {errors[name] && (
                <p className="text-red-400 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={
                "bg-green-500 hover:bg-green-600 text-black text-lg font-bold px-10 py-3 rounded-lg transition " +
                (loading ? "opacity-60 cursor-not-allowed" : "")
              }
            >
              {loading ? "Saving..." : "Submit & Continue →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
