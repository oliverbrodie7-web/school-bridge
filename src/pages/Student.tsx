import { useState } from "react";
import { Link } from "react-router-dom";

const QUESTIONS = [
  { a: 34, b: 52 },
  { a: 41, b: 35 },
  { a: 23, b: 64 },
  { a: 55, b: 32 },
  { a: 42, b: 47 },
];

const buildQuestion = (q: { a: number; b: number }) => {
  const tensA = Math.floor(q.a / 10) * 10;
  const tensB = Math.floor(q.b / 10) * 10;
  const onesA = q.a % 10;
  const onesB = q.b % 10;
  return { a: q.a, b: q.b, tensA, tensB, onesA, onesB, tensAnswer: tensA + tensB, onesAnswer: onesA + onesB, totalAnswer: q.a + q.b };
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQueue = () => shuffle(QUESTIONS).map(buildQuestion);

const TeachMe = ({ q }: { q: ReturnType<typeof buildQuestion> }) => (
  <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8 text-left space-y-5">
    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
      How the Split Strategy works
    </h3>

    <p className="text-muted-foreground">
      When we add two numbers, we can <strong className="text-foreground">split</strong> each number into tens and ones. Then we add the tens together, add the ones together, and combine them.
    </p>

    <div className="space-y-4">
      <Step number={1} title="Split each number" detail={`${q.a} = ${q.tensA} + ${q.onesA}   and   ${q.b} = ${q.tensB} + ${q.onesB}`} />
      <Step number={2} title="Add the tens" detail={`${q.tensA} + ${q.tensB} = ${q.tensAnswer}`} />
      <Step number={3} title="Add the ones" detail={`${q.onesA} + ${q.onesB} = ${q.onesAnswer}`} />
      <Step number={4} title="Combine" detail={`${q.tensAnswer} + ${q.onesAnswer} = ${q.totalAnswer}`} />
    </div>

    <p className="text-sm text-muted-foreground pt-2">Now try the question below! 👇</p>
  </div>
);

const Step = ({ number, title, detail }: { number: number; title: string; detail: string }) => (
  <div className="flex items-start gap-3">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
      {number}
    </span>
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="font-mono text-muted-foreground">{detail}</p>
    </div>
  </div>
);

type Feedback = null | "correct" | "tens" | "ones" | "total";

const Student = () => {
  const [queue, setQueue] = useState(() => buildQueue());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTeach, setShowTeach] = useState(false);
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const finished = currentIndex >= queue.length;
  const question = finished ? queue[0] : queue[currentIndex];

  const nextQuestion = () => {
    setCurrentIndex((i) => i + 1);
    setTensInput("");
    setOnesInput("");
    setTotalInput("");
    setFeedback(null);
  };

  const resetAll = () => {
    setQueue(buildQueue());
    setCurrentIndex(0);
    setTensInput("");
    setOnesInput("");
    setTotalInput("");
    setFeedback(null);
  };

  const handleCheck = () => {
    const t = Number(tensInput);
    const o = Number(onesInput);
    const tot = Number(totalInput);

    if (t !== question.tensAnswer) {
      setFeedback("tens");
    } else if (o !== question.onesAnswer) {
      setFeedback("ones");
    } else if (tot !== question.totalAnswer) {
      setFeedback("total");
    } else {
      setFeedback("correct");
    }
  };

  const tryAgain = () => {
    setFeedback(null);
  };

  const feedbackMessage: Record<Exclude<Feedback, null>, { text: string; isCorrect: boolean }> = {
    correct: { text: "Great work! You used the split strategy! 🌟", isCorrect: true },
    tens: { text: `Not quite — try adding just the tens first: ${question.tensA} + ${question.tensB}`, isCorrect: false },
    ones: { text: `Almost! Now check the ones: ${question.onesA} + ${question.onesB}`, isCorrect: false },
    total: { text: `You're so close! Try adding your tens answer and ones answer together.`, isCorrect: false },
  };

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <h1
            className="text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Great work!
          </h1>
          <p className="text-lg text-foreground">
            You just practised the split strategy like a Year 2 superstar.
          </p>
          <p className="text-muted-foreground">
            Parents — your child just practised the split strategy. Want to understand what they learned?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/parent"
              className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Show my parent
            </Link>
            <button
              onClick={resetAll}
              className="rounded-xl border-2 border-primary px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Practise again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        {/* Header area */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <h1
            className="text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Split Strategy
          </h1>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/learn/split-strategy"
              className="rounded-xl border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Learn It First
            </Link>
            <button
              onClick={() => setShowTeach((s) => !s)}
              className="rounded-xl border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {showTeach ? "Hide Explanation" : "Teach Me First"}
            </button>
            <Link
              to="/parent"
              className="rounded-xl border-2 border-border px-5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Parent Guide
            </Link>
          </div>
        </div>

        {/* Teach me section */}
        {showTeach && <TeachMe q={question} />}

        {/* Question */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-lg font-semibold text-foreground">
            Use the split strategy to solve:
          </p>
          <p
            className="mt-2 text-3xl font-bold text-primary sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {question.a} + {question.b}
          </p>

          {/* Breakdown rows */}
          <div className="mt-8 space-y-5">
            <Row
              label={`Split the tens: ${question.tensA} + ${question.tensB} = `}
              value={tensInput}
              onChange={(v) => { setTensInput(v); setFeedback(null); }}
            />
            <Row
              label={`Split the ones: ${question.onesA} + ${question.onesB} = `}
              value={onesInput}
              onChange={(v) => { setOnesInput(v); setFeedback(null); }}
            />
            <Row
              label="Now add them together: "
              suffix={
                <span className="text-muted-foreground">
                  {tensInput || "?"} + {onesInput || "?"} ={" "}
                </span>
              }
              value={totalInput}
              onChange={(v) => { setTotalInput(v); setFeedback(null); }}
            />
          </div>

          {/* Check button — hidden once feedback is shown */}
          {!feedback && (
            <button
              onClick={handleCheck}
              disabled={!tensInput || !onesInput || !totalInput}
              className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check My Answer
            </button>
          )}

          {/* Feedback */}
          {feedback && (
            <>
              <div
                className={`mt-5 rounded-xl p-4 text-center font-medium ${
                  feedbackMessage[feedback].isCorrect
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {feedbackMessage[feedback].text}
              </div>

              {feedbackMessage[feedback].isCorrect ? (
                <button
                  onClick={nextQuestion}
                  className="mt-4 w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Next Question
                </button>
              ) : (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={tryAgain}
                    className="flex-1 rounded-xl border-2 border-primary px-4 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="flex-1 rounded-xl border-2 border-border px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Skip to Next Question
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) => (
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

export default Student;
