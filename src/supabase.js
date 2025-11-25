// src/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://retojeevyyuyvdhywmla.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldG9qZWV2eXl1eXZkaHl3bWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTI5NDAsImV4cCI6MjA3OTI4ODk0MH0.9Vcsk_HWokJ7LSZgjbGGfgO29KBQ7U8fO2aALzOVaL4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Expose client to window in development for easy debugging (temporary)
if (typeof window !== "undefined") {
  // attach as a dev-only helper; safe to remove for production
  // eslint-disable-next-line no-undef
  window.supabase = supabase;
}

export default supabase;
