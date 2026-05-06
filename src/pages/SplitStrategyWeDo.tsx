import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const BLUE_BG = "#DBEAFE";
const ORANGE = "#F97316";
const ORANGE_BG = "#FFF7ED";

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

interface Question {
  big: number; // blue, computer splits
  small: number; // orange, child splits
}

const QUESTIONS: Question[] = [
  { big: 43, small: 12 },
  { big: 62, small: 15 },
  { big: 51, small: 23 },
];

type Phase =
  | "autoSplit"      // computer is splitting the blue number
  | "promptChild"    // waiting for child to tap orange
  | "childInput"     // child entering tens/ones
  | "childWrong"     // incorrect input
  | "childCorrect"   // child got it right, short pause
  | "addTens"
  | "addOnes"
  | "combine"
  | "done";

const SplitStrategyWeDo = () => {
  const [qIndex, setQIndex] = useState(0);
  const finished = qIndex >= QUESTIONS.length;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/split-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Split Strategy — We Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          This time, the computer goes first. Then it's your turn.
        </p>

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Great teamwork! 🎉
            </p>
            <Link
              to="/learn/split-strategy/you-do"
              className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              I think you're ready — let's see what you can do!
            </Link>
          </div>
        ) : (
          <QuestionCard
            key={qIndex}
            q={QUESTIONS[qIndex]}
            isLast={qIndex === QUESTIONS.length - 1}
            onNext={() => setQIndex((i) => i + 1)}
          />
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({
  q,
  isLast,
  onNext,
}: {
  q: Question;
  isLast: boolean;
  onNext: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("autoSplit");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [hint, setHint] = useState("");

  const bT = tens(q.big), bO = ones(q.big);
  const sT = tens(q.small), sO = ones(q.small);
  const tSum = bT + sT, oSum = bO + sO, total = q.big + q.small;

  // Auto-split the blue number after a short delay
  useEffect(() => {
    if (phase === "autoSplit") {
      const t = setTimeout(() => setPhase("promptChild"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "childCorrect") {
      const t = setTimeout(() => setPhase("addTens"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "addTens") {
      const t = setTimeout(() => setPhase("addOnes"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "addOnes") {
      const t = setTimeout(() => setPhase("combine"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "combine") {
      const t = setTimeout(() => setPhase("done"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const blueSplit = phase !== "autoSplit";
  const showSteps = ["addTens", "addOnes", "combine", "done"].includes(phase);
  const stepIndex = ["addTens", "addOnes", "combine", "done"].indexOf(phase);

  const handleCheck = () => {
    const tOk = Number(tensInput) === sT;
    const oOk = Number(onesInput) === sO;
    if (tOk && oOk) {
      setPhase("childCorrect");
      setHint("");
    } else if (!tOk) {
      setHint(`Almost — how many tens are hiding in ${q.small}?`);
      setPhase("childWrong");
    } else {
      setHint(`Check the ones — how many ones are in ${q.small}?`);
      setPhase("childWrong");
    }
  };

  const handleTryAgain = () => {
    setTensInput("");
    setOnesInput("");
    setPhase("childInput");
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {q.big} + {q.small}
      </p>

      {/* Number boxes */}
      <div className="mt-8 flex items-start justify-center gap-8">
        {/* Blue number — computer splits */}
        {blueSplit ? (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl" style={{ backgroundColor: BLUE }}>
                {bT}
              </div>
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl" style={{ backgroundColor: BLUE }}>
                {bO}
              </div>
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white sm:h-24 sm:w-24 sm:text-4xl" style={{ backgroundColor: BLUE }}>
            {q.big}
          </div>
        )}

        {/* Orange number — child splits */}
        {phase === "childCorrect" || showSteps || phase === "done" ? (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl" style={{ backgroundColor: ORANGE }}>
                {sT}
              </div>
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl" style={{ backgroundColor: ORANGE }}>
                {sO}
              </div>
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        ) : phase === "childInput" || phase === "childWrong" ? (
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <input
                type="number"
                inputMode="numeric"
                value={tensInput}
                onChange={(e) => setTensInput(e.target.value)}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border-3 text-center text-2xl font-bold outline-none transition-colors focus:ring-2 sm:h-20 sm:w-20 sm:text-3xl"
                style={{ borderColor: ORANGE, color: ORANGE, background: ORANGE_BG }}
                placeholder="?"
              />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="number"
                inputMode="numeric"
                value={onesInput}
                onChange={(e) => setOnesInput(e.target.value)}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border-3 text-center text-2xl font-bold outline-none transition-colors focus:ring-2 sm:h-20 sm:w-20 sm:text-3xl"
                style={{ borderColor: ORANGE, color: ORANGE, background: ORANGE_BG }}
                placeholder="?"
              />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => phase === "promptChild" && setPhase("childInput")}
            disabled={phase !== "promptChild"}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
              phase === "promptChild" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            }`}
            style={{ backgroundColor: ORANGE }}
          >
            {q.small}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="mt-6 space-y-3 text-center">
        {phase === "autoSplit" && (
          <p className="text-lg font-medium text-muted-foreground animate-fade-in">
            Watch closely...
          </p>
        )}

        {phase === "promptChild" && (
          <p className="text-lg font-medium animate-fade-in" style={{ color: BLUE }}>
            I split {q.big} into {bT} and {bO}. Now you try with {q.small}.
          </p>
        )}

        {(phase === "childInput") && (
          <>
            <p className="text-lg font-medium text-muted-foreground">
              Split {q.small} into tens and ones.
            </p>
            <button
              onClick={handleCheck}
              disabled={!tensInput || !onesInput}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </>
        )}

        {phase === "childWrong" && (
          <>
            <p className="text-base font-medium text-destructive animate-fade-in">
              {hint}
            </p>
            <button
              onClick={handleTryAgain}
              className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Try again
            </button>
          </>
        )}

        {phase === "childCorrect" && (
          <p className="text-lg font-semibold animate-fade-in" style={{ color: ORANGE }}>
            Yes! {q.small} splits into {sT} and {sO}.
          </p>
        )}

        {/* Reveal steps */}
        {showSteps && (
          <div className="space-y-3 pt-2">
            {stepIndex >= 0 && (
              <p className="text-lg font-semibold animate-fade-in" style={{ color: BLUE }}>
                Now add the tens: {bT} + {sT} = {tSum}
              </p>
            )}
            {stepIndex >= 1 && (
              <p className="text-lg font-semibold animate-fade-in" style={{ color: ORANGE }}>
                Now add the ones: {bO} + {sO} = {oSum}
              </p>
            )}
            {stepIndex >= 2 && (
              <p className="text-lg font-semibold animate-fade-in text-primary">
                Put them together: {tSum} + {oSum} = {total}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next button */}
      {phase === "done" && (
        <div className="mt-6 text-center animate-fade-in">
          <button
            onClick={onNext}
            className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isLast ? "Next" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitStrategyWeDo;
