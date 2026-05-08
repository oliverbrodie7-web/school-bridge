import { useState } from "react";
import { Link } from "react-router-dom";
import { setLearnComplete } from "@/lib/progress";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const ORANGE_BG = "#FFF7ED";
const BLUE_BG = "#EFF6FF";

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

const BANK = [
  { a: 32, b: 14 },
  { a: 41, b: 23 },
  { a: 53, b: 16 },
  { a: 24, b: 35 },
  { a: 62, b: 17 },
];

interface Q {
  big: number;
  small: number;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQueue = (): Q[] =>
  shuffle(BANK).map(({ a, b }) =>
    a >= b ? { big: a, small: b } : { big: b, small: a }
  );

type Phase =
  | "tapBlue" | "inputBlue" | "blueWrong" | "blueDone"
  | "tapOrange" | "inputOrange" | "orangeWrong" | "orangeDone"
  | "inputAdd" | "addWrong" | "inputTotal" | "totalWrong"
  | "correct" | "done";

const SplitStrategyYouDo = () => {
  const [queue, setQueue] = useState<Q[]>(() => buildQueue());
  const [qIndex, setQIndex] = useState(0);
  const finished = qIndex >= queue.length;

  const resetAll = () => {
    setQueue(buildQueue());
    setQIndex(0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/split-strategy/we-do"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Split Strategy — You Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Your turn — you've got this.
        </p>

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Amazing work! You did it all by yourself! 🌟
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={resetAll}
                className="rounded-xl border-2 border-primary px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I'd like more practise
              </button>
              <Link
                to="/practise/split-strategy"
                onClick={() => localStorage.setItem("splitStrategy_learnComplete", "true")}
                className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                I'm ready to try on my own
              </Link>
            </div>
          </div>
        ) : (
          <QuestionCard
            key={`${qIndex}-${queue[qIndex].big}-${queue[qIndex].small}`}
            q={queue[qIndex]}
            onNext={() => setQIndex((i) => i + 1)}
          />
        )}
      </div>
    </div>
  );
};

/* ─── Input box component ─── */
const SplitInput = ({
  value,
  onChange,
  color,
  bgColor,
  placeholder = "?",
}: {
  value: string;
  onChange: (v: string) => void;
  color: string;
  bgColor: string;
  placeholder?: string;
}) => (
  <input
    type="number"
    inputMode="numeric"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="flex h-16 w-16 items-center justify-center rounded-2xl border-3 text-center text-2xl font-bold outline-none transition-colors focus:ring-2 sm:h-20 sm:w-20 sm:text-3xl"
    style={{ borderColor: color, color, background: bgColor }}
    placeholder={placeholder}
  />
);

/* ─── Addition row ─── */
const AddRow = ({
  label,
  a,
  b,
  value,
  onChange,
}: {
  label: string;
  a: number;
  b: number;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    <span className="font-medium text-foreground">
      {label}: {a} + {b} =
    </span>
    <input
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
      placeholder="?"
    />
  </div>
);

/* ─── Question Card ─── */
const QuestionCard = ({ q, onNext }: { q: Q; onNext: () => void }) => {
  const [phase, setPhase] = useState<Phase>("tapBlue");

  // Blue split inputs
  const [blueTens, setBlueTens] = useState("");
  const [blueOnes, setBlueOnes] = useState("");

  // Orange split inputs
  const [orangeTens, setOrangeTens] = useState("");
  const [orangeOnes, setOrangeOnes] = useState("");

  // Addition inputs
  const [addTens, setAddTens] = useState("");
  const [addOnes, setAddOnes] = useState("");
  const [addTotal, setAddTotal] = useState("");

  const [hint, setHint] = useState("");

  const bT = tens(q.big), bO = ones(q.big);
  const sT = tens(q.small), sO = ones(q.small);
  const tSum = bT + sT, oSum = bO + sO, total = q.big + q.small;

  // Determine split states
  const blueSplit = !["tapBlue", "inputBlue", "blueWrong"].includes(phase);
  const orangeSplit = ["orangeDone", "inputAdd", "addWrong", "inputTotal", "totalWrong", "correct", "done"].includes(phase);

  // Ghost states for correct/done reveal
  const tensGone = ["correct", "done"].includes(phase);
  const onesGone = ["correct", "done"].includes(phase);

  const showStep2 = tensGone;
  const showStep3 = onesGone;
  const showStep4 = ["correct", "done"].includes(phase);

  const checkBlue = () => {
    const tOk = Number(blueTens) === bT;
    const oOk = Number(blueOnes) === bO;
    if (tOk && oOk) {
      setPhase("tapOrange");
      setHint("");
    } else if (!tOk) {
      setHint(`Almost — how many tens are hiding in ${q.big}?`);
      setPhase("blueWrong");
    } else {
      setHint(`Check the ones — how many ones are in ${q.big}?`);
      setPhase("blueWrong");
    }
  };

  const checkOrange = () => {
    const tOk = Number(orangeTens) === sT;
    const oOk = Number(orangeOnes) === sO;
    if (tOk && oOk) {
      setPhase("inputAdd");
      setHint("");
    } else if (!tOk) {
      setHint(`Almost — how many tens are hiding in ${q.small}?`);
      setPhase("orangeWrong");
    } else {
      setHint(`Check the ones — how many ones are in ${q.small}?`);
      setPhase("orangeWrong");
    }
  };

  const checkAdd = () => {
    const t = Number(addTens), o = Number(addOnes);
    if (t !== tSum) {
      setHint(`Try adding just the tens: ${bT} + ${sT}`);
      setPhase("addWrong");
    } else if (o !== oSum) {
      setHint(`Now check the ones: ${bO} + ${sO}`);
      setPhase("addWrong");
    } else {
      setHint("");
      setPhase("inputTotal");
    }
  };

  const checkTotal = () => {
    const tot = Number(addTotal);
    if (tot !== total) {
      setHint(`Almost! Add your tens and ones together: ${tSum} + ${oSum}`);
      setPhase("totalWrong");
    } else {
      setHint("");
      setPhase("correct");
    }
  };

  const retryBlue = () => {
    setBlueTens("");
    setBlueOnes("");
    setHint("");
    setPhase("inputBlue");
  };

  const retryOrange = () => {
    setOrangeTens("");
    setOrangeOnes("");
    setHint("");
    setPhase("inputOrange");
  };

  const retryAdd = () => {
    setHint("");
    setPhase("inputAdd");
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

      {/* Number boxes */}
      <div className="mt-4 flex items-start justify-center gap-8">
        {/* First number */}
        {blueSplit ? (
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
        ) : phase === "inputBlue" || phase === "blueWrong" ? (
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <SplitInput value={blueTens} onChange={setBlueTens} color={BLUE} bgColor={BLUE_BG} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center">
              <SplitInput value={blueOnes} onChange={setBlueOnes} color={ORANGE} bgColor={ORANGE_BG} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => phase === "tapBlue" && setPhase("inputBlue")}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
              phase === "tapBlue" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            }`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.big}
          </button>
        )}

        {/* Second number */}
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
        ) : phase === "inputOrange" || phase === "orangeWrong" ? (
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <SplitInput value={orangeTens} onChange={setOrangeTens} color={BLUE} bgColor={BLUE_BG} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center">
              <SplitInput value={orangeOnes} onChange={setOrangeOnes} color={ORANGE} bgColor={ORANGE_BG} />
              <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => phase === "tapOrange" && setPhase("inputOrange")}
            disabled={phase !== "tapOrange"}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
              phase === "tapOrange" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            }`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {q.small}
          </button>
        )}
      </div>

      {/* Messages & controls */}
      <div className="mt-6 space-y-4 text-center">
        {phase === "tapBlue" && (
          <p className="text-lg font-medium text-muted-foreground animate-fade-in">
            Tap the first number to split it.
          </p>
        )}

        {phase === "inputBlue" && (
          <>
            <p className="text-base font-medium text-muted-foreground">
              Split {q.big} into tens and ones.
            </p>
            <button
              onClick={checkBlue}
              disabled={!blueTens || !blueOnes}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </>
        )}

        {phase === "blueWrong" && (
          <>
            <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>
            <button
              onClick={retryBlue}
              className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Try again
            </button>
          </>
        )}

        {phase === "tapOrange" && (
          <p className="text-lg font-medium animate-fade-in text-foreground">
            Great! Now tap the next number.
          </p>
        )}

        {phase === "inputOrange" && (
          <>
            <p className="text-base font-medium text-muted-foreground">
              Split {q.small} into tens and ones.
            </p>
            <button
              onClick={checkOrange}
              disabled={!orangeTens || !orangeOnes}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </>
        )}

        {phase === "orangeWrong" && (
          <>
            <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>
            <button
              onClick={retryOrange}
              className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Try again
            </button>
          </>
        )}

        {(phase === "inputAdd" || phase === "addWrong") && (
          <div className="space-y-4 pt-2">
            <p className="text-base font-medium text-muted-foreground">
              Now add them up!
            </p>
            <div className="space-y-3">
              <AddRow label="Tens" a={bT} b={sT} value={addTens} onChange={setAddTens} />
              <AddRow label="Ones" a={bO} b={sO} value={addOnes} onChange={setAddOnes} />
            </div>

            {phase === "addWrong" && (
              <>
                <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>
                <button
                  onClick={retryAdd}
                  className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Try again
                </button>
              </>
            )}

            {phase === "inputAdd" && (
              <button
                onClick={checkAdd}
                disabled={!addTens || !addOnes}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            )}
          </div>
        )}

        {(phase === "inputTotal" || phase === "totalWrong") && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <p className="text-base font-medium text-muted-foreground">
              Now put them together!
            </p>
            <div className="space-y-3">
              <AddRow label="Tens" a={bT} b={sT} value={String(tSum)} onChange={() => {}} />
              <AddRow label="Ones" a={bO} b={sO} value={String(oSum)} onChange={() => {}} />
              <AddRow label="Answer" a={tSum} b={oSum} value={addTotal} onChange={setAddTotal} />
            </div>

            {phase === "totalWrong" && (
              <>
                <p className="text-base font-medium text-destructive animate-fade-in">{hint}</p>
                <button
                  onClick={() => { setHint(""); setPhase("inputTotal"); }}
                  className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Try again
                </button>
              </>
            )}

            {phase === "inputTotal" && (
              <button
                onClick={checkTotal}
                disabled={!addTotal}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            )}
          </div>
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
          <p className="text-center text-lg font-semibold text-primary">
            <span className="text-muted-foreground">Step 4: </span>
            Put them together: {tSum} + {oSum} = {total}
          </p>
          <p className="mt-3 text-center text-lg font-semibold text-foreground">
            Great work! You used the split strategy! 🌟
          </p>
          <div className="mt-4 text-center">
            <button
              onClick={onNext}
              className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitStrategyYouDo;
