import { useEffect, useState } from "react";

type Strategy = "splitStrategy" | "plusTen" | "halvesQuartersEighths";
type SplitFocus = "tens" | "ones" | "total";

interface Question {
  a: number;
  b: number;
}

interface Props {
  strategy: Strategy;
  /** Hint button never renders on Level 1. */
  level: 2 | 3;
  /** Session counter — page-managed. Hint hides when >= 3 consecutive correct. */
  consecutiveCorrect: number;
  /** Session counter — page-managed. Hint shows again when >= 2 consecutive wrong. */
  consecutiveWrong: number;
  /** Optional — used for the visual (Stage 2) hint animation (split / plusTen). */
  question?: Question;
  /** Split-strategy only — which input the child is working on right now. */
  inputFocus?: SplitFocus;
  /** Fraction strategy only — re-key the visual so it replays when the question changes. */
  hintKey?: string | number;
}

const ACCENT = "#1D9E75"; // --colour-active-border
const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const GREEN = "#22C55E";

const getTip = (strategy: Strategy, level: 2 | 3, focus: SplitFocus): string => {
  if (strategy === "splitStrategy") {
    if (level === 3) {
      return "Split each number into tens and ones. Add the tens, then the ones, then put them together.";
    }
    if (focus === "ones") {
      return "Look at the last digit. That's the ones. What number is it?";
    }
    if (focus === "total") {
      return "You've got the parts — now add your tens answer and your ones answer together.";
    }
    return "Look at the first digit. That tells you the tens. What is it worth?";
  }
  if (strategy === "halvesQuartersEighths") {
    if (level === 2) {
      return "Remember — quarters come from halving twice. Tap the shape again.";
    }
    return "Eighths come from halving three times — half, then quarter, then eighth. How many parts are there?";
  }
  // plusTen
  if (level === 2) {
    return "Count the tens blocks. How many tens are there now altogether?";
  }
  return "You might cross 100 here. Count all the tens first, then add the ones.";
};

/* ─── Stage 2 visual hints ─── */

const SplitVisualHint = ({ q }: { q: Question }) => {
  const big = q.a;
  const t = Math.floor(big / 10) * 10;
  const o = big % 10;
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{
            background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)`,
            animation: "fade-out 0.6s ease-out 0.6s both",
          }}
        >
          {big}
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.5s ease-out 0.8s both" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ backgroundColor: BLUE }}>
            {t}
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground">tens</span>
        </div>
        <div className="flex flex-col items-center" style={{ animation: "slideRight 0.5s ease-out 0.8s both" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ backgroundColor: ORANGE }}>
            {o}
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground">ones</span>
        </div>
      </div>
      <p className="text-[13px] font-medium text-foreground">Now you try the next step.</p>
    </div>
  );
};

const Plus10VisualHint = ({ q }: { q: Question }) => {
  const aTens = Math.floor(q.a / 10);
  const aOnes = q.a % 10;
  const bTens = Math.floor(q.b / 10);
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex items-end gap-1.5">
        {Array.from({ length: aTens }).map((_, i) => (
          <div key={`bt${i}`} className="rounded-md" style={{ width: 12, height: 48, backgroundColor: BLUE }} />
        ))}
        {Array.from({ length: bTens }).map((_, i) => (
          <div
            key={`gt${i}`}
            className="rounded-md"
            style={{
              width: 12,
              height: 48,
              backgroundColor: GREEN,
              animation: `slideDown 0.7s ease-out ${0.2 + i * 0.15}s both`,
            }}
          />
        ))}
        {aOnes > 0 && <div className="ml-1.5 w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: BLUE }} />}
      </div>
      <p className="text-[13px] font-medium text-foreground">Now you try the next step.</p>
    </div>
  );
};

export const PractiseHintButton = ({
  strategy,
  level,
  consecutiveCorrect,
  consecutiveWrong,
  question,
  inputFocus = "tens",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [showVisual, setShowVisual] = useState(false);

  // Reset open/visual state whenever the question or level changes.
  useEffect(() => {
    setOpen(false);
    setShowVisual(false);
  }, [strategy, level, question?.a, question?.b]);

  const hidden = consecutiveCorrect >= 3 && consecutiveWrong < 2;
  if (hidden) return null;

  const tip = getTip(strategy, level, inputFocus);

  return (
    <>
      {/* Toggle button — absolute top-right of the parent question card */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="absolute z-10 rounded-md border bg-transparent px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[hsl(var(--secondary))]"
        style={{ top: 14, right: 14, borderColor: ACCENT, color: ACCENT }}
      >
        {open ? "Hide hint ↑" : "Need a hint?"}
      </button>

      {/* Inline expanding hint card */}
      {open && (
        <div
          className="overflow-hidden rounded-md border border-border bg-secondary text-muted-foreground"
          style={{
            marginTop: 10,
            padding: 12,
            fontSize: 13,
            animation: "slideDown 0.2s ease-out",
          }}
        >
          <p className="text-[13px] leading-snug text-foreground">{tip}</p>

          {!showVisual && (
            <button
              type="button"
              onClick={() => setShowVisual(true)}
              className="mt-2 text-[12px] font-medium underline-offset-2 hover:underline"
              style={{ color: ACCENT }}
            >
              Still stuck? Show me
            </button>
          )}

          {showVisual && question && (
            strategy === "splitStrategy" ? <SplitVisualHint q={question} /> : <Plus10VisualHint q={question} />
          )}
        </div>
      )}
    </>
  );
};

export default PractiseHintButton;
