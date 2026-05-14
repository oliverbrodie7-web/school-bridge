import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const BLUE_BG = "#DBEAFE";
const ORANGE_BG = "#FFF7ED";

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

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
  const dim = size === "small"
    ? "h-14 w-14 text-xl sm:h-16 sm:w-16 sm:text-2xl"
    : "h-16 w-16 text-2xl sm:h-20 sm:w-20 sm:text-3xl";
  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-2xl font-bold text-white transition-opacity duration-500 ${ghost ? "opacity-20" : "opacity-100"}`}
      style={{ backgroundColor: color }}
    >
      {value}
    </div>
  );
};

interface Question {
  big: number;
  small: number;
}

const QUESTIONS: Question[] = [
  { big: 43, small: 12 },
  { big: 62, small: 15 },
  { big: 51, small: 23 },
];

type Phase =
  | "autoSplit"
  | "promptChild"
  | "childInput"
  | "childWrong"
  | "childCorrect"
  | "tensInput"
  | "tensCorrect"
  | "onesInput"
  | "onesCorrect"
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

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy We Do" /></div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Split Strategy — We Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            This time, the computer goes first. Then it's your turn.
          </p>
        </div>

        {!finished && (
          <>
            {/* ProgressIndicator inserted directly — move into shared QuestionCard wrapper when refactor occurs. */}
            <ProgressIndicator mode="learn" phase="wedo" current={qIndex + 1} total={QUESTIONS.length} />
          </>
        )}

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
      <ParentSignpost strategy="split" />
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

  // Step 2 (add tens) input
  const [tensSumInput, setTensSumInput] = useState("");
  const [tensSumFlash, setTensSumFlash] = useState(false);
  const [tensSumHint, setTensSumHint] = useState("");

  // Step 3 (add ones) input
  const [onesSumInput, setOnesSumInput] = useState("");
  const [onesSumFlash, setOnesSumFlash] = useState(false);
  const [onesSumHint, setOnesSumHint] = useState("");

  const bT = tens(q.big), bO = ones(q.big);
  const sT = tens(q.small), sO = ones(q.small);
  const tSum = bT + sT, oSum = bO + sO, total = q.big + q.small;

  useEffect(() => {
    if (phase === "autoSplit") {
      const t = setTimeout(() => setPhase("promptChild"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "childCorrect") {
      const t = setTimeout(() => setPhase("tensInput"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "combine") {
      const t = setTimeout(() => setPhase("done"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const blueSplit = phase !== "autoSplit";
  const orangeSplit = ![
    "autoSplit",
    "promptChild",
    "childInput",
    "childWrong",
  ].includes(phase);

  const showStep2 = ["tensInput", "tensCorrect", "onesInput", "onesCorrect", "combine", "done"].includes(phase);
  const showStep3 = ["onesInput", "onesCorrect", "combine", "done"].includes(phase);
  const showStep4 = ["combine", "done"].includes(phase);

  const tensGone = ["onesInput", "onesCorrect", "combine", "done"].includes(phase);
  const onesGone = ["combine", "done"].includes(phase);

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

  const handleCheckTensSum = () => {
    if (Number(tensSumInput) === tSum) {
      setPhase("tensCorrect");
      setTensSumHint("");
    } else {
      setTensSumFlash(true);
      setTensSumHint(`Count the tens — ${bT}, ${tSum}. How many tens altogether?`);
      setTimeout(() => {
        setTensSumFlash(false);
        setTensSumInput("");
      }, 600);
    }
  };

  const handleCheckOnesSum = () => {
    if (Number(onesSumInput) === oSum) {
      setPhase("onesCorrect");
      setOnesSumHint("");
    } else {
      setOnesSumFlash(true);
      setOnesSumHint(`Count the ones — ${bO} and ${sO} more. How many altogether?`);
      setTimeout(() => {
        setOnesSumFlash(false);
        setOnesSumInput("");
      }, 600);
    }
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

      {/* Step 1 label — always visible */}
      <p className="mt-6 text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Step 1: </span>
        Split each number into tens and ones
      </p>

      {/* Step 1 — Number boxes */}
      <div className="mt-4 flex items-start justify-center gap-8">
        {/* First number — computer splits */}
        {blueSplit ? (
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
        ) : (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white sm:h-24 sm:w-24 sm:text-4xl"
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.big}
          </div>
        )}

        {/* Second number — child splits */}
        {orangeSplit ? (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={sT} color={BLUE} ghost={tensGone} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={sO} color={ORANGE} ghost={onesGone} />
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
                style={{ borderColor: BLUE, color: BLUE, background: BLUE_BG }}
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
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
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
          <p className="text-lg font-medium animate-fade-in text-foreground">
            I split {q.big} into {bT} and {bO}. Now you try with {q.small}.
          </p>
        )}

        {phase === "childInput" && (
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
          <p className="text-lg font-semibold animate-fade-in text-foreground">
            Yes! {q.small} splits into {sT} and {sO}.
          </p>
        )}
      </div>

      {/* Step 2 — Tens row with blocks */}
      {showStep2 && (
        <div className="mt-8 animate-fade-in">
          <p className="text-center text-lg font-semibold text-muted-foreground mb-3">
            Step 2: <span style={{ color: BLUE }}>Add the tens</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Block value={bT} color={BLUE} size="small" />
            <span className="text-2xl font-bold text-muted-foreground">+</span>
            <Block value={sT} color={BLUE} size="small" />
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
            <Block value={sO} color={ORANGE} size="small" />
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
