import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Pause,
  Play,
  Radio,
  RotateCcw,
} from "lucide-react";

import {
  TargetingUI,
} from "@/components/ui/animated-hud-targeting-ui";

import { HudFrame } from "@/components/hud/HudFrame";
import { Telemetry } from "@/components/hud/Telemetry";

import { MissionPanel } from "@/components/expedition/MissionPanel";
import { JournalPanel } from "@/components/expedition/JournalPanel";
import { RadarContacts } from "@/components/expedition/RadarContacts";
import MapView from "@/components/MapView";

import { BottomNav } from "@/components/navigation/BottomNav";

import { missions } from "@/data/missions";

import { useExpedition } from "@/hooks/useExpedition";
import {
  createDefaultExpedition,
  loadExpedition,
  saveExpedition,
} from "@/lib/storage";
import type { LatLng } from "@/types";

function App() {
  const {
    phase,
    paused,
    target,
    setPaused,
    selectTarget,
  } = useExpedition();

  const [activeTab, setActiveTab] =
    useState("EXPEDITION");

  const [resetKey, setResetKey] = useState(0);

  const [expedition, setExpedition] = useState(
    () => loadExpedition() ?? createDefaultExpedition(),
  );

  useEffect(() => {
    saveExpedition(expedition);
  }, [expedition]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const position: LatLng = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        };

        setExpedition((current) => ({
          ...current,
          currentPosition: position,
        }));
      },
      () => {
        // Denied or unavailable — the stored/fallback position stays as is.
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const handleMapClick = useCallback((position: LatLng) => {
    setExpedition((current) => ({
      ...current,
      currentPosition: position,
      route: [...current.route, position],
    }));
  }, []);

  const resetTargeting = () => {
    setResetKey((value) => value + 1);
    setPaused(false);
  };

  return (
    <HudFrame>
      <div className="mx-auto min-h-screen max-w-7xl pb-20">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-cyan-100/10 px-4 py-4">
          <div>
            <div className="display text-xl tracking-[0.25em] text-cyan-50">
              EXPEDITION
            </div>

            <div className="mt-1 flex items-center gap-2 text-[7px] tracking-[0.25em] text-cyan-100/30">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
              SYSTEM ONLINE
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Activity
                size={14}
                strokeWidth={1}
                className="text-cyan-300/50"
              />

              <span className="text-[8px] tracking-widest text-cyan-100/50">
                E-OS / 01
              </span>
            </div>

            <div className="mt-1 text-[7px] text-cyan-100/25">
              PERSONAL EXPLORATION SYSTEM
            </div>
          </div>
        </header>

        {/* MAIN HUD */}
        {activeTab === "EXPEDITION" && (
          <>
            <section className="relative px-3 pt-3">
              <div className="relative min-h-[430px] overflow-hidden border border-cyan-100/10 bg-black/30">
                {/* Targeting animation */}
                <div
                  key={resetKey}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <TargetingUI
                    className="h-[390px] w-full max-w-[430px]"
                    pathColors={{
                      light: "#c9faff",
                      dark: "#c9faff",
                    }}
                  />
                </div>

                {/* MOVING TARGETS */}
                <RadarContacts
                  missions={missions}
                  onSelect={selectTarget}
                  activeTarget={target}
                  resetKey={resetKey}
                  paused={paused}
                />

                {/* TOP LEFT */}
                <div className="absolute left-3 top-3">
                  <div className="text-[7px] tracking-[0.25em] text-cyan-100/30">
                    ACQUISITION
                  </div>

                  <div className="mt-1 text-[11px] font-semibold tracking-widest text-cyan-100/80">
                    {phase}
                  </div>
                </div>

                {/* TOP RIGHT */}
                <div className="absolute right-3 top-3 text-right">
                  <div className="text-[7px] tracking-[0.25em] text-cyan-100/30">
                    TARGET
                  </div>

                  <div className="mt-1 text-[11px] font-semibold tracking-widest text-cyan-100/80">
                    {target}
                  </div>
                </div>

                {/* BOTTOM LEFT */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-2">
                    <Radio
                      size={13}
                      strokeWidth={1}
                      className="text-cyan-300/50"
                    />

                    <span className="text-[8px] tracking-widest text-cyan-100/40">
                      SENSOR FEED
                    </span>
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    type="button"
                    title={
                      paused
                        ? "Resume sweep"
                        : "Hold sweep"
                    }
                    onClick={() =>
                      setPaused(!paused)
                    }
                    className="flex h-8 w-8 items-center justify-center border border-cyan-100/15 bg-black/50 text-cyan-100/60 transition hover:border-cyan-100/35 hover:text-cyan-100"
                  >
                    {paused ? (
                      <Play size={13} />
                    ) : (
                      <Pause size={13} />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Reset targeting"
                    onClick={resetTargeting}
                    className="flex h-8 w-8 items-center justify-center border border-cyan-100/15 bg-black/50 text-cyan-100/60 transition hover:border-cyan-100/35 hover:text-cyan-100"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
            </section>

            {/* TELEMETRY */}
            <section className="px-3 pt-3">
              <Telemetry
                phase={phase}
                target={target}
              />
            </section>

            {/* MISSIONS */}
            <section className="grid gap-3 px-3 pt-3 lg:grid-cols-2">
              <MissionPanel
                missions={missions}
                onSelect={selectTarget}
              />

              <JournalPanel />
            </section>
          </>
        )}

        {/* MAP */}
        {activeTab === "MAP" && (
          <section className="p-3">
            <div className="map-panel panel">
              <MapView
                position={expedition.currentPosition}
                route={expedition.route}
                waypoints={expedition.waypoints}
                onMapClick={handleMapClick}
              />
            </div>
          </section>
        )}

        {/* LOG */}
        {activeTab === "LOG" && (
          <section className="p-3">
            <JournalPanel />
          </section>
        )}

        {/* SIGNAL */}
        {activeTab === "SIGNAL" && (
          <section className="p-3">
            <div className="hud-panel hud-border min-h-[650px] p-5">
              <div className="text-[8px] tracking-[0.3em] text-cyan-100/30">
                SIGNAL MONITOR
              </div>

              <div className="mt-5 flex h-32 items-end gap-1 overflow-hidden border border-cyan-100/10 p-3">
                {Array.from({
                  length: 48,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-cyan-300/50"
                    style={{
                      height: `${15 + ((index * 37) % 75)}%`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 text-[8px] leading-relaxed text-cyan-100/35">
                SIGNAL STABILITY: 98.4%
                <br />
                CHANNEL: E-01
                <br />
                TRANSMISSION: ACTIVE
              </div>
            </div>
          </section>
        )}
      </div>

      <BottomNav
        active={activeTab}
        onChange={setActiveTab}
      />
    </HudFrame>
  );
}

export default App;
