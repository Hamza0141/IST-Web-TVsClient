import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDisplayData } from "../services/publicApi";
import { getNextPrayer, getCountdown } from "../utils/prayerUtils";
import { formatTime, formatClock } from "../utils/formatters";
import mosqueLogo from "../assets/logo/ISTlogo.png";

function buildTodayDateFromTime(timeString) {
  if (!timeString) return null;

  const parts = String(timeString).split(":");
  const h = Number(parts[0] || 0);
  const m = Number(parts[1] || 0);
  const s = Number(parts[2] || 0);

  const date = new Date();
  date.setHours(h, m, s, 0);
  return date;
}

function getIqamahCountdownPrayer(prayers) {
  if (!Array.isArray(prayers) || prayers.length === 0) return null;

  const now = Date.now();

  for (const prayer of prayers) {
    if (!prayer?.iqama_time) continue;

    const iqamahDate = buildTodayDateFromTime(prayer.iqama_time);
    if (!iqamahDate) continue;

    const diffMs = iqamahDate.getTime() - now;

    if (diffMs > 0 && diffMs <= 60000) {
      return {
        ...prayer,
        iqamahDate,
        diffMs,
      };
    }
  }

  return null;
}

function formatSecondsCountdown(targetDate) {
  if (!targetDate) return "00:00";

  const diffMs = targetDate.getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.ceil(diffMs / 1000));

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function AnalogClock({ clock }) {
  const seconds = clock.getSeconds();
  const minutes = clock.getMinutes();
  const hours = clock.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const markers = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[320px] w-[320px] rounded-full border-[6px] border-slate-300 bg-white shadow-xl md:h-[380px] md:w-[380px]">
        {markers.map((marker) => {
          const rotation = marker * 30;
          const isMain = marker % 3 === 0;

          return (
            <div
              key={marker}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
            >
              <div
                className={`rounded-full ${
                  isMain ? "h-4 w-4 bg-slate-400" : "h-2.5 w-2.5 bg-slate-300"
                }`}
                style={{
                  transform: "translateY(-150px)",
                }}
              />
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow">
          <img
            src={mosqueLogo}
            alt="Mosque logo"
            className="h-10 w-10 object-contain"
          />
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-10 h-[90px] w-[8px] origin-bottom rounded-full bg-slate-500"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 z-10 h-[125px] w-[6px] origin-bottom rounded-full bg-slate-400"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 z-10 h-[140px] w-[3px] origin-bottom rounded-full bg-red-500"
          style={{
            transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
          }}
        />

        <div className="absolute left-1/2 top-1/2 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />
      </div>

      <div className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
        {formatClock(clock)}
      </div>
    </div>
  );
}

export default function DisplayPage() {
  const { screenCode } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clock, setClock] = useState(new Date());
  const [sceneIndex, setSceneIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const scenes = ["prayers", "announcements", "slides"];

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchDisplayData(screenCode);

        if (mounted) {
          setData(result);
          setLoading(false);
          setError("");
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load display");
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [screenCode]);

  const prayers = data?.prayers || [];
  const announcements = data?.announcements || [];
  const slides = data?.slides || [];
  const screen = data?.screen || null;
  const hijri = data?.hijri || null;
  const readableDate = data?.readable_date || "";
  const gregorian = data?.gregorian || null;

  const nextPrayer = useMemo(() => getNextPrayer(prayers), [prayers, clock]);

  const iqamahCountdownPrayer = useMemo(() => {
    return getIqamahCountdownPrayer(prayers);
  }, [prayers, clock]);

const hijriText = useMemo(() => {
  if (!hijri) return "Smart Mosque System";

  const monthEn = hijri?.month?.en || "";
  const monthAr = hijri?.month?.ar || "";

  if (monthEn && monthAr) {
    return `${hijri.day} ${monthEn} (${monthAr}) ${hijri.year}`;
  }

  return `${hijri.day} ${monthEn || monthAr} ${hijri.year}`;
}, [hijri]);

  const gregorianText = useMemo(() => {
    if (readableDate) return readableDate;
    if (gregorian?.date) return gregorian.date;
    return "";
  }, [readableDate, gregorian]);

  useEffect(() => {
    if (iqamahCountdownPrayer) {
      setSceneIndex(0);
    }
  }, [iqamahCountdownPrayer]);

  useEffect(() => {
    if (!data) return;

    const currentScene = scenes[sceneIndex];
    let duration = 10000;

    if (currentScene === "prayers") {
      duration = 22000;
      if (iqamahCountdownPrayer) {
        duration = 1000;
      }
    }

    if (currentScene === "announcements") {
      duration = 9000;
    }

    if (currentScene === "slides") {
      const currentSlide = slides[slideIndex];
      duration = (currentSlide?.duration_seconds || 10) * 1000;
    }

    const timer = setTimeout(() => {
      if (currentScene === "prayers" && iqamahCountdownPrayer) {
        return;
      }

      if (currentScene === "slides") {
        if (slideIndex < slides.length - 1) {
          setSlideIndex((prev) => prev + 1);
          return;
        }
        setSlideIndex(0);
      }

      setSceneIndex((prev) => (prev + 1) % scenes.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [sceneIndex, slideIndex, slides, data, iqamahCountdownPrayer]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <div className="text-center">
          <div className="text-4xl font-bold">Loading Display...</div>
          <div className="mt-3 text-lg text-slate-500">
            Connecting to mosque display API
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-900">
        <div className="w-full max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
          <div className="text-3xl font-bold text-red-600">
            Display unavailable
          </div>
          <p className="mt-4 text-xl text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const currentScene = scenes[sceneIndex];
  const currentSlide = slides[slideIndex];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-8 py-6">
        <header className="mb-6 border-b border-slate-300 pb-5">
          <div className="flex items-center gap-5">
            <img
              src={mosqueLogo}
              alt="IST logo"
              className="h-20 w-20 object-contain"
            />

            <div>
              <h1 className="text-4xl font-bold">Islamic Society of Tulsa</h1>
              <p className="mt-1 text-2xl text-slate-500">{hijriText}</p>
              {gregorianText ? (
                <p className="mt-1 text-lg text-slate-400">{gregorianText}</p>
              ) : null}
            </div>

            <div className="ml-auto rounded-2xl bg-white px-5 py-3 shadow">
              <div className="text-sm uppercase tracking-wide text-slate-400">
                Screen
              </div>
              <div className="text-lg font-semibold">{screen?.screen_code}</div>
            </div>
          </div>
        </header>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
          {currentScene === "prayers" && (
            <>
              {iqamahCountdownPrayer ? (
                <div className="flex min-h-[75vh] flex-col items-center justify-center text-center">
                  <div className="mb-4 text-2xl font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Iqamah Countdown
                  </div>

                  <h2 className="text-6xl font-bold md:text-7xl">
                    {iqamahCountdownPrayer.prayer_name}
                  </h2>

                  <p className="mt-4 text-3xl text-slate-600 md:text-4xl">
                    Iqamah starts in
                  </p>

                  <div className="mt-8 rounded-[32px] bg-emerald-600 px-10 py-8 text-white shadow-xl">
                    <div className="text-7xl font-bold tracking-wider md:text-8xl">
                      {formatSecondsCountdown(iqamahCountdownPrayer.iqamahDate)}
                    </div>
                  </div>

                  <p className="mt-8 text-2xl text-slate-500">
                    Please prepare for prayer
                  </p>
                </div>
              ) : (
                <div className="grid min-h-[75vh] grid-cols-1 items-center gap-10 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="flex justify-center">
                    <AnalogClock clock={clock} />
                  </div>

                  <div>
                    <div className="mb-6 text-center xl:text-left">
                      <h2 className="text-5xl font-bold">Prayer Times</h2>
                      {nextPrayer ? (
                        <p className="mt-3 text-2xl text-emerald-700">
                          Next: {nextPrayer.prayer_name} •{" "}
                          {getCountdown(nextPrayer.prayerDate)}
                        </p>
                      ) : null}
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                      <div className="grid grid-cols-3 bg-slate-200 px-6 py-4 text-xl font-semibold">
                        <div>Salah</div>
                        <div className="text-center">Adhan</div>
                        <div className="text-center">Iqamah</div>
                      </div>

                      {prayers.map((p) => (
                        <div
                          key={p.id}
                          className="grid grid-cols-3 border-t border-slate-200 px-6 py-5 text-2xl"
                        >
                          <div className="font-semibold">{p.prayer_name}</div>
                          <div className="text-center">
                            {formatTime(p.adhan_time)}
                          </div>
                          <div className="text-center">
                            {formatTime(p.iqama_time)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {currentScene === "announcements" && (
            <div className="flex min-h-[75vh] flex-col justify-center">
              <div className="mb-10 text-center">
                <h2 className="text-6xl font-bold">Announcements</h2>
              </div>

              <div className="mx-auto w-full max-w-5xl space-y-6">
                {announcements.length ? (
                  announcements.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <h3 className="text-3xl font-bold">{a.title}</h3>
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold uppercase text-emerald-800">
                          {a.priority}
                        </span>
                      </div>
                      <p className="text-2xl leading-10 text-slate-700">
                        {a.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-2xl text-slate-500">
                    No announcements
                  </div>
                )}
              </div>
            </div>
          )}

          {currentScene === "slides" && (
            <div className="flex min-h-[75vh] flex-col items-center justify-center">
              {currentSlide?.image_url ? (
                <img
                  src={currentSlide.image_url}
                  alt={currentSlide?.title || "Slide"}
                  className="mb-8 max-h-[52vh] w-auto rounded-3xl object-contain shadow-lg"
                />
              ) : null}

              <h2 className="text-center text-5xl font-bold">
                {currentSlide?.title}
              </h2>

              {currentSlide?.message ? (
                <p className="mt-6 max-w-5xl text-center text-2xl leading-10 text-slate-600">
                  {currentSlide.message}
                </p>
              ) : null}

              <div className="mt-8 text-lg text-slate-400">
                Slide {slideIndex + 1} of {slides.length || 1}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}