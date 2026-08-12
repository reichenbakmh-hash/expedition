import type React from "react";

interface HudFrameProps {
  children: React.ReactNode;
}

export function HudFrame({
  children,
}: HudFrameProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030607] text-cyan-100">
      <div className="hud-grid absolute inset-0 opacity-60" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(28,120,132,0.10),transparent_55%)]" />

      <div className="relative z-10 min-h-screen">
        {children}
      </div>

      <div className="scanlines" />
      <div className="vignette" />
    </main>
  );
}
