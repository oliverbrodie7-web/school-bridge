import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";

const EXAMPLES = [
  { a: 34, b: 12 },
  { a: 53, b: 25 },
];

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

type Phase = "prompt" | "splitA" | "splitB" | "addTens" | "addOnes" | "combine" | "done";

const SplitStrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);
  const isLast = exIndex === EXAMPLES.length - 1;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/student"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Split Strategy — I Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Watch how the split strategy works.
        </p>

        <ExampleCard
          key={exIndex}
          example={EXAMPLES[exIndex]}
          isLast={isLast}
          onNext={() => setExIndex((i) => i + 1)}
        />
      </div>
    </div>
  );
};

const ExampleCard = ({
  example,
  isLast,
  onNext,
}: {
  example: { a: number; b: number };
  isLast: boolean;
  onNext: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("prompt");

  const blueNum = Math.max(example.a, example.b);
  const orangeNum = Math.min(example.a, example.b);

  const bT = tens(blueNum), bO = ones(blueNum);
  const oT = tens(orangeNum), oO = ones(orangeNum);
  const tSum = bT + oT, oSum = bO + oO, total = blueNum + orangeNum;

  // Auto-advance through reveal phases
  useEffect(() => {
    if (phase === "splitB") {
      const t = setTimeout(() => setPhase("addTens"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "addTens") {
      const t = setTimeout(() => setPhase("addOnes"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "addOnes") {
      const t = setTimeout(() => setPhase("combine"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "combine") {
      const t = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const blueSplit = phase !== "prompt";
  const orangeSplit = !["prompt", "splitA"].includes(phase);
  const showSteps = ["addTens", "addOnes", "combine", "done"].indexOf(phase) >= 0;
  const stepIndex = ["addTens", "addOnes", "combine", "done"].indexOf(phase);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {example.a} + {example.b}
      </p>

      {/* Number boxes */}
      <div className="mt-8 flex items-start justify-center gap-8">
        <SplitBox
          num={blueNum}
          color={BLUE}
          isSplit={blueSplit}
          t={bT}
          o={bO}
          canTap={phase === "prompt"}
          onTap={() => phase === "prompt" && setPhase("splitA")}
        />
        <SplitBox
          num={orangeNum}
          color={ORANGE}
          isSplit={orangeSplit}
          t={oT}
          o={oO}
          canTap={phase === "splitA"}
          onTap={() => phase === "splitA" && setPhase("splitB")}
        />
      </div>

      {/* Prompt text */}
      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap each number to split it.
        </p>
      )}
      {phase === "splitA" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Now tap the orange number.
        </p>
      )}

      {/* Reveal steps */}
      {showSteps && (
        <div className="mt-6 space-y-3">
          {stepIndex >= 0 && (
            <p className="text-center text-lg font-semibold animate-fade-in" style={{ color: BLUE }}>
              Now add the tens: {bT} + {oT} = {tSum}
            </p>
          )}
          {stepIndex >= 1 && (
            <p className="text-center text-lg font-semibold animate-fade-in" style={{ color: ORANGE }}>
              Now add the ones: {bO} + {oO} = {oSum}
            </p>
          )}
          {stepIndex >= 2 && (
            <p className="text-center text-lg font-semibold animate-fade-in text-primary">
              Put them together: {tSum} + {oSum} = {total}
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {phase === "done" && (
        <div className="mt-6 text-center animate-fade-in">
          {isLast ? (
            <Link
              to="/learn/split-strategy/we-do"
              className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              We're going to try one together
            </Link>
          ) : (
            <button
              onClick={onNext}
              className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next Example
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const SplitBox = ({
  num,
  color,
  isSplit,
  t,
  o,
  canTap,
  onTap,
}: {
  num: number;
  color: string;
  isSplit: boolean;
  t: number;
  o: number;
  canTap: boolean;
  onTap: () => void;
}) => {
  if (isSplit) {
    return (
      <div className="flex gap-3">
        <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
            style={{ backgroundColor: color }}
          >
            {t}
          </div>
          <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
        </div>
        <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
            style={{ backgroundColor: color }}
          >
            {o}
          </div>
          <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onTap}
      disabled={!canTap}
      className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
        canTap ? "cursor-pointer hover:scale-110 active:scale-95" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      {num}
    </button>
  );
};

export default SplitStrategyLearn;
