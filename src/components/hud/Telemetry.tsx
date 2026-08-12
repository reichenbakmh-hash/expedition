interface TelemetryProps {
  phase: string;
  target: string;
}

export function Telemetry({
  phase,
  target,
}: TelemetryProps) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-cyan-200/10 bg-cyan-200/10">
      <Metric
        label="SIGNAL"
        value={phase}
      />

      <Metric
        label="TARGET"
        value={target}
      />

      <Metric
        label="BEARING"
        value="047.82°"
      />

      <Metric
        label="RANGE"
        value="02.41 KM"
      />

      <Metric
        label="ALTITUDE"
        value="1240 M"
      />

      <Metric
        label="STATUS"
        value="ONLINE"
      />
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-black/55 px-3 py-2">
      <div className="text-[8px] tracking-[0.25em] text-cyan-100/35">
        {label}
      </div>

      <div className="mt-1 truncate text-[10px] font-semibold tracking-wider text-cyan-100/80">
        {value}
      </div>
    </div>
  );
}
