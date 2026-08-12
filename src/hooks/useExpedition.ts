import { useCallback, useEffect, useState } from "react";

export type ExpeditionPhase =
  | "SCANNING"
  | "ACQUIRING"
  | "TRACKING"
  | "LOCKED";

const phases: ExpeditionPhase[] = [
  "SCANNING",
  "ACQUIRING",
  "TRACKING",
  "LOCKED",
];

export function useExpedition() {
  const [phase, setPhase] =
    useState<ExpeditionPhase>("SCANNING");

  const [paused, setPaused] =
    useState(false);

  const [target, setTarget] =
    useState("ORIGIN");

  const advance = useCallback(() => {
    setPhase((current) => {
      const index = phases.indexOf(current);
      return phases[(index + 1) % phases.length];
    });
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(
      advance,
      2400
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [paused, advance]);

  const selectTarget = useCallback(
    (name: string) => {
      setTarget(name);
      setPhase("ACQUIRING");
    },
    []
  );

  return {
    phase,
    paused,
    target,
    setPaused,
    selectTarget,
  };
}
