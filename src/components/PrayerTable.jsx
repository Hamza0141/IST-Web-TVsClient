import React from 'react';
import { formatTime } from '../utils/formatters';
import { getCountdown } from '../utils/prayerUtils';

export default function PrayerTable({ prayers, nextPrayer }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-white">Prayer Schedule</h2>
        {nextPrayer ? (
          <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-right">
            <div className="text-sm text-emerald-100">Next Prayer</div>
            <div className="text-lg font-semibold text-white">
              {nextPrayer.prayer_name} • {getCountdown(nextPrayer.prayerDate)}
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-3 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
          <div>Prayer</div>
          <div className="text-center">Adhan</div>
          <div className="text-center">Iqama</div>
        </div>

        {prayers.length ? (
          prayers.map((prayer) => {
            const isNext = nextPrayer?.prayer_name === prayer.prayer_name;

            return (
              <div
                key={prayer.id}
                className={`grid grid-cols-3 items-center border-t border-white/10 px-4 py-4 text-lg text-white ${
                  isNext ? 'bg-emerald-400/15' : 'bg-transparent'
                }`}
              >
                <div className="font-semibold">{prayer.prayer_name}</div>
                <div className="text-center">{formatTime(prayer.adhan_time)}</div>
                <div className="text-center">{formatTime(prayer.iqama_time)}</div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-8 text-center text-slate-300">No active prayer settings</div>
        )}
      </div>
    </section>
  );
}