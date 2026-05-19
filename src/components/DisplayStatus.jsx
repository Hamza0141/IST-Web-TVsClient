import React from 'react';
import { formatDateTime } from '../utils/formatters';

export default function DisplayStatus({ screen, slides, announcements, prayers }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
      <h2 className="mb-3 text-2xl font-semibold text-white">Display Status</h2>
      <div className="space-y-2 text-base text-slate-200">
        <p>Total Slides: {slides.length}</p>
        <p>Total Announcements: {announcements.length}</p>
        <p>Total Prayers: {prayers.length}</p>
        <p>Last Seen: {screen?.last_seen_at ? formatDateTime(screen.last_seen_at) : 'Updating live'}</p>
      </div>
    </section>
  );
}