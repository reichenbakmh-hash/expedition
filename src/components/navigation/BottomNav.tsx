import {
  Compass,
  Database,
  Map,
  Radio,
} from "lucide-react";

interface BottomNavProps {
  active: string;
  onChange: (value: string) => void;
}

const items = [
  {
    id: "EXPEDITION",
    label: "EXPEDITION",
    icon: Compass,
  },
  {
    id: "MAP",
    label: "MAP",
    icon: Map,
  },
  {
    id: "LOG",
    label: "LOG",
    icon: Database,
  },
  {
    id: "SIGNAL",
    label: "SIGNAL",
    icon: Radio,
  },
];

export function BottomNav({
  active,
  onChange,
}: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-100/10 bg-[#030607]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl items-stretch">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className="flex flex-1 flex-col items-center gap-1 px-2 py-3"
            >
              <Icon
                size={15}
                strokeWidth={selected ? 1.8 : 1}
                className={
                  selected
                    ? "text-cyan-200"
                    : "text-cyan-100/25"
                }
              />

              <span
                className={
                  selected
                    ? "text-[7px] tracking-[0.18em] text-cyan-100/80"
                    : "text-[7px] tracking-[0.18em] text-cyan-100/25"
                }
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
