import React from 'react';
import { formatClock } from '../utils/formatters';

export default function DisplayHeader({ screen, clock }) {
  return (
    <header className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-emerald-200/80">
            Islamic Society Display
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            {screen?.screen_name || 'Mosque Display'}
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            {screen?.location_name || 'Public display screen'}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 px-5 py-4 text-center">
          <div className="text-sm uppercase tracking-wide text-slate-300">Screen Code</div>
          <div className="mt-1 text-xl font-semibold text-white">{screen?.screen_code}</div>
        </div>

        <div className="rounded-2xl bg-emerald-500/15 px-5 py-4 text-center">
          <div className="text-sm uppercase tracking-wide text-emerald-100">Current Time</div>
          <div className="mt-1 text-2xl font-bold text-white">{formatClock(clock)}</div>
        </div>
      </div>
    </header>
  );
}