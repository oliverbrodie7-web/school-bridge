import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   DevPanel — BUILD-TIME ONLY. Remove before shipping to kids.
   - Jump menu across the Split journey (See it / We Do / You Do / Practise levels)
   - Optional per-exercise jump buttons (passed in by the page)
   - "Instant" toggle: pages/engine read this to speed count-along + accept any answer
   The instant flag is shared via a tiny module-level store so the engine can read it
   without prop-drilling through every page.
   ============================================================ */

type Listener = (v: boolean) => void;
let instantOn = false;
const listeners = new Set<Listener>();

export const isInstant = () => instantOn;
export const setInstant = (v: boolean) => {
  instantOn = v;
  listeners.forEach((fn) => fn(v));
};
export const subscribeInstant = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const JOURNEY: { label: string; to: string }[] = [
  { label: "See it", to: "/learn/split-strategy" },
  { label: "We Do", to: "/learn/split-strategy/we-do" },
  { label: "You Do", to: "/learn/split-strategy/you-do" },
  { label: "Practise", to: "/practise/split-strategy" },
];

export interface DevJump {
  label: string;
  onJump: () => void;
}

export interface DevPanelProps {
  /** Optional per-exercise (or per-level) jump buttons for the current page. */
  jumps?: DevJump[];
  /** Show the instant-mode toggle (default true). */
  showInstant?: boolean;
}

const wrap: React.CSSProperties = {
  position: "fixed",
  bottom: 12,
  left: 12,
  zIndex: 9999,
  fontFamily: "system-ui, sans-serif",
};

const bubble: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  background: "#111827",
  color: "#fff",
  fontSize: 16,
  fontWeight: 800,
  boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
};

const panel: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  borderRadius: 12,
  padding: 12,
  width: 250,
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  color: "#9CA3AF",
  margin: "2px 0 6px",
};

const chip: React.CSSProperties = {
  border: "1px solid #374151",
  background: "#1F2937",
  color: "#E5E7EB",
  borderRadius: 8,
  padding: "5px 9px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

export const DevPanel = ({ jumps, showInstant = true }: DevPanelProps) => {
  const [open, setOpen] = useState(false);
  const [inst, setInst] = useState(isInstant());
  const navigate = useNavigate();

  const toggleInstant = () => {
    const v = !inst;
    setInst(v);
    setInstant(v);
  };

  return (
    <div style={wrap}>
      {open ? (
        <div style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#F87171" }}>DEV · remove before ship</span>
            <button onClick={() => setOpen(false)} style={{ ...chip, padding: "2px 8px" }}>✕</button>
          </div>

          <div style={sectionLabel}>Jump to page</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {JOURNEY.map((j) => (
              <button key={j.to} onClick={() => navigate(j.to)} style={chip}>
                {j.label}
              </button>
            ))}
          </div>

          {jumps && jumps.length > 0 && (
            <>
              <div style={sectionLabel}>Jump on this page</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {jumps.map((j, i) => (
                  <button key={i} onClick={j.onJump} style={chip}>
                    {j.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {showInstant && (
            <>
              <div style={sectionLabel}>Speed</div>
              <button
                onClick={toggleInstant}
                style={{
                  ...chip,
                  width: "100%",
                  background: inst ? "#065F46" : "#1F2937",
                  borderColor: inst ? "#10B981" : "#374151",
                  color: inst ? "#A7F3D0" : "#E5E7EB",
                }}
              >
                Instant mode: {inst ? "ON (fast + accepts any answer)" : "OFF"}
              </button>
            </>
          )}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={bubble} title="Dev tools">
          ⚙
        </button>
      )}
    </div>
  );
};

export default DevPanel;
