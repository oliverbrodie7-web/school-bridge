import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

/* ─── Question types ─── */
interface Q {
  a: number; // starting number
  b: number; // addend (always multiple of 10)
}

/* ─── Question generators ─── */
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateL1 = (): Q => {
  const a = randInt(11, 89);
  return { a, b: 10 };
};

const generateL2 = (): Q => {
  const b = Math.random() < 0.5 ? 20 : 30;
  const maxA = 99 - b;
  const a = randInt(11, Math.min(79, maxA));
  return { a, b };
};

const generateL3 = (used: Set<string>): Q => {
  let attempts = 0;
  while (attempts < 200) {
    const b = randInt(1, 9) * 10;
    const a = randInt(11, 89);
    const key = `${a}+${b}`;
    if (!used.has(key)) {
      used.add(key);
      return { a, b };
    }
    attempts++;
  }
  // fallback
  const b = randInt(1, 9) * 10;
  const a = randInt(11, 89);
  return { a, b };
};

/* ─── Dienes blocks ─── */
const TensBlock = ({ color, className = "" }: { color: string; className?: string }) => (
  <div
    className={`flex flex-col overflow-hidden rounded-md ${className}`}
    style={{ width: 24, gap: 1, backgroundColor: "transparent" }}
  >
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="rounded-[2px]" style={{ width: 24, height: 6, backgroundColor: color }} />
    ))}
  </div>
);

const OnesBlock = ({ color }: { color: string }) => (
  <div className="rounded-sm" style={{ width: 24, height: 24, backgroundColor: color }} />
);

const HundredsBlock = ({ color }: { color: string }) => (
  <div
    className="rounded-md border-2 flex items-center justify-center text-xs font-bold text-white"
    style={{ width: 72, height: 72, backgroundColor: color, borderColor: color }}
  >
    100
  </div>
);

/* ─── Level selector ─── */
const LevelSelector = ({
  level,
  onChange,
  l3Unlocked,
}: {
  level: number;
  onChange: (l: number) => void;
  l3Unlocked: boolean;
}) => {
  const levels = [
    { n: 1, label: "Level 1", desc: "Adding 10", locked: false },
    { n: 2, label: "Level 2", desc: "Adding 20s and 30s", locked: false },
    { n: 3, label: "Level 3", desc: "Adding bigger tens", locked: !l3Unlocked },
  ];
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {levels.map((l) => (
        <button
          key={l.n}
          onClick={() => !l.locked && onChange(l.n)}
          disabled={l.locked}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition-colors border-2 ${
            l.locked
              ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
              : level === l.n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          <span className="block">{l.label} {l.locked ? "🔒" : ""}</span>
          <span className="block text-xs font-normal opacity-70">{l.desc}</span>
        </button>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   QUESTION CARD — shared across all levels
   Uses Dienes block animation then input fields
   ═══════════════════════════════════════════════════════ */

type Phase = "tap-prompt" | "animating" | "input" | "wrong" | "correct";

const QuestionCard = ({
  q,
  level,
  onCorrect,
}: {
  q: Q;
  level: number;
  onCorrect: () => void;
}) => {
  const { a, b } = q;
  const total = a + b;
  const aTens = Math.floor(a / 10);
  const aOnes = a % 10;
  const bTens = b / 10;
  const totalTens = Math.floor(total / 10);
  const totalOnes = total % 10;
  const hundreds = Math.floor(total / 100);
  const remainderTens = totalTens % 10;
  const isOver100 = total >= 100;

  const [phase, setPhase] = useState<Phase>("tap-prompt");
  const [tensAns, setTensAns] = useState("");
  const [onesAns, setOnesAns] = useState("");
  const [hundredsAns, setHundredsAns] = useState("");
  const [totalAns, setTotalAns] = useState("");
  const [hint, setHint] = useState("");

  const merged = phase === "animating" || phase === "input" || phase === "wrong" || phase === "correct";

  useEffect(() => {
    if (phase === "animating") {
      const t = setTimeout(() => setPhase("input"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleTap = () => {
    if (phase === "tap-prompt") setPhase("animating");
  };

  const checkAnswer = () => {
    // Check hundreds (if applicable)
    if (isOver100 && Number(hundredsAns) !== hundreds) {
      setHint("How many hundreds do we have? Look at the hundreds block.");
      setPhase("wrong");
      return;
    }

    const expectedTens = isOver100 ? remainderTens : totalTens;
    if (Number(tensAns) !== expectedTens) {
      setHint("Count the tens blocks — how many are there now?");
      setPhase("wrong");
      return;
    }
    if (Number(onesAns) !== totalOnes) {
      setHint("Look at the ones blocks — did they move at all?");
      setPhase("wrong");
      return;
    }
    if (Number(totalAns) !== total) {
      setHint("You've got the tens and ones right — now put them together.");
      setPhase("wrong");
      return;
    }
    setHint("");
    setPhase("correct");
  };

  const tryAgain = () => {
    setHint("");
    setPhase("input");
  };

  const correctMessage =
    level === 1
      ? "The ones never change when we add 10. 🌟"
      : level === 2
        ? "Only the tens changed — the ones stayed the same. 🌟"
        : "You're thinking in tens like a mathematician. 🌟";

  // How many green blocks to show
  const greenBlocks = bTens;

  // Total tens in the merged row
  const mergedTensCount = aTens + bTens;
  // If over 100, we show a hundreds block + remainder tens
  const displayTensAfterMerge = isOver100 ? mergedTensCount - 10 : mergedTensCount;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {a} + {b}
      </p>

      {/* Blocks area */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {/* Number label (before merge) */}
        {!merged && (
          <span
            className="text-4xl font-bold sm:text-5xl"
            style={{ color: BLUE, fontFamily: "var(--font-heading)" }}
          >
            {a}
          </span>
        )}

        {/* Main blocks row */}
        <div className="flex items-end gap-1.5 flex-wrap justify-center">
          {/* Hundreds block (only after merge, only if over 100) */}
          {merged && isOver100 && (
            <div className="mr-3 animate-fade-in">
              <HundredsBlock color={BLUE} />
              <span className="block text-center text-xs font-medium text-muted-foreground mt-1">1 hundred</span>
            </div>
          )}

          {/* Blue tens */}
          {Array.from({ length: aTens }).map((_, i) => (
            <TensBlock key={`bt${i}`} color={merged ? NEUTRAL : BLUE} />
          ))}

          {/* Green blocks (merged into row) */}
          {merged &&
            Array.from({ length: greenBlocks }).map((_, i) => (
              <div
                key={`gt${i}`}
                style={phase === "animating" ? { animation: `slideDown 0.8s ease-out ${i * 0.15}s both` } : undefined}
              >
                <TensBlock color={merged && phase !== "animating" ? NEUTRAL : GREEN} />
              </div>
            ))}

          {/* Ones */}
          <div className="ml-2 flex flex-wrap items-end gap-1">
            {Array.from({ length: aOnes }).map((_, i) => (
              <OnesBlock key={`o${i}`} color={merged ? NEUTRAL : BLUE} />
            ))}
          </div>
        </div>

        {!merged && (
          <span className="text-sm font-medium text-muted-foreground">
            {aTens} tens and {aOnes} ones
          </span>
        )}
      </div>

      {/* Green block area (before merge) */}
      {phase === "tap-prompt" && (
        <div className="mt-8 flex items-center justify-center gap-6 animate-fade-in">
          <span
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: GREEN, fontFamily: "var(--font-heading)" }}
          >
            +{b}
          </span>
          <button
            onClick={handleTap}
            className="cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-end gap-1.5"
            aria-label={`Tap to add ${b}`}
          >
            {Array.from({ length: greenBlocks }).map((_, i) => (
              <TensBlock
                key={`g${i}`}
                color={GREEN}
                className="ring-2 ring-green-400 ring-offset-2 ring-offset-card"
              />
            ))}
          </button>
          <span className="text-sm font-medium text-muted-foreground">{bTens} ten{bTens > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Tap prompt text */}
      {phase === "tap-prompt" && (
        <p className="mt-4 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap the green blocks to add them to the tens.
        </p>
      )}

      {/* Input fields */}
      {(phase === "input" || phase === "wrong") && (
        <div className="mt-8 space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {isOver100 && (
              <>
                <input
                  type="number"
                  inputMode="numeric"
                  value={hundredsAns}
                  onChange={(e) => { setHundredsAns(e.target.value); if (phase === "wrong") setPhase("input"); }}
                  className="w-16 rounded-lg border-2 px-2 py-2 text-center text-xl font-bold outline-none transition-colors focus:ring-2 focus:ring-ring/20"
                  style={{ borderColor: BLUE, color: BLUE }}
                  placeholder="?"
                />
                <span className="text-lg font-medium text-foreground">hundred,</span>
              </>
            )}
            <input
              type="number"
              inputMode="numeric"
              value={tensAns}
              onChange={(e) => { setTensAns(e.target.value); if (phase === "wrong") setPhase("input"); }}
              className="w-16 rounded-lg border-2 px-2 py-2 text-center text-xl font-bold outline-none transition-colors focus:ring-2 focus:ring-ring/20"
              style={{ borderColor: BLUE, color: BLUE }}
              placeholder="?"
            />
            <span className="text-lg font-medium text-foreground">tens and</span>
            <input
              type="number"
              inputMode="numeric"
              value={onesAns}
              onChange={(e) => { setOnesAns(e.target.value); if (phase === "wrong") setPhase("input"); }}
              className="w-16 rounded-lg border-2 px-2 py-2 text-center text-xl font-bold outline-none transition-colors focus:ring-2 focus:ring-ring/20"
              style={{ borderColor: BLUE, color: BLUE }}
              placeholder="?"
            />
            <span className="text-lg font-medium text-foreground">ones</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-medium text-foreground">So the answer is</span>
            <input
              type="number"
              inputMode="numeric"
              value={totalAns}
              onChange={(e) => { setTotalAns(e.target.value); if (phase === "wrong") setPhase("input"); }}
              className="w-20 rounded-lg border-2 border-primary px-3 py-2 text-center text-xl font-bold text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring/20 bg-background"
              placeholder="?"
            />
          </div>

          {hint && <p className="text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>}

          {phase === "input" && (
            <div className="text-center">
              <button
                onClick={checkAnswer}
                disabled={!tensAns || !onesAns || !totalAns || (isOver100 && !hundredsAns)}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check My Answer
              </button>
            </div>
          )}

          {phase === "wrong" && (
            <div className="text-center">
              <button
                onClick={tryAgain}
                className="rounded-xl border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Correct */}
      {phase === "correct" && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 text-center font-medium text-secondary-foreground">
            {correctMessage}
          </div>
          <div className="text-center">
            <button
              onClick={onCorrect}
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

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

const Plus10StrategyPractise = () => {
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState<Q>(() => generateL1());
  const [questionNum, setQuestionNum] = useState(1);
  const [l2Streak, setL2Streak] = useState(0);
  const [l3Unlocked, setL3Unlocked] = useState(false);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const l3UsedRef = useRef<Set<string>>(new Set());

  const genQuestion = useCallback((lvl: number) => {
    if (lvl === 1) return generateL1();
    if (lvl === 2) return generateL2();
    return generateL3(l3UsedRef.current);
  }, []);

  const handleLevelChange = (l: number) => {
    setLevel(l);
    setQuestion(genQuestion(l));
    setQuestionNum(1);
    if (l === 3) l3UsedRef.current = new Set();
  };

  const handleCorrect = () => {
    // Track L2 streak
    if (level === 2) {
      const newStreak = l2Streak + 1;
      setL2Streak(newStreak);
      if (newStreak >= 10 && !l3Unlocked) {
        setL3Unlocked(true);
        setShowUnlockBanner(true);
      }
    }

    setQuestionNum((n) => n + 1);
    setQuestion(genQuestion(level));
  };

  const switchToL3 = () => {
    setShowUnlockBanner(false);
    handleLevelChange(3);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/plus10-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          +10 Strategy — Practise
        </h1>
        <p className="mt-2 mb-6 text-center text-muted-foreground">
          Choose your level.
        </p>

        <LevelSelector level={level} onChange={handleLevelChange} l3Unlocked={l3Unlocked} />

        {/* Unlock banner */}
        {showUnlockBanner && (
          <div className="mt-4 rounded-xl border-2 border-primary bg-secondary p-4 text-center animate-fade-in">
            <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Fantastic work — you've unlocked Level 3! 🎉
            </p>
            <p className="mt-1 text-muted-foreground">Ready for a bigger challenge?</p>
            <div className="mt-3 flex gap-3 justify-center">
              <button
                onClick={switchToL3}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try Level 3
              </button>
              <button
                onClick={() => setShowUnlockBanner(false)}
                className="rounded-xl border-2 border-border px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Keep going
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Question {questionNum}
        </p>

        <QuestionCard
          key={`${level}-${questionNum}`}
          q={question}
          level={level}
          onCorrect={handleCorrect}
        />
      </div>
    </div>
  );
};

export default Plus10StrategyPractise;
