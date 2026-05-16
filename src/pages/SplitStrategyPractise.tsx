import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { PractiseHintButton } from "@/components/PractiseHintButton";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import ProgressIndicator from "@/components/ProgressIndicator";
import LevelPills from "@/components/LevelPills";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const BLUE_BG = "#EFF6FF";
const ORANGE_BG = "#FFF7ED";

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

const QUESTIONS = [
  { a: 34, b: 52 },
  { a: 41, b: 35 },
  { a: 23, b: 64 },
  { a: 55, b: 32 },
  { a: 42, b: 47 },
  { a: 62, b: 17 },
  { a: 24, b: 53 },
  { a: 36, b: 41 },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface Q {
  big: number;
  small: number;
}

const buildQueue = (): Q[] =>
  shuffle(QUESTIONS).slice(0, 5).map(({ a, b }) =>
    a >= b ? { big: a, small: b } : { big: b, small: a }
  );

/* ─── Block component (same as Learn page) ─── */
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

/* ─── Difficulty selector ─── */
const L2_KEY = "splitStrategy_l2Correct";
const L2_THRESHOLD = 20;

const getL2Count = () => Number(localStorage.getItem(L2_KEY) || "0");
const incL2Count = () => {
  const n = getL2Count() + 1;
  localStorage.setItem(L2_KEY, String(n));
  return n;
};

/* Level selector moved to shared <LevelPills /> component. */

/* ═══════════════════════════════════════════════════════
   LEVEL 1 — Visual blocks, same as Learn page but interactive
   ═══════════════════════════════════════════════════════ */

type L1Phase =
  | "tapFirst" | "tapSecond"
  | "inputTens" | "tensWrong"
  | "inputOnes" | "onesWrong"
  | "inputTotal" | "totalWrong"
  | "correct";

const Level1Card = ({
  q,
  onNext,
  consecutiveCorrect,
  consecutiveWrong,
}: {
  q: Q;
  onNext: (hadWrong: boolean) => void;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}) => {
  const [phase, setPhase] = useState<L1Phase>("tapFirst");

  const bT = tens(q.big), bO = ones(q.big);
  const sT = tens(q.small), sO = ones(q.small);
  const tSum = bT + sT, oSum = bO + sO, total = q.big + q.small;

  const [tensAns, setTensAns] = useState("");
  const [onesAns, setOnesAns] = useState("");
  const [totalAns, setTotalAns] = useState("");
  const [hint, setHint] = useState("");
  const hadWrongRef = useRef(false);

  const inputFocus: "tens" | "ones" | "total" =
    phase === "inputOnes" || phase === "onesWrong"
      ? "ones"
      : phase === "inputTotal" || phase === "totalWrong"
        ? "total"
        : "tens";

  const firstSplit = !["tapFirst"].includes(phase);
  const secondSplit = !["tapFirst", "tapSecond"].includes(phase);

  const tensGone = ["inputOnes", "onesWrong", "inputTotal", "totalWrong", "correct"].includes(phase);
  const onesGone = ["inputTotal", "totalWrong", "correct"].includes(phase);

  const showStep2 = tensGone;
  const showStep3 = onesGone;
  const showStep4 = phase === "correct";

  const checkTens = () => {
    if (Number(tensAns) === tSum) {
      setHint("");
      setPhase("inputOnes");
    } else {
      setHint(`Try again: ${bT} + ${sT} = ?`);
      hadWrongRef.current = true;
      setPhase("tensWrong");
    }
  };
  const checkOnes = () => {
    if (Number(onesAns) === oSum) {
      setHint("");
      setPhase("inputTotal");
    } else {
      setHint(`Try again: ${bO} + ${sO} = ?`);
      hadWrongRef.current = true;
      setPhase("onesWrong");
    }
  };
  const checkTotal = () => {
    if (Number(totalAns) === total) {
      setHint("");
      setPhase("correct");
    } else {
      setHint(`Add your tens and ones: ${tSum} + ${oSum} = ?`);
      hadWrongRef.current = true;
      setPhase("totalWrong");
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-3xl font-bold text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
        {q.big} + {q.small}
      </p>



      <p className="mt-6 text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Step 1: </span>
        Split each number into tens and ones
      </p>

      {/* Number boxes */}
      <div className="mt-4 flex items-start justify-center gap-8">
        {firstSplit ? (
          <div className="flex gap-3 animate-fade-in">
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
          <button
            onClick={() => setPhase("tapSecond")}
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl cursor-pointer hover:scale-110 active:scale-95"
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.big}
          </button>
        )}

        {secondSplit ? (
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
        ) : phase === "tapSecond" ? (
          <button
            onClick={() => setPhase("inputTens")}
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl cursor-pointer hover:scale-110 active:scale-95"
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.small}
          </button>
        ) : (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white sm:h-24 sm:w-24 sm:text-4xl opacity-50"
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.small}
          </div>
        )}
      </div>

      {/* Resolved Step 2 row (renders before active prompt to keep 1→2→3→4 order) */}
      {showStep2 && (
        <div className="mt-8 animate-fade-in">
          <p className="text-center text-lg font-semibold text-muted-foreground mb-3">
            Step 2: <span style={{ color: BLUE }}>Add the tens</span> ✓
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

      {/* Resolved Step 3 row */}
      {showStep3 && (
        <div className="mt-6 animate-fade-in">
          <p className="text-center text-lg font-semibold text-muted-foreground mb-3">
            Step 3: <span style={{ color: ORANGE }}>Add the ones</span> ✓
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

      {/* Prompts (active step input) */}
      <div className="mt-6 space-y-4 text-center">
        {phase === "tapFirst" && (
          <p className="text-lg font-medium text-muted-foreground animate-fade-in">Tap the first number to split it.</p>
        )}
        {phase === "tapSecond" && (
          <p className="text-lg font-medium text-foreground animate-fade-in">Now tap the next number.</p>
        )}

        {/* Tens input */}
        {(phase === "inputTens" || phase === "tensWrong") && (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-muted-foreground">
              Step 2: <span style={{ color: BLUE }}>Add the tens</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Block value={bT} color={BLUE} size="small" />
              <span className="text-2xl font-bold text-muted-foreground">+</span>
              <Block value={sT} color={BLUE} size="small" />
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <input
                type="number"
                inputMode="numeric"
                value={tensAns}
                onChange={(e) => { setTensAns(e.target.value); if (phase === "tensWrong") setPhase("inputTens"); }}
                className="w-20 rounded-lg border-3 px-3 py-2 text-center text-2xl font-bold outline-none transition-colors focus:ring-2"
                style={{ borderColor: BLUE, color: BLUE, background: BLUE_BG }}
                placeholder="?"
              />
            </div>
            {phase === "tensWrong" && <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>}
            {phase === "inputTens" && (
              <button onClick={checkTens} disabled={!tensAns} className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">
                Check
              </button>
            )}
          </div>
        )}

        {/* Ones input */}
        {(phase === "inputOnes" || phase === "onesWrong") && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-lg font-semibold text-muted-foreground">
              Step 3: <span style={{ color: ORANGE }}>Add the ones</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Block value={bO} color={ORANGE} size="small" />
              <span className="text-2xl font-bold text-muted-foreground">+</span>
              <Block value={sO} color={ORANGE} size="small" />
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <input
                type="number"
                inputMode="numeric"
                value={onesAns}
                onChange={(e) => { setOnesAns(e.target.value); if (phase === "onesWrong") setPhase("inputOnes"); }}
                className="w-20 rounded-lg border-3 px-3 py-2 text-center text-2xl font-bold outline-none transition-colors focus:ring-2"
                style={{ borderColor: ORANGE, color: ORANGE, background: ORANGE_BG }}
                placeholder="?"
              />
            </div>
            {phase === "onesWrong" && <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>}
            {phase === "inputOnes" && (
              <button onClick={checkOnes} disabled={!onesAns} className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">
                Check
              </button>
            )}
          </div>
        )}

        {/* Total input */}
        {(phase === "inputTotal" || phase === "totalWrong") && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-lg font-semibold text-primary">
              Step 4: Put them together
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-foreground">{tSum} + {oSum} =</span>
              <input
                type="number"
                inputMode="numeric"
                value={totalAns}
                onChange={(e) => { setTotalAns(e.target.value); if (phase === "totalWrong") setPhase("inputTotal"); }}
                className="w-20 rounded-lg border-2 border-primary px-3 py-2 text-center text-2xl font-bold text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring/20 bg-background"
                placeholder="?"
              />
            </div>
            {phase === "totalWrong" && <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>}
            {phase === "inputTotal" && (
              <button onClick={checkTotal} disabled={!totalAns} className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">
                Check
              </button>
            )}
          </div>
        )}
      </div>

      {/* Step 4 resolved */}
      {showStep4 && (
        <div className="mt-6 animate-fade-in">
          <p className="text-center text-lg font-semibold text-primary">
            <span className="text-muted-foreground">Step 4: </span>
            {tSum} + {oSum} = {total} 🌟
          </p>
          <div className="mt-4 text-center">
            <button onClick={() => onNext(hadWrongRef.current)} className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   LEVEL 2 — Text input rows (guided, like screenshot)
   ═══════════════════════════════════════════════════════ */

const Level2Card = ({
  q,
  onNext,
  consecutiveCorrect,
  consecutiveWrong,
}: {
  q: Q;
  onNext: (hadWrong: boolean) => void;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}) => {
  const bT = tens(q.big), bO = ones(q.big);
  const sT = tens(q.small), sO = ones(q.small);
  const tSum = bT + sT, oSum = bO + sO, total = q.big + q.small;

  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [step, setStep] = useState<"input" | "inputTotal" | "wrong" | "wrongTotal" | "correct">("input");
  const [hint, setHint] = useState("");
  const hadWrongRef = useRef(false);

  const inputFocus: "tens" | "ones" | "total" =
    step === "inputTotal" || step === "wrongTotal" ? "total" : "tens";

  const handleCheck = () => {
    const t = Number(tensInput), o = Number(onesInput);
    if (t !== tSum) {
      setHint(`Try adding just the tens: ${bT} + ${sT}`);
      hadWrongRef.current = true;
      setStep("wrong");
    } else if (o !== oSum) {
      setHint(`Now check the ones: ${bO} + ${sO}`);
      hadWrongRef.current = true;
      setStep("wrong");
    } else {
      setHint("");
      setStep("inputTotal");
    }
  };

  const handleCheckTotal = () => {
    if (Number(totalInput) !== total) {
      setHint(`Almost! Add your tens and ones: ${tSum} + ${oSum}`);
      hadWrongRef.current = true;
      setStep("wrongTotal");
    } else {
      setHint("");
      setStep("correct");
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-lg font-semibold text-foreground">Use the split strategy to solve:</p>
      <p className="mt-2 text-3xl font-bold text-primary sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
        {q.big} + {q.small}
      </p>

      <PractiseHintButton
        strategy="splitStrategy"
        level={2}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        question={{ a: q.big, b: q.small }}
        inputFocus={inputFocus}
      />

      <div className="mt-8 space-y-5">
        <InputRow label={`Split the tens: ${bT} + ${sT} = `} value={tensInput} onChange={(v) => { setTensInput(v); if (step === "wrong") setStep("input"); }} />
        <InputRow label={`Split the ones: ${bO} + ${sO} = `} value={onesInput} onChange={(v) => { setOnesInput(v); if (step === "wrong") setStep("input"); }} />

        {(step === "inputTotal" || step === "wrongTotal") && (
          <div className="animate-fade-in">
            <InputRow
              label="Now add them together: "
              suffix={<span className="text-muted-foreground">{tSum} + {oSum} = </span>}
              value={totalInput}
              onChange={(v) => { setTotalInput(v); if (step === "wrongTotal") setStep("inputTotal"); }}
            />
          </div>
        )}
      </div>

      {hint && (
        <p className="mt-4 text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>
      )}

      {step === "input" && (
        <button
          onClick={handleCheck}
          disabled={!tensInput || !onesInput}
          className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check My Answer
        </button>
      )}

      {step === "wrong" && (
        <div className="mt-4 flex gap-3">
          <button onClick={() => { setHint(""); setStep("input"); }} className="flex-1 rounded-xl border-2 border-primary px-4 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            Try Again
          </button>
        </div>
      )}

      {step === "inputTotal" && (
        <button
          onClick={handleCheckTotal}
          disabled={!totalInput}
          className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check My Answer
        </button>
      )}

      {step === "wrongTotal" && (
        <div className="mt-4 flex gap-3">
          <button onClick={() => { setHint(""); setStep("inputTotal"); }} className="flex-1 rounded-xl border-2 border-primary px-4 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            Try Again
          </button>
        </div>
      )}

      {step === "correct" && (
        <div className="mt-5 space-y-4 animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 text-center font-medium text-secondary-foreground">
            Great work! You used the split strategy! 🌟
          </div>
          <button onClick={() => onNext(hadWrongRef.current)} className="w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

const InputRow = ({ label, suffix, value, onChange }: { label: string; suffix?: React.ReactNode; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-foreground font-medium">{label}</span>
    {suffix}
    <input
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
    />
  </div>
);

/* ═══════════════════════════════════════════════════════
   LEVEL 3 — Minimal guidance, do it on paper
   ═══════════════════════════════════════════════════════ */

const Level3Card = ({
  q,
  onNext,
  consecutiveCorrect,
  consecutiveWrong,
}: {
  q: Q;
  onNext: (hadWrong: boolean) => void;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}) => {
  const total = q.big + q.small;
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<"input" | "wrong" | "correct">("input");
  const [hint, setHint] = useState("");
  const hadWrongRef = useRef(false);

  const check = () => {
    if (Number(answer) === total) {
      setHint("");
      setStep("correct");
    } else {
      setHint("Not quite — use the split strategy on paper and try again.");
      hadWrongRef.current = true;
      setStep("wrong");
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
      <p className="text-lg font-semibold text-foreground">
        Use the split strategy to solve this on paper:
      </p>
      <p className="mt-4 text-4xl font-bold text-primary sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
        {q.big} + {q.small}
      </p>

      <PractiseHintButton
        strategy="splitStrategy"
        level={3}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        question={{ a: q.big, b: q.small }}
      />

      <div className="mt-8 space-y-3">
        <p className="text-muted-foreground text-base">
          Work it out on paper, then type your answer:
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-foreground">{q.big} + {q.small} =</span>
          <input
            type="number"
            inputMode="numeric"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); if (step === "wrong") setStep("input"); }}
            className="w-24 rounded-lg border-2 border-primary px-3 py-2 text-center text-2xl font-bold text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring/20 bg-background"
            placeholder="?"
          />
        </div>
      </div>

      {hint && <p className="mt-4 text-base font-medium text-destructive animate-fade-in">{hint}</p>}

      {step === "input" && (
        <button onClick={check} disabled={!answer} className="mt-6 rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">
          Check
        </button>
      )}

      {step === "wrong" && (
        <div className="mt-4 space-y-3">
          <button onClick={() => { setHint(""); setStep("input"); }} className="rounded-xl border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            Try Again
          </button>
          <p className="text-sm text-muted-foreground">
            💡 Hint: Split each number into tens and ones, add the tens, add the ones, then combine.
          </p>
        </div>
      )}

      {step === "correct" && (
        <div className="mt-5 space-y-4 animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 text-center font-medium text-secondary-foreground">
            {q.big} + {q.small} = {total} — Amazing! 🌟
          </div>
          <button onClick={() => onNext(hadWrongRef.current)} className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

const SplitStrategyPractise = () => {
  const [level, setLevel] = useState(1);
  const [queue, setQueue] = useState(() => buildQueue());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [l2Correct, setL2Correct] = useState(() => getL2Count());
  const finished = currentIndex >= queue.length;
  const l3Unlocked = l2Correct >= L2_THRESHOLD;

  // Session-only hint counters (reset on level change)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const handleLevelChange = (l: number) => {
    setLevel(l);
    setQueue(buildQueue());
    setCurrentIndex(0);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
  };

  const nextQuestion = (hadWrong: boolean) => {
    if (hadWrong) {
      setConsecutiveWrong((w) => w + 1);
      setConsecutiveCorrect(0);
    } else {
      setConsecutiveCorrect((c) => c + 1);
      setConsecutiveWrong(0);
    }
    if (level === 2 && !hadWrong) {
      const newCount = incL2Count();
      setL2Correct(newCount);
    }
    setCurrentIndex((i) => i + 1);
  };

  const resetAll = () => {
    setQueue(buildQueue());
    setCurrentIndex(0);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
  };

  const question = finished ? queue[0] : queue[currentIndex];

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
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Practise" /></div>
          <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
            Split Strategy — Practise
          </h1>
          <p className="mt-2 mb-6 text-center text-muted-foreground">
            Choose your level.
          </p>
        </div>

        <DifficultySelector level={level} onChange={handleLevelChange} l3Unlocked={l3Unlocked} />

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Great work! 🌟
            </p>
            <p className="text-muted-foreground">
              You completed all 5 questions at Level {level}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={resetAll}
                className="rounded-xl border-2 border-primary px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Practise again
              </button>
              {level < 3 && (
                <button
                  onClick={() => handleLevelChange(level + 1)}
                  className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Try Level {level + 1}
                </button>
              )}
              <Link
                to="/parent?strategy=split"
                className="rounded-xl border-2 border-border px-6 py-3.5 text-lg font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Show my parent
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ProgressIndicator: Practise mode, wired to level / currentIndex / queue.length */}
            <ProgressIndicator
              mode="practise"
              level={level as 1 | 2 | 3}
              current={currentIndex + 1}
              total={queue.length}
            />
            {level === 1 && <Level1Card key={`${currentIndex}-${question.big}`} q={question} onNext={nextQuestion} consecutiveCorrect={consecutiveCorrect} consecutiveWrong={consecutiveWrong} />}
            {level === 2 && <Level2Card key={`${currentIndex}-${question.big}`} q={question} onNext={nextQuestion} consecutiveCorrect={consecutiveCorrect} consecutiveWrong={consecutiveWrong} />}
            {level === 3 && <Level3Card key={`${currentIndex}-${question.big}`} q={question} onNext={nextQuestion} consecutiveCorrect={consecutiveCorrect} consecutiveWrong={consecutiveWrong} />}
          </>
        )}
      </div>
    </div>
  );
};

export default SplitStrategyPractise;
