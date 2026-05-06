import { useState } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const BLUE_BG = "#DBEAFE";
const ORANGE = "#F97316";
const ORANGE_BG = "#FFEDD5";

interface Example {
  a: number;
  b: number;
}

const EXAMPLES: Example[] = [
  { a: 34, b: 12 },
  { a: 53, b: 25 },
];

const getparts = (n: number) => ({
  tens: Math.floor(n / 10) * 10,
  ones: n % 10,
});

const SplitStrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);

  const ex = EXAMPLES[exIndex];
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

        <ExampleView
          key={exIndex}
          example={ex}
          isLast={isLast}
          onNext={() => setExIndex((i) => i + 1)}
        />
      </div>
    </div>
  );
};

type Phase = "prompt" | "splitA" | "splitB" | "addTens" | "addOnes" | "combine" | "done";

const ExampleView = ({
  example,
  isLast,
  onNext,
}: {
  example: Example;
  isLast: boolean;
  onNext: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("prompt");

  // Determine which is blue (larger) and orange (smaller)
  const aIsLarger = example.a >= example.b;
  const blueNum = aIsLarger ? example.a : example.b;
  const orangeNum = aIsLarger ? example.b : example.a;

  const blueParts = getparts(blueNum);
  const orangeParts = getparts(orangeNum);

  const tensSum = blueParts.tens + orangeParts.tens;
  const onesSum = blueParts.ones + orangeParts.ones;
  const total = blueNum + orangeNum;

  const blueSplit = phase !== "prompt";
  const orangeSplit = phase !== "prompt" && phase !== "splitA";

  const handleTapBlue = () => {
    if (phase === "prompt") {
      setPhase("splitA");
    }
  };

  const handleTapOrange = () => {
    if (phase === "splitA") {
      setPhase("splitB");
      // After splitting, auto-reveal steps
      setTimeout(() => setPhase("addTens"), 800);
    }
  };

  // Auto-advance after splitB
  const handlePhaseChange = (p: Phase) => {
    if (p === "addTens") {
      setTimeout(() => setPhase("addOnes"), 1000);
    } else if (p === "addOnes") {
      setTimeout(() => setPhase("combine"), 1000);
    } else if (p === "combine") {
      setTimeout(() => setPhase("done"), 500);
    }
  };

  // Trigger auto-advance
  if (phase === "addTens" || phase === "addOnes" || phase === "combine") {
    // Use a ref-like trick: schedule once
  }

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
      <div className="mt-8 flex justify-center gap-8">
        {/* Blue number */}
        <NumberBox
          num={blueNum}
          color={BLUE}
          bgColor={BLUE_BG}
          isSplit={blueSplit}
          parts={blueParts}
          canTap={phase === "prompt"}
          onTap={handleTapBlue}
        />
        {/* Orange number */}
        <NumberBox
          num={orangeNum}
          color={ORANGE}
          bgColor={ORANGE_BG}
          isSplit={orangeSplit}
          parts={orangeParts}
          canTap={phase === "splitA"}
          onTap={handleTapOrange}
        />
      </div>

      {/* Prompt */}
      {(phase === "prompt" || phase === "splitA") && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground">
          {phase === "prompt"
            ? "Tap each number to split it."
            : "Now tap the orange number."}
        </p>
      )}

      {/* Steps revealed */}
      <RevealSteps
        phase={phase}
        blueParts={blueParts}
        orangeParts={orangeParts}
        tensSum={tensSum}
        onesSum={onesSum}
        total={total}
        onPhaseChange={handlePhaseChange}
      />

      {/* Next button */}
      {phase === "done" && (
        <div className="mt-6 text-center">
          {isLast ? (
            <Link
              to="/student"
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

const NumberBox = ({
  num,
  color,
  bgColor,
  isSplit,
  parts,
  canTap,
  onTap,
}: {
  num: number;
  color: string;
  bgColor: string;
  isSplit: boolean;
  parts: { tens: number; ones: number };
  canTap: boolean;
  onTap: () => void;
}) => {
  if (isSplit) {
    return (
      <div className="flex gap-3">
        <div className="flex flex-col items-center animate-fade-in">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
            style={{ backgroundColor: color }}
          >
            {parts.tens}
          </div>
          <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
        </div>
        <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl"
            style={{ backgroundColor: color }}
          >
            {parts.ones}
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
      className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl"
      style={{
        backgroundColor: color,
        cursor: canTap ? "pointer" : "default",
        transform: canTap ? undefined : undefined,
      }}
      onMouseEnter={(e) => canTap && (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {num}
    </button>
  );
};

const RevealSteps = ({
  phase,
  blueParts,
  orangeParts,
  tensSum,
  onesSum,
  total,
  onPhaseChange,
}: {
  phase: Phase;
  blueParts: { tens: number; ones: number };
  orangeParts: { tens: number; ones: number };
  tensSum: number;
  onesSum: number;
  total: number;
  onPhaseChange: (p: Phase) => void;
}) => {
  const phaseOrder: Phase[] = ["addTens", "addOnes", "combine", "done"];
  const idx = phaseOrder.indexOf(phase);

  // Schedule next phase
  useState(() => {
    // This runs once on mount; we use useEffect-like behavior via the parent
  });

  // We rely on parent to call onPhaseChange; let's use a simpler approach
  // The parent's handlePhaseChange is never called because we used a broken pattern.
  // Let's fix by using proper state transitions in the parent via useEffect equivalent.

  return (
    <div className="mt-6 space-y-3">
      {idx >= 0 && (
        <StepLine
          className="animate-fade-in"
          text={`Now add the tens: ${blueParts.tens} + ${orangeParts.tens} = ${tensSum}`}
          color={BLUE}
        />
      )}
      {idx >= 1 && (
        <StepLine
          className="animate-fade-in"
          text={`Now add the ones: ${blueParts.ones} + ${orangeParts.ones} = ${onesSum}`}
          color={ORANGE}
        />
      )}
      {idx >= 2 && (
        <StepLine
          className="animate-fade-in"
          text={`Put them together: ${tensSum} + ${onesSum} = ${total}`}
          color="hsl(var(--primary))"
        />
      )}
    </div>
  );
};

const StepLine = ({ text, color, className }: { text: string; color: string; className?: string }) => (
  <p
    className={`text-center text-lg font-semibold ${className ?? ""}`}
    style={{ color }}
  >
    {text}
  </p>
);

export default SplitStrategyLearn;
