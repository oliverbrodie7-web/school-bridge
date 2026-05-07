import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

/* ─── Question banks ─── */
const INITIAL_QUESTIONS = [24, 53, 41, 67, 35];
const EXTRA_BANK = [14, 32, 56, 71, 48];

const shuffle = (arr: number[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

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

/* ─── Block row ─── */
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
   Single Question
   ═══════════════════════════════════════ */
type QPhase = "show" | "tap-prompt" | "sliding" | "count-input" | "answer-input" | "correct";

const Question = ({
  number,
  onComplete,
}: {
  number: number;
  onComplete: () => void;
}) => {
  const [phase, setPhase] = useState<QPhase>("show");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [countHint, setCountHint] = useState("");
  const [answerHint, setAnswerHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const tensRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const t = Math.floor(number / 10);
  const o = number % 10;
  const resultTens = t + 1;
  const result = number + 10;

  const merged = phase === "sliding" || phase === "count-input" || phase === "answer-input" || phase === "correct";

  // Auto: show → tap-prompt
  useEffect(() => {
    const timer = setTimeout(() => setPhase("tap-prompt"), 1200);
    return () => clearTimeout(timer);
  }, []);

  // After slide → count-input
  useEffect(() => {
    if (phase === "sliding") {
      const timer = setTimeout(() => {
        setPhase("count-input");
        setTimeout(() => tensRef.current?.focus(), 100);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Focus answer input when entering answer phase
  useEffect(() => {
    if (phase === "answer-input") {
      setTimeout(() => answerRef.current?.focus(), 100);
    }
  }, [phase]);

  const handleTap = () => {
    if (phase !== "tap-prompt") return;
    setPhase("sliding");
  };

  const handleCountSubmit = () => {
    const tensCorrect = Number(tensInput) === resultTens;
    const onesCorrect = Number(onesInput) === o;
    if (tensCorrect && onesCorrect) {
      setCountHint("");
      setPhase("answer-input");
    } else {
      if (!tensCorrect && !onesCorrect) {
        setCountHint("Not quite — count the tens blocks again, and check the ones too.");
      } else if (!tensCorrect) {
        setCountHint("Count the tens blocks — how many are there now?");
      } else {
        setCountHint("The tens are right! Now look at the ones — did they change?");
      }
    }
  };

  const handleCountRetry = () => {
    setTensInput("");
    setOnesInput("");
    setCountHint("");
    setTimeout(() => tensRef.current?.focus(), 100);
  };

  const handleAnswerSubmit = () => {
    if (Number(answerInput) === result) {
      setAnswerHint("");
      setPhase("correct");
    } else {
      setAnswerHint("You've got the tens and ones right — now put them together.");
    }
  };

  const handleAnswerRetry = () => {
    setAnswerInput("");
    setAnswerHint("");
    setTimeout(() => answerRef.current?.focus(), 100);
  };

  const narration = (() => {
    switch (phase) {
      case "show": return `Here's ${number}. Let's add 10.`;
      case "tap-prompt": return "Tap the green ten block to add it.";
      case "sliding": return "Watch it slide in…";
      case "count-input": return "Now count the blocks.";
      case "answer-input": return "Now put the tens and ones together.";
      case "correct": return `Perfect! You added 10 like a pro.`;
    }
  })();

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
        {narration}
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

      {/* Count input: tens and ones */}
      {phase === "count-input" && (
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
              onKeyDown={(e) => e.key === "Enter" && handleCountSubmit()}
            />{" "}
            ones
          </p>

          {countHint && (
            <p className="text-base font-medium animate-fade-in" style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}>
              {countHint}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCountSubmit}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Check
            </button>
            {countHint && (
              <button
                onClick={handleCountRetry}
                className="rounded-xl bg-muted px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Answer input */}
      {phase === "answer-input" && (
        <div className="mt-2 flex flex-col items-center gap-3 animate-fade-in">
          <p className="text-lg font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
            ✓ {resultTens} tens and {o} ones
          </p>
          <p className="text-lg font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
            So the answer is{" "}
            <input
              ref={answerRef}
              type="number"
              inputMode="numeric"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
              className="mx-1 inline-block w-16 rounded-lg border-2 border-primary bg-background px-2 py-1 text-center text-lg font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Final answer"
            />
          </p>

          {answerHint && (
            <p className="text-base font-medium animate-fade-in" style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}>
              {answerHint}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAnswerSubmit}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Check
            </button>
            {answerHint && (
              <button
                onClick={handleAnswerRetry}
                className="rounded-xl bg-muted px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Correct */}
      {phase === "correct" && (
        <div className="mt-2 text-center animate-fade-in">
          <p
            className="text-2xl font-bold text-foreground sm:text-3xl"
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
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
const Plus10StrategyYouDo = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<number[]>(INITIAL_QUESTIONS);
  const [qIndex, setQIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleQuestionComplete = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handleMorePractise = () => {
    setQuestions(shuffle(EXTRA_BANK));
    setQIndex(0);
    setFinished(false);
  };

  const handleReady = () => {
    localStorage.setItem("plus10Strategy_learnComplete", "true");
    navigate("/practise/plus10-strategy");
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/plus10-strategy/we-do"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          +10 Strategy — You Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Your turn — you've got this.
        </p>

        {!finished && (
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            Question {qIndex + 1} of {questions.length}
          </p>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {finished ? (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <p
                className="text-center text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Amazing work! You did it all by yourself! 🌟
              </p>
              <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
                <button
                  onClick={handleMorePractise}
                  className="rounded-xl bg-muted px-6 py-3.5 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  I'd like more practise
                </button>
                <button
                  onClick={handleReady}
                  className="rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  I'm ready to try on my own
                </button>
              </div>
            </div>
          ) : (
            <Question
              key={`${questions[qIndex]}-${qIndex}`}
              number={questions[qIndex]}
              onComplete={handleQuestionComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Plus10StrategyYouDo;
