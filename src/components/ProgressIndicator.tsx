// Standalone component — inserted directly into each page's question
// card region. When pages are refactored to use a shared QuestionCard
// wrapper, this component should move inside that wrapper instead.

import { CSSProperties } from "react";

type LearnPhase = "ido" | "wedo" | "youdo";

interface ProgressIndicatorProps {
  mode: "learn" | "practise";
  phase?: LearnPhase;       // required when mode === "learn"
  current: number;
  total: number;
  level?: 1 | 2 | 3;        // required when mode === "practise"
}

const TEAL = "#1D9E75";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_BORDER = "#5DCAA5";
const TEAL_TEXT = "#0F6E56";

const pillBase: CSSProperties = {
  fontSize: 11,
  padding: "3px 10px",
  borderRadius: 99,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
};

const counterStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: TEAL_TEXT,
  marginTop: 6,
  paddingRight: 80, // clearance for absolute hint button on L2/L3
  textAlign: "right",
};

const trackStyle: CSSProperties = {
  width: "100%",
  height: 6,
  backgroundColor: TEAL_LIGHT,
  borderRadius: 99,
  overflow: "hidden",
  marginTop: 6,
  marginBottom: 12,
};

const fillStyle = (pct: number): CSSProperties => ({
  width: `${pct}%`,
  height: "100%",
  backgroundColor: TEAL,
  borderRadius: 99,
  transition: "width 300ms ease",
});

type PillState = "done" | "active" | "upcoming";

const Pill = ({ label, state }: { label: string; state: PillState }) => {
  const style: CSSProperties = { ...pillBase };
  if (state === "done") {
    style.backgroundColor = TEAL;
    style.color = "#FFFFFF";
    style.border = "none";
    style.fontWeight = 500;
  } else if (state === "active") {
    style.backgroundColor = TEAL_LIGHT;
    style.color = TEAL_TEXT;
    style.border = `0.5px solid ${TEAL_BORDER}`;
    style.fontWeight = 500;
  } else {
    style.backgroundColor = "transparent";
    style.color = "var(--color-text-tertiary, hsl(var(--muted-foreground)))";
    style.border = "0.5px solid var(--color-border-secondary, hsl(var(--border)))";
    style.fontWeight = 400;
  }
  return <span style={style}>{label}</span>;
};

const phasePillStates = (phase: LearnPhase): Record<LearnPhase, PillState> => {
  if (phase === "ido") return { ido: "active", wedo: "upcoming", youdo: "upcoming" };
  if (phase === "wedo") return { ido: "done", wedo: "active", youdo: "upcoming" };
  return { ido: "done", wedo: "done", youdo: "active" };
};

export const ProgressIndicator = ({
  mode,
  phase,
  current,
  total,
  level,
}: ProgressIndicatorProps) => {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const pct = (safeCurrent / safeTotal) * 100;

  if (mode === "learn") {
    const activePhase: LearnPhase = phase ?? "ido";
    const states = phasePillStates(activePhase);
    const counterLabel =
      activePhase === "ido"
        ? `Example ${safeCurrent} of ${safeTotal}`
        : `Question ${safeCurrent} of ${safeTotal}`;

    return (
      <div className="w-full" data-progress-indicator="learn">
        <div
          className="flex flex-wrap items-center"
          style={{ gap: 6, justifyContent: "flex-start" }}
        >
          <Pill label="I Do" state={states.ido} />
          <Pill label="We Do" state={states.wedo} />
          <Pill label="You Do" state={states.youdo} />
        </div>
        <div style={counterStyle}>{counterLabel}</div>
        <div style={trackStyle}>
          <div style={fillStyle(pct)} />
        </div>
      </div>
    );
  }

  // practise mode
  return (
    <div
      className="w-full"
      data-progress-indicator="practise"
      data-level={level ?? ""}
    >
      <div style={counterStyle}>
        Question {safeCurrent} of {safeTotal}
      </div>
      <div style={trackStyle}>
        <div style={fillStyle(pct)} />
      </div>
    </div>
  );
};

export default ProgressIndicator;
