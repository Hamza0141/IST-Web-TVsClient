import React from 'react';

export default function AnnouncementPanel({ announcements }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
      <h2 className="mb-4 text-2xl font-semibold text-white">Announcements</h2>

      <div className="space-y-3">
        {announcements.length ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
                  {announcement.priority}
                </span>
              </div>
              <p className="text-base leading-7 text-slate-200">{announcement.body}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-6 text-slate-300">
            No active announcements
          </div>
        )}
      </div>
    </section>
  );
}