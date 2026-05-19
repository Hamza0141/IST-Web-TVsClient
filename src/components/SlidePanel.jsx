import React, { useEffect, useState } from 'react';

export default function SlidePanel({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;

    const activeSlide = slides[currentIndex] || slides[0];
    const duration = Math.max(Number(activeSlide?.duration_seconds || 10), 3) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [slides, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  const slide = slides[currentIndex];

  if (!slide) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/20 text-lg text-white/70">
          No active slides
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Display Slides</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
        {slide.image_url ? (
          <div className="grid min-h-[320px] grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <img
              src={slide.image_url}
              alt={slide.title}
              className="h-full min-h-[320px] w-full object-cover"
            />
            <div className="flex flex-col justify-center gap-4 p-6">
              <h3 className="text-3xl font-bold text-white">{slide.title}</h3>
              {slide.message ? (
                <p className="text-lg leading-8 text-slate-200">{slide.message}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col justify-center gap-4 p-8">
            <h3 className="text-4xl font-bold text-white">{slide.title}</h3>
            {slide.message ? (
              <p className="max-w-4xl text-xl leading-9 text-slate-200">{slide.message}</p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}