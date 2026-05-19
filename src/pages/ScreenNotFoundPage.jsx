import React from 'react';
import { Link } from 'react-router-dom';

export default function ScreenNotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <h1 className="mb-3 text-3xl font-bold">Screen not found</h1>
        <p className="mb-6 text-slate-300">
          The display page you requested does not exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}