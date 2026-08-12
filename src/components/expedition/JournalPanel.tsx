import { BookOpen } from "lucide-react";

export function JournalPanel() {
  return (
    <section className="hud-panel hud-border">
      <div className="flex items-center gap-2 border-b border-cyan-200/10 px-3 py-2">
        <BookOpen
          size={14}
          strokeWidth={1}
          className="text-cyan-300/50"
        />

        <div className="text-[9px] tracking-[0.25em] text-cyan-100/50">
          FIELD JOURNAL
        </div>
      </div>

      <div className="p-3">
        <div className="text-[8px] tracking-widest text-cyan-100/25">
          ENTRY 001
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-cyan-100/60">
          Every expedition begins with an observation.
          Record what changes, what remains, and what
          you discover between the two.
        </p>

        <button
          type="button"
          className="mt-3 border border-cyan-200/15 px-3 py-2 text-[8px] tracking-[0.2em] text-cyan-200/60 transition hover:bg-cyan-100/5"
        >
          OPEN JOURNAL
        </button>
      </div>
    </section>
  );
}
