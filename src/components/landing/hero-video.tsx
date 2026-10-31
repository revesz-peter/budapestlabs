"use client";

import { useEffect, useRef } from "react";

// Particle video background from the previous hero. Not rendered right now,
// kept so it can be dropped back in behind a section.
const HERO_VIDEO =
  "https://videos.pexels.com/video-files/35968183/15249566_1920_1080_30fps.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = videoRef.current;
    if (!video) return;

    if (media.matches) {
      video.pause();
      return;
    }

    video.play().catch(() => undefined);

    const onChange = () => {
      if (media.matches) video.pause();
      else video.play().catch(() => undefined);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-1 overflow-hidden rounded-3xl border border-border aspect-2/3 lg:aspect-video lg:rounded-[3rem]">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="not-dark:invert size-full -scale-x-100 object-cover"
        src={HERO_VIDEO}
      />
    </div>
  );
}
