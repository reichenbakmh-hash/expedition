import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Renders a set of orbiting "contacts" (potential mission targets) drifting
 * around the radar sweep. Each contact is a pulsing blip that moves on its
 * own circular path at its own speed, and can be tapped to select it as the
 * active target — same callback contract as MissionPanel's onSelect.
 */

interface RadarContactsProps {
  missions: any[];
  onSelect: (label: string) => void;
  activeTarget?: string;
  resetKey?: number;
  paused?: boolean;
}

function getMissionLabel(mission: any, index: number): string {
  return (
    mission?.label ??
    mission?.name ??
    mission?.title ??
    (typeof mission === "string" ? mission : `TARGET-${index + 1}`)
  );
}

function getMissionId(mission: any, index: number): string {
  return String(mission?.id ?? getMissionLabel(mission, index) ?? index);
}

// Pre-computes a ring of [left%, top%] keyframes around the panel's center
// so each contact glides along a smooth circular path (no rotation applied
// to the element itself, so its label stays upright the whole way round).
function buildOrbitKeyframes(
  radius: number,
  startAngleDeg: number,
  clockwise: boolean,
  steps = 36,
) {
  const left: string[] = [];
  const top: string[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const direction = clockwise ? 1 : -1;
    const angleDeg = startAngleDeg + direction * (360 * (i / steps));
    const angleRad = (angleDeg * Math.PI) / 180;

    left.push(`${(50 + radius * Math.cos(angleRad)).toFixed(2)}%`);
    top.push(`${(50 + radius * Math.sin(angleRad)).toFixed(2)}%`);
  }

  return { left, top };
}

export function RadarContacts({
  missions,
  onSelect,
  activeTarget,
  resetKey = 0,
  paused = false,
}: RadarContactsProps) {
  const contacts = useMemo(() => {
    const list = (missions ?? []).slice(0, 6); // keep the sweep readable

    return list.map((mission, index) => {
      const id = getMissionId(mission, index);
      const label = getMissionLabel(mission, index);

      const angleOffset = (360 / Math.max(list.length, 1)) * index;
      const radius = 26 + (index % 3) * 9; // vary orbit distance, in % of panel
      const duration = 20 + index * 5.5; // vary sweep speed per contact
      const clockwise = index % 2 === 0;

      const { left, top } = buildOrbitKeyframes(
        radius,
        angleOffset,
        clockwise,
      );

      return { id, label, duration, left, top };
    });
  }, [missions]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {contacts.map((contact) => (
        <motion.button
          key={`${contact.id}-${resetKey}`}
          type="button"
          onClick={() => onSelect(contact.label)}
          title={`Acquire ${contact.label}`}
          className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          initial={{ left: contact.left[0], top: contact.top[0] }}
          animate={
            paused
              ? { left: contact.left[0], top: contact.top[0] }
              : { left: contact.left, top: contact.top }
          }
          transition={{
            duration: contact.duration,
            repeat: paused ? 0 : Infinity,
            ease: "linear",
          }}
        >
          <motion.span
            className={
              activeTarget === contact.label
                ? "block h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                : "block h-1.5 w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_8px_rgba(103,232,249,0.7)]"
            }
            animate={
              paused
                ? { scale: 1, opacity: 0.7 }
                : { scale: [1, 1.5, 1], opacity: [0.55, 1, 0.55] }
            }
            transition={{
              duration: 2,
              repeat: paused ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          <span className="whitespace-nowrap rounded-sm border border-cyan-100/15 bg-black/60 px-1.5 py-0.5 text-[7px] tracking-widest text-cyan-100/70">
            {contact.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
