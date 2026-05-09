import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import { setLearnComplete } from "@/lib/progress";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

/* ─── Question type ─── */
type QuestionData = { a: number; b: number };

const INITIAL_QUESTIONS: QuestionData[] = [
  { a: 24, b: 10 },
  { a: 53, b: 10 },
  { a: 41, b: 10 },
  { a: 34, b: 20 },
  { a: 67, b: 30 },
];

const EXTRA_BANK: QuestionData[] = [
  { a: 14, b: 10 },
  { a: 32, b: 10 },
  { a: 56, b: 10 },
  { a: 45, b: 20 },
  { a: 28, b: 30 },
];

const shuffle = (arr: QuestionData[]) => {
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

/* ─── Block row (supports multiple green tens + green ones) ─── */
const BlockRow = ({
  tens,
  ones,
  tensColor,
  onesColor,
  greenTens,
  greenOnes,
  greenAnimating,
}: {
  tens: number;
  ones: number;
  tensColor: string;
  onesColor: string;
  greenTens: number;
  greenOnes: number;
  greenAnimating: boolean;
}) => (
  <div className="flex items-end gap-1.5">
    {Array.from({ length: tens }).map((_, i) => (
      <TensBlock key={`t${i}`} color={tensColor} />
    ))}
    {greenTens > 0 &&
      Array.from({ length: greenTens }).map((_, i) => (
        <div
          key={`gt${i}`}
          style={
            greenAnimating
              ? { animation: `slideDown 0.8s ease-out ${i * 0.15}s both` }
              : undefined
          }
        >
          <TensBlock color={GREEN} />
        </div>
      ))}
    <div className="ml-2 flex flex-wrap items-end gap-1">
      {Array.from({ length: ones }).map((_, i) => (
        <OnesBlock key={`o${i}`} color={onesColor} />
      ))}
      {greenOnes > 0 &&
        Array.from({ length: greenOnes }).map((_, i) => (
          <div
            key={`go${i}`}
            className="animate-fade-in"
            style={{ animationDelay: `${(greenAnimating ? 0.8 : 0) + i * 0.12}s`, animationFillMode: "both" }}
          >
            <OnesBlock color={GREEN} />
          </div>
        ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Single Question
   ═══════════════════════════════════════ */
type QPhase = "show" | "tap-prompt" | "sliding" | "count-input" | "answer-input" | "correct";

const Question = ({
  question,
  onComplete,
}: {
  question: QuestionData;
  onComplete: () => void;
}) => {
  const { a, b } = question;
  const [phase, setPhase] = useState<QPhase>("show");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [countHint, setCountHint] = useState("");
  const [answerHint, setAnswerHint] = useState("");
  const tensRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const at = Math.floor(a / 10);
  const ao = a % 10;
  const bt = Math.floor(b / 10);
  const bo = b % 10;
  const resultTens = at + bt;
  const resultOnes = ao + bo;
  const result = a + b;
  const isPlus10 = b === 10;

  const merged =
    phase === "sliding" ||
    phase === "count-input" ||
    phase === "answer-input" ||
    phase === "correct";

  // Auto: show → tap-prompt
  useEffect(() => {
    const timer = setTimeout(() => setPhase("tap-prompt"), 1200);
    return () => clearTimeout(timer);
  }, []);

  // After slide → count-input
  useEffect(() => {
    if (phase === "sliding") {
      const delay = 1000 + bt * 150; // extra time for multiple tens
      const timer = setTimeout(() => {
        setPhase("count-input");
        setTimeout(() => tensRef.current?.focus(), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [phase, bt]);

  // Focus answer input
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
    const onesCorrect = Number(onesInput) === resultOnes;
    if (tensCorrect && onesCorrect) {
      setCountHint("");
      setPhase("answer-input");
    } else {
      if (!tensCorrect && !onesCorrect) {
        setCountHint("Not quite — count the tens blocks again, and check the ones too.");
      } else if (!tensCorrect) {
        setCountHint("Count the tens blocks — how many are there now?");
      } else {
        setCountHint(
          isPlus10
            ? "The tens are right! Now look at the ones — did they change?"
            : "The tens are right! Now count all the ones blocks."
        );
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
      case "show":
        return `Here's ${a}. Let's add ${b}.`;
      case "tap-prompt":
        return isPlus10
          ? "Tap the green ten block to add it."
          : "Tap the green blocks to add them.";
      case "sliding":
        return "Watch them slide in…";
      case "count-input":
        return "Now count the blocks.";
      case "answer-input":
        return "Now put the tens and ones together.";
      case "correct":
        return isPlus10
          ? "Perfect! You added 10 like a pro."
          : `Perfect! ${a} + ${b} = ${result}`;
    }
  })();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {a} + {b}
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
        tens={at}
        ones={ao}
        tensColor={merged ? NEUTRAL : BLUE}
        onesColor={merged ? NEUTRAL : BLUE}
        greenTens={merged ? bt : 0}
        greenOnes={merged ? bo : 0}
        greenAnimating={phase === "sliding"}
      />

      {/* Tappable green blocks (before merge) */}
      {(phase === "show" || phase === "tap-prompt") && (
        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <span
            className="text-2xl font-bold"
            style={{ color: GREEN, fontFamily: "var(--font-heading)" }}
          >
            +{b}
          </span>
          {phase === "tap-prompt" ? (
            <button
              onClick={handleTap}
              className="flex items-end gap-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label={`Tap to add ${b}`}
            >
              {Array.from({ length: bt }).map((_, i) => (
                <TensBlock
                  key={`tapT${i}`}
                  color={GREEN}
                  className="ring-2 ring-green-400 ring-offset-2 ring-offset-card"
                />
              ))}
              {bo > 0 && (
                <div className="ml-1 flex flex-wrap items-end gap-1">
                  {Array.from({ length: bo }).map((_, i) => (
                    <div
                      key={`tapO${i}`}
                      className="rounded-sm ring-2 ring-green-400 ring-offset-1 ring-offset-card"
                      style={{ width: 24, height: 24, backgroundColor: GREEN }}
                    />
                  ))}
                </div>
              )}
              <span
                className="absolute -bottom-2 left-0 right-0 h-1 animate-pulse rounded-full"
                style={{ backgroundColor: GREEN }}
              />
            </button>
          ) : (
            <div className="flex items-end gap-1.5">
              {Array.from({ length: bt }).map((_, i) => (
                <TensBlock key={`sT${i}`} color={GREEN} />
              ))}
              {bo > 0 && (
                <div className="ml-1 flex flex-wrap items-end gap-1">
                  {Array.from({ length: bo }).map((_, i) => (
                    <OnesBlock key={`sO${i}`} color={GREEN} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Count input: tens and ones */}
      {phase === "count-input" && (
        <div className="mt-2 flex flex-col items-center gap-3 animate-fade-in">
          <p
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
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
            <p
              className="text-base font-medium animate-fade-in"
              style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}
            >
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
          <p
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            ✓ {resultTens} tens and {resultOnes} ones
          </p>
          <p
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
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
            <p
              className="text-base font-medium animate-fade-in"
              style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}
            >
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
            {a} + {b} = {result}
          </p>
          <div
            className="mt-4 rounded-xl border-2 p-4 text-center"
            style={{ borderColor: GREEN, backgroundColor: "#F0FDF4" }}
          >
            <p
              className="text-base font-semibold text-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {isPlus10
                ? "The ones never change when we add 10."
                : "Add the tens first, then the ones — you've got this strategy!"}
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
  const [questions, setQuestions] = useState<QuestionData[]>(INITIAL_QUESTIONS);
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
    void setLearnComplete("plusTen");
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

        <div className="relative mt-6">
          <div className="absolute right-0 top-0 z-10"><CurriculumBadge {...AC9M2N04_PROPS} /></div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            +10 Strategy — You Do
          </h1>
          <p
            className="mt-2 text-center text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Your turn — you've got this.
          </p>
        </div>

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
              key={`${questions[qIndex].a}-${questions[qIndex].b}-${qIndex}`}
              question={questions[qIndex]}
              onComplete={handleQuestionComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Plus10StrategyYouDo;
