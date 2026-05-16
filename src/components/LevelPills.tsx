import { CSSProperties } from "react";

/**
 * Shared Practise level selector pills.
 * Used by Split, +10, and Halves/Quarters/Eighths Practise screens.
 * Labels: Warming Up / Getting There / Champion
 * Stars:  ★☆☆ / ★★☆ / ★★★
 */
interface LevelPillsProps {
  level: number;
  onChange: (l: number) => void;
  l3Unlocked: boolean;
}

interface PillDef {
  n: number;
  label: string;
  stars: string;
  bg: string;
  border: string;
  color: string;
  activeShadow: string;
}

const PILLS: PillDef[] = [
  {
    n: 1,
    label: "Warming Up",
    stars: "★☆☆",
    bg: "#E8F5E9",
    border: "#A5D6A7",
    color: "#1B5E20",
    activeShadow: "0 3px 10px rgba(102,187,106,0.35)",
  },
  {
    n: 2,
    label: "Getting There",
    stars: "★★☆",
    bg: "#E3F2FD",
    border: "#90CAF9",
    color: "#0D47A1",
    activeShadow: "0 3px 10px rgba(66,165,245,0.35)",
  },
  {
    n: 3,
    label: "Champion",
    stars: "★★★",
    bg: "#F5F5F5",
    border: "#E0E0E0",
    color: "#9E9E9E",
    activeShadow: "0 3px 10px rgba(156,39,176,0.25)",
  },
];

const LevelPills = ({ level, onChange, l3Unlocked }: LevelPillsProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        justifyContent: "flex-start",
        marginBottom: "12px",
      }}
    >
      {PILLS.map((p) => {
        const locked = p.n === 3 && !l3Unlocked;
        const isActive = level === p.n && !locked;

        const style: CSSProperties = {
          borderRadius: "99px",
          padding: "5px 12px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: locked ? "default" : "pointer",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "12px",
          fontWeight: isActive ? 800 : 700,
          transition: "all 200ms ease",
          border: `1.5px solid ${p.border}`,
          whiteSpace: "nowrap",
          background: p.bg,
          color: p.color,
          opacity: locked ? 0.5 : isActive ? 1 : 0.6,
          transform: isActive ? "translateY(-1px)" : "none",
          boxShadow: isActive ? p.activeShadow : "none",
          pointerEvents: locked ? "none" : "auto",
        };

        return (
          <button
            key={p.n}
            type="button"
            onClick={() => !locked && onChange(p.n)}
            disabled={locked}
            style={style}
            aria-pressed={isActive}
          >
            <span style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
              {p.stars}
            </span>
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LevelPills;
