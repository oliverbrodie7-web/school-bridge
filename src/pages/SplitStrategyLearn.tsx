import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";

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
          to="/split-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Learn" /></div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Split Strategy — I Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Watch how the split strategy works.
          </p>
        </div>

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

/* ─── Small coloured block used everywhere ─── */
const Block = ({
  value,
  color,
  ghost,
  size = "normal",
}: {
  value: number;
  color: string;
  ghost?: boolean;
  size?: "normal" | "small";
}) => {
  const dim = size === "small" ? "h-14 w-14 text-xl sm:h-16 sm:w-16 sm:text-2xl" : "h-16 w-16 text-2xl sm:h-20 sm:w-20 sm:text-3xl";
  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-2xl font-bold text-white transition-opacity duration-500 ${ghost ? "opacity-20" : "opacity-100"}`}
      style={{ backgroundColor: color }}
    >
      {value}
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
      const t = setTimeout(() => setPhase("addTens"), 3000);
      return () => clearTimeout(t);
    }
    if (phase === "addTens") {
      const t = setTimeout(() => setPhase("addOnes"), 3500);
      return () => clearTimeout(t);
    }
    if (phase === "addOnes") {
      const t = setTimeout(() => setPhase("combine"), 3500);
      return () => clearTimeout(t);
    }
    if (phase === "combine") {
      const t = setTimeout(() => setPhase("done"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const blueSplit = phase !== "prompt";
  const orangeSplit = !["prompt", "splitA"].includes(phase);

  // Which blocks have "moved" to step rows
  const tensGone = ["addTens", "addOnes", "combine", "done"].includes(phase);
  const onesGone = ["addOnes", "combine", "done"].includes(phase);

  const showStep2 = tensGone;
  const showStep3 = onesGone;
  const showStep4 = ["combine", "done"].includes(phase);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {example.a} + {example.b}
      </p>

      {/* Step 1 label - always visible */}
      <p className="mt-6 text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Step 1: </span>
        Split each number into tens and ones
      </p>

      {/* Step 1 — Number boxes */}
      <div className="mt-4 flex items-start justify-center gap-8">
        {/* Blue number */}
        {!blueSplit ? (
          <button
            onClick={() => phase === "prompt" && setPhase("splitA")}
            disabled={phase !== "prompt"}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
              phase === "prompt" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            }`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {blueNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={bT} color={BLUE} ghost={tensGone} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={bO} color={ORANGE} ghost={onesGone} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        )}

        {/* Orange number */}
        {!orangeSplit ? (
          <button
            onClick={() => phase === "splitA" && setPhase("splitB")}
            disabled={phase !== "splitA"}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
              phase === "splitA" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            }`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {orangeNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={oT} color={BLUE} ghost={tensGone} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={oO} color={ORANGE} ghost={onesGone} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt text */}
      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap each number to split it.
        </p>
      )}
      {phase === "splitA" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Now tap the next number.
        </p>
      )}

      {/* Step 2 — Tens row with blocks */}
      {showStep2 && (
        <div className="mt-8 animate-fade-in">
          <p className="text-center text-lg font-semibold text-muted-foreground mb-3">
            Step 2: <span style={{ color: BLUE }}>Add the tens</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Block value={bT} color={BLUE} size="small" />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <Block value={oT} color={BLUE} size="small" />
            <span className="text-2xl font-bold text-muted-foreground">=</span>
            <span className="text-2xl font-bold text-foreground">{tSum}</span>
          </div>
        </div>
      )}

      {/* Step 3 — Ones row with blocks */}
      {showStep3 && (
        <div className="mt-6 animate-fade-in">
          <p className="text-center text-lg font-semibold text-muted-foreground mb-3">
            Step 3: <span style={{ color: ORANGE }}>Add the ones</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Block value={bO} color={ORANGE} size="small" />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <Block value={oO} color={ORANGE} size="small" />
            <span className="text-2xl font-bold text-muted-foreground">=</span>
            <span className="text-2xl font-bold text-foreground">{oSum}</span>
          </div>
        </div>
      )}

      {/* Step 4 — Combine */}
      {showStep4 && (
        <div className="mt-6 animate-fade-in">
          <p className="text-center text-lg font-semibold animate-fade-in text-primary">
            <span className="text-muted-foreground">Step 4: </span>
            Put them together: {tSum} + {oSum} = {total}
          </p>
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

export default SplitStrategyLearn;
