import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDisplayScreens } from "../services/publicApi";

export default function DisplaySelectorPage() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadScreens() {
      try {
        const result = await fetchDisplayScreens();
        setScreens(result);
      } catch (err) {
        setError(err.message || "Failed to load display screens");
      } finally {
        setLoading(false);
      }
    }

    loadScreens();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading displays...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h1 className="mb-3 text-4xl font-bold">Mosque TV Displays</h1>
        <p className="mb-6 text-slate-300">Choose a screen to open.</p>

        <div className="space-y-3">
          {screens.map((screen) => (
            <Link
              key={screen.id}
              to={`/display/${screen.screen_code}`}
              className="block rounded-2xl bg-emerald-600 px-5 py-4 text-lg font-semibold text-white hover:bg-emerald-500"
            >
              {screen.screen_name}
              <div className="text-sm font-normal text-emerald-100">
                {screen.location_name || screen.screen_code}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}