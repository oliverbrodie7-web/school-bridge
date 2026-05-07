import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

/* ─── Question data ─── */
const QUESTIONS = [
  { computer: { number: 34, result: 44 }, child: { number: 62, result: 72 } },
  { computer: { number: 51, result: 61 }, child: { number: 27, result: 37 } },
  { computer: { number: 43, result: 53 }, child: { number: 75, result: 85 } },
];

/* ─── Dienes-style tens block ─── */
const TensBlock = ({ color, className = "" }: { color: string; className?: string }) => (
  <div
    className={`flex flex-col overflow-hidden rounded-md ${className}`}
    style={{ width: 24, gap: 1, backgroundColor: "transparent" }}
  >
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="rounded-[2px]"
        style={{ width: 24, height: 6, backgroundColor: color }}
      />
    ))}
  </div>
);

/* ─── Ones block ─── */
const OnesBlock = ({ color }: { color: string }) => (
  <div
    className="rounded-sm"
    style={{ width: 24, height: 24, backgroundColor: color }}
  />
);

/* ─── Block row showing tens + ones ─── */
const BlockRow = ({
  tens,
  ones,
  tensColor,
  onesColor,
  showGreen,
  greenAnimating,
}: {
  tens: number;
  ones: number;
  tensColor: string;
  onesColor: string;
  showGreen: boolean;
  greenAnimating: boolean;
}) => (
  <div className="flex items-end gap-1.5">
    {Array.from({ length: tens }).map((_, i) => (
      <TensBlock key={`t${i}`} color={tensColor} />
    ))}
    {showGreen && (
      <div style={greenAnimating ? { animation: "slideDown 0.8s ease-out forwards" } : undefined}>
        <TensBlock color={GREEN} />
      </div>
    )}
    <div className="ml-2 flex flex-wrap items-end gap-1">
      {Array.from({ length: ones }).map((_, i) => (
        <OnesBlock key={`o${i}`} color={onesColor} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Computer Demo Phase
   ═══════════════════════════════════════ */
type DemoPhase = "show" | "sliding" | "done";

const ComputerDemo = ({
  number,
  result,
  onComplete,
}: {
  number: number;
  result: number;
  onComplete: () => void;
}) => {
  const [phase, setPhase] = useState<DemoPhase>("show");
  const t = Math.floor(number / 10);
  const o = number % 10;
  const resultTens = t + 1;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("sliding"), 2000);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const merged = phase === "sliding" || phase === "done";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {number} + 10
      </p>

      {/* Narration */}
      <p className="text-center text-base text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
        {phase === "show" && "Watch — the computer will add 10."}
        {phase === "sliding" && "Adding the ten…"}
        {phase === "done" && `I added the ten. Now we have ${resultTens} tens and ${o} ones.`}
      </p>

      {/* Blocks */}
      <BlockRow
        tens={t}
        ones={o}
        tensColor={merged ? NEUTRAL : BLUE}
        onesColor={merged ? NEUTRAL : BLUE}
        showGreen={merged}
        greenAnimating={phase === "sliding"}
      />

      {/* +10 label (before merge) */}
      {!merged && (
        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <span className="text-2xl font-bold" style={{ color: GREEN, fontFamily: "var(--font-heading)" }}>+10</span>
          <TensBlock color={GREEN} />
        </div>
      )}

      {/* Result */}
      {phase === "done" && (
        <div className="text-center animate-fade-in">
          <p
            className="text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {number} + 10 = {result}
          </p>
          <button
            onClick={onComplete}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Now it's your turn
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   Child Turn Phase
   ═══════════════════════════════════════ */
type ChildPhase = "show" | "tap-prompt" | "sliding" | "input" | "correct";

const ChildTurn = ({
  number,
  result,
  onComplete,
}: {
  number: number;
  result: number;
  onComplete: () => void;
}) => {
  const [phase, setPhase] = useState<ChildPhase>("show");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const tensRef = useRef<HTMLInputElement>(null);

  const t = Math.floor(number / 10);
  const o = number % 10;
  const resultTens = t + 1;

  // Auto show tap prompt after brief display
  useEffect(() => {
    const timer = setTimeout(() => setPhase("tap-prompt"), 1500);
    return () => clearTimeout(timer);
  }, []);

  // After slide, show input
  useEffect(() => {
    if (phase === "sliding") {
      const timer = setTimeout(() => {
        setPhase("input");
        setTimeout(() => tensRef.current?.focus(), 100);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleTap = () => {
    if (phase !== "tap-prompt") return;
    setPhase("sliding");
  };

  const merged = phase === "sliding" || phase === "input" || phase === "correct";

  const handleSubmit = () => {
    if (Number(tensInput) === resultTens && Number(onesInput) === o) {
      setShowHint(false);
      setPhase("correct");
    } else {
      setShowHint(true);
    }
  };

  const handleRetry = () => {
    setTensInput("");
    setOnesInput("");
    setShowHint(false);
    setTimeout(() => tensRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {number} + 10
      </p>

      {/* Narration */}
      <p
        key={phase}
        className="text-center text-base text-muted-foreground animate-fade-in"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {phase === "show" && `Your turn! Here's ${number}.`}
        {phase === "tap-prompt" && "Tap the green ten block to add it."}
        {phase === "sliding" && "Great — watch it slide in…"}
        {phase === "input" && "Now count the blocks."}
        {phase === "correct" && `Yes! ${number} + 10 = ${result}. The ones never change when we add 10.`}
      </p>

      {/* Blocks */}
      <BlockRow
        tens={t}
        ones={o}
        tensColor={merged ? NEUTRAL : BLUE}
        onesColor={merged ? NEUTRAL : BLUE}
        showGreen={merged}
        greenAnimating={phase === "sliding"}
      />

      {/* +10 with tappable green block */}
      {(phase === "show" || phase === "tap-prompt") && (
        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <span className="text-2xl font-bold" style={{ color: GREEN, fontFamily: "var(--font-heading)" }}>+10</span>
          {phase === "tap-prompt" ? (
            <button
              onClick={handleTap}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label="Tap to add the green ten block"
            >
              <TensBlock
                color={GREEN}
                className="ring-2 ring-green-400 ring-offset-2 ring-offset-card"
              />
              <span
                className="mt-1 block h-1 w-full animate-pulse rounded-full"
                style={{ backgroundColor: GREEN }}
              />
            </button>
          ) : (
            <TensBlock color={GREEN} />
          )}
        </div>
      )}

      {/* Input boxes */}
      {phase === "input" && (
        <div className="mt-2 flex flex-col items-center gap-3 animate-fade-in">
          <p className="text-lg font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
            Now we have{" "}
            <input
              ref={tensRef}
              type="number"
              inputMode="numeric"
              value={tensInput}
              onChange={(e) => setTensInput(e.target.value)}
              className="mx-1 inline-block w-12 rounded-lg border-2 border-primary bg-background px-2 py-1 text-center text-lg font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Number of tens"
            />{" "}
            tens and{" "}
            <input
              type="number"
              inputMode="numeric"
              value={onesInput}
              onChange={(e) => setOnesInput(e.target.value)}
              className="mx-1 inline-block w-12 rounded-lg border-2 border-primary bg-background px-2 py-1 text-center text-lg font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Number of ones"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />{" "}
            ones
          </p>

          {showHint && (
            <p className="text-base font-medium animate-fade-in" style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}>
              Look at the tens blocks — how many are there now?
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Check
            </button>
            {showHint && (
              <button
                onClick={handleRetry}
                className="rounded-xl bg-muted px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Correct result */}
      {phase === "correct" && (
        <div className="mt-2 text-center animate-fade-in">
          <p className="text-lg font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
            Now we have <span className="font-bold">{resultTens}</span> tens and <span className="font-bold">{o}</span> ones
          </p>
          <p
            className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {number} + 10 = {result}
          </p>
          <div
            className="mt-4 rounded-xl border-2 p-4 text-center"
            style={{ borderColor: GREEN, backgroundColor: "#F0FDF4" }}
          >
            <p className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-body)" }}>
              The ones never change when we add 10.
            </p>
          </div>
          <button
            onClick={onComplete}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
type QStep = "computer" | "child";

const Plus10StrategyWeDo = () => {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState<QStep>("computer");

  const question = QUESTIONS[qIndex];
  const isLast = qIndex === QUESTIONS.length - 1;

  const handleComputerDone = () => setStep("child");

  const handleChildDone = () => {
    if (!isLast) {
      setQIndex((i) => i + 1);
      setStep("computer");
    } else {
      setStep("child"); // stay on last — button changes
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/plus10-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          +10 Strategy — We Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          This time, the computer goes first. Then it's your turn.
        </p>

        {/* Question indicator */}
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          Question {qIndex + 1} of {QUESTIONS.length}
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {step === "computer" ? (
            <ComputerDemo
              key={`demo-${qIndex}`}
              number={question.computer.number}
              result={question.computer.result}
              onComplete={handleComputerDone}
            />
          ) : (
            <ChildTurnWrapper
              key={`child-${qIndex}`}
              number={question.child.number}
              result={question.child.result}
              isLast={isLast}
              onNext={handleChildDone}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* Wrapper that swaps the "Next" button on the last question */
const ChildTurnWrapper = ({
  number,
  result,
  isLast,
  onNext,
}: {
  number: number;
  result: number;
  isLast: boolean;
  onNext: () => void;
}) => {
  const [done, setDone] = useState(false);

  return done && isLast ? (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <p
        className="text-center text-lg font-semibold text-foreground"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Great teamwork! 🎉
      </p>
      <Link
        to="/learn/plus10-strategy/you-do"
        className="rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        I think you're ready — let's see what you can do!
      </Link>
    </div>
  ) : (
    <ChildTurn
      number={number}
      result={result}
      onComplete={() => {
        if (isLast) {
          setDone(true);
        } else {
          onNext();
        }
      }}
    />
  );
};

export default Plus10StrategyWeDo;
