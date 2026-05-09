import { useEffect, useState } from "react";

type Strategy = "splitStrategy" | "plusTen";
type SplitFocus = "tens" | "ones" | "total";

interface Question {
  a: number;
  b: number;
}

interface Props {
  strategy: Strategy;
  level: 1 | 2 | 3;
  /** Session counter — page-managed. Hint hides when >= 3 consecutive correct. */
  consecutiveCorrect: number;
  /** Session counter — page-managed. Hint shows again when >= 2 consecutive wrong. */
  consecutiveWrong: number;
  /** Optional — used for the visual (Stage 2) hint animation. */
  question?: Question;
  /** Split-strategy only — which input the child is working on right now. */
  inputFocus?: SplitFocus;
}

const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const GREEN = "#22C55E";

const getTip = (strategy: Strategy, level: 1 | 2 | 3, focus: SplitFocus): string => {
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
  // plusTen
  if (level === 1) {
    return "When we add 10, only the tens digit changes. Look at the tens — what comes next?";
  }
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
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
          style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)`, animation: "fade-out 0.6s ease-out 0.6s both" }}
        >
          {big}
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.5s ease-out 0.8s both" }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white" style={{ backgroundColor: BLUE }}>
            {t}
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground">tens</span>
        </div>
        <div className="flex flex-col items-center" style={{ animation: "slideRight 0.5s ease-out 0.8s both" }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white" style={{ backgroundColor: ORANGE }}>
            {o}
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground">ones</span>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">Now you try the next step.</p>
    </div>
  );
};

const Plus10VisualHint = ({ q }: { q: Question }) => {
  const aTens = Math.floor(q.a / 10);
  const aOnes = q.a % 10;
  const bTens = Math.floor(q.b / 10);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-end gap-1.5">
        {Array.from({ length: aTens }).map((_, i) => (
          <div key={`bt${i}`} className="rounded-md" style={{ width: 14, height: 56, backgroundColor: BLUE }} />
        ))}
        {Array.from({ length: bTens }).map((_, i) => (
          <div
            key={`gt${i}`}
            className="rounded-md"
            style={{
              width: 14,
              height: 56,
              backgroundColor: GREEN,
              animation: `slideDown 0.7s ease-out ${0.2 + i * 0.15}s both`,
            }}
          />
        ))}
        {aOnes > 0 && <div className="ml-1.5 w-3 h-3 rounded-sm" style={{ backgroundColor: BLUE }} />}
      </div>
      <p className="text-sm font-medium text-foreground">Now you try the next step.</p>
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
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  // Reset back to the small button whenever the question changes or the level changes.
  useEffect(() => {
    setStage(0);
  }, [strategy, level, question?.a, question?.b]);

  const hidden = consecutiveCorrect >= 3 && consecutiveWrong < 2;
  if (hidden) return null;

  const tip = getTip(strategy, level, inputFocus);

  return (
    <div className="my-3 flex justify-center animate-fade-in">
      {stage === 0 && (
        <button
          type="button"
          onClick={() => setStage(1)}
          className="rounded-lg border border-primary/60 bg-transparent px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
        >
          Need a hint?
        </button>
      )}

      {stage === 1 && (
        <div className="w-full max-w-md rounded-lg border border-primary/30 bg-primary/5 p-3 animate-fade-in">
          <p className="text-sm text-foreground">{tip}</p>
          <button
            type="button"
            onClick={() => setStage(2)}
            className="mt-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Still stuck? Show me
          </button>
        </div>
      )}

      {stage === 2 && (
        <div className="w-full max-w-md rounded-lg border border-primary/30 bg-primary/5 p-4 animate-fade-in">
          {question ? (
            strategy === "splitStrategy" ? <SplitVisualHint q={question} /> : <Plus10VisualHint q={question} />
          ) : (
            <p className="text-sm text-foreground text-center">Now you try the next step.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PractiseHintButton;
