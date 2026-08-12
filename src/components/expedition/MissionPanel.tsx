import { ChevronRight, Crosshair } from "lucide-react";
import type { Mission } from "@/data/missions";

interface MissionPanelProps {
  missions: Mission[];
  onSelect: (name: string) => void;
}

export function MissionPanel({
  missions,
  onSelect,
}: MissionPanelProps) {
  return (
    <section className="hud-panel hud-border">
      <div className="flex items-center justify-between border-b border-cyan-200/10 px-3 py-2">
        <div>
          <div className="text-[8px] tracking-[0.3em] text-cyan-100/35">
            EXPEDITION DATABASE
          </div>

          <div className="display mt-0.5 text-sm text-cyan-50">
            MISSION CONTROL
          </div>
        </div>

        <Crosshair
          size={15}
          strokeWidth={1}
          className="text-cyan-300/50"
        />
      </div>

      <div className="divide-y divide-cyan-100/10">
        {missions.map((mission) => (
          <button
            key={mission.id}
            type="button"
            onClick={() => onSelect(mission.title)}
            className="group flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-cyan-100/5 active:bg-cyan-100/10"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-cyan-100/15 text-[9px] text-cyan-200/50">
              {mission.code}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[10px] font-semibold tracking-wider text-cyan-50/90">
                  {mission.title}
                </span>

                <span className="text-[7px] text-cyan-200/35">
                  {mission.status}
                </span>
              </div>

              <p className="mt-1 truncate text-[8px] leading-relaxed text-cyan-100/35">
                {mission.description}
              </p>

              <div className="mt-2 h-[2px] bg-cyan-100/5">
                <div
                  className="h-full bg-cyan-300/60 transition-all"
                  style={{
                    width: `${mission.progress}%`,
                  }}
                />
              </div>
            </div>

            <ChevronRight
              size={13}
              className="text-cyan-200/20 transition group-hover:translate-x-0.5 group-hover:text-cyan-200/60"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
