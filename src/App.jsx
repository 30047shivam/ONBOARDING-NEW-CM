import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import supabase from "./supabase";

import Login from "./login";
import Register from "./Register";
import ProgramIntro from "./ProgramIntro";
import UserDashboard from "./UserDashboard";
import CampusMantriOnboarding from "./CampusMantriOnboarding";

export default function App() {
  const [session, setSession] = useState(null);
  const [userRow, setUserRow] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // LISTEN FOR SUPABASE SESSION
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  // LOAD USER PROFILE AFTER LOGIN
  useEffect(() => {
    if (!session?.user?.id) {
      setUserRow(null);
      return;
    }
    loadUser(session.user.id);
  }, [session]);

  // When session/userRow change, navigate to the appropriate route
  useEffect(() => {
    // If the user intentionally navigated to registration, don't override that.
    if (location.pathname === '/register') return;

    if (!session) {
      navigate('/login');
      return;
    }

    // user is signed in but profile not found
    if (!userRow) {
      navigate('/onboarding');
      return;
    }

    // profile exists
    if (!userRow.program_read) {
      navigate('/intro');
    } else {
      navigate('/dashboard');
    }
  }, [session, userRow, navigate]);

  // Load user's DB row
  async function loadUser(authUid) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_uid", authUid)
        .maybeSingle();

      console.log("Loaded user row:", data);

      if (error) {
        console.error("Load user error:", error);
        setUserRow(null);
        return;
      }

      if (!data) {
        setUserRow(null);
        return;
      }

      setUserRow(data);
    } catch (err) {
      console.error('Unexpected loadUser error:', err);
      setUserRow(null);
    }
  }

  const AuthHeader = () => (
    <div className="w-full bg-[#07101b] text-white px-6 py-3 flex items-center justify-between">
      <div className="text-sm">{session?.user?.email || session?.user?.id}</div>
      <div>
        {session ? (
          <>
            <button
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                } catch (e) {
                  console.warn('Sign out failed:', e?.message || e);
                }
                setSession(null);
                setUserRow(null);
                navigate('/login');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
            >
              Sign Out
            </button>
          </>
        ) : null}


      </div>
    </div>
  );

  return (
    <div>
      <AuthHeader />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onSwitchToRegister={async () => {
                try {
                  await supabase.auth.signOut();
                } catch (e) {
                  console.warn('Sign out before register failed:', e?.message || e);
                }
                setSession(null);
                setUserRow(null);
                navigate('/register');
              }}
            />
          }
        />
        <Route path="/register" element={<Register onRegistered={() => navigate('/login')} />} />
        <Route path="/onboarding" element={<CampusMantriOnboarding next={async () => { await loadUser(session.user.id); }} />} />
        <Route path="/intro" element={userRow ? <ProgramIntro userUuid={userRow.auth_uid} onUnlock={async () => { await loadUser(session.user.id); }} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={userRow ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
