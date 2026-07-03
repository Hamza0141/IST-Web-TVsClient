import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDisplayScreens } from "../services/publicApi";

export default function DisplaySelectorPage() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadScreens() {
    try {
      setError("");
      const result = await fetchDisplayScreens();
      setScreens(result || []);
    } catch (err) {
      setError(err.message || "Failed to load display screens");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScreens();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-3xl font-bold">Loading displays...</div>
          <div className="mt-3 text-slate-400">
            Fetching available mosque TVs
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-red-200">
            Display unavailable
          </h1>
          <p className="text-red-100">{error}</p>

          <button
            onClick={loadScreens}
            className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h1 className="mb-3 text-4xl font-bold">Mosque TV Displays</h1>
        <p className="mb-6 text-slate-300">
          Choose a registered screen to open.
        </p>

        {screens.length ? (
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
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
            No active display screens found. Create a TV/display screen from the
            admin dashboard first.
          </div>
        )}
      </div>
    </div>
  );
}