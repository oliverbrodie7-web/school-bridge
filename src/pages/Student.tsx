import { useState } from "react";
import { Link } from "react-router-dom";

const QUESTION = {
  a: 34,
  b: 52,
  tensA: 30,
  tensB: 50,
  onesA: 4,
  onesB: 2,
};

const tensAnswer = QUESTION.tensA + QUESTION.tensB;
const onesAnswer = QUESTION.onesA + QUESTION.onesB;
const totalAnswer = tensAnswer + onesAnswer;

const TeachMe = () => (
  <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8 text-left space-y-5">
    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
      How the Split Strategy works
    </h3>

    <p className="text-muted-foreground">
      When we add two numbers, we can <strong className="text-foreground">split</strong> each number into tens and ones. Then we add the tens together, add the ones together, and combine them.
    </p>

    <div className="space-y-4">
      <Step
        number={1}
        title="Split each number"
        detail={`${QUESTION.a} = ${QUESTION.tensA} + ${QUESTION.onesA}   and   ${QUESTION.b} = ${QUESTION.tensB} + ${QUESTION.onesB}`}
      />
      <Step
        number={2}
        title="Add the tens"
        detail={`${QUESTION.tensA} + ${QUESTION.tensB} = ${tensAnswer}`}
      />
      <Step
        number={3}
        title="Add the ones"
        detail={`${QUESTION.onesA} + ${QUESTION.onesB} = ${onesAnswer}`}
      />
      <Step
        number={4}
        title="Combine"
        detail={`${tensAnswer} + ${onesAnswer} = ${totalAnswer}`}
      />
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
  const [showTeach, setShowTeach] = useState(false);
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleCheck = () => {
    const t = Number(tensInput);
    const o = Number(onesInput);
    const tot = Number(totalInput);

    if (t !== tensAnswer) {
      setFeedback("tens");
    } else if (o !== onesAnswer) {
      setFeedback("ones");
    } else if (tot !== totalAnswer) {
      setFeedback("total");
    } else {
      setFeedback("correct");
    }
  };

  const feedbackMessage: Record<Exclude<Feedback, null>, { text: string; isCorrect: boolean }> = {
    correct: { text: "Great work! You used the split strategy! 🌟", isCorrect: true },
    tens: { text: `Not quite — try adding just the tens first: ${QUESTION.tensA} + ${QUESTION.tensB}`, isCorrect: false },
    ones: { text: `Almost! Now check the ones: ${QUESTION.onesA} + ${QUESTION.onesB}`, isCorrect: false },
    total: { text: `You're so close! Try adding your tens answer and ones answer together.`, isCorrect: false },
  };

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
          <div className="flex gap-3">
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
        {showTeach && <TeachMe />}

        {/* Question */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-lg font-semibold text-foreground">
            Use the split strategy to solve:
          </p>
          <p
            className="mt-2 text-3xl font-bold text-primary sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {QUESTION.a} + {QUESTION.b}
          </p>

          {/* Breakdown rows */}
          <div className="mt-8 space-y-6">
            {/* Tens row */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-medium text-foreground">Split the tens</p>
              <div className="flex flex-wrap items-center gap-3">
                <BubbleGroup count={3} label="10" variant="tens" />
                <span className="text-lg font-bold text-muted-foreground">+</span>
                <BubbleGroup count={5} label="10" variant="tens" />
                <span className="text-lg font-bold text-muted-foreground">=</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={tensInput}
                  onChange={(e) => { setTensInput(e.target.value); setFeedback(null); }}
                  className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            {/* Ones row */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-medium text-foreground">Split the ones</p>
              <div className="flex flex-wrap items-center gap-3">
                <BubbleGroup count={4} label="1" variant="ones" />
                <span className="text-lg font-bold text-muted-foreground">+</span>
                <BubbleGroup count={2} label="1" variant="ones" />
                <span className="text-lg font-bold text-muted-foreground">=</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={onesInput}
                  onChange={(e) => { setOnesInput(e.target.value); setFeedback(null); }}
                  className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            {/* Total row */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-medium text-foreground">Now add them together</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg text-muted-foreground">
                  {tensInput || "?"} + {onesInput || "?"} =
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={totalInput}
                  onChange={(e) => { setTotalInput(e.target.value); setFeedback(null); }}
                  className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
          </div>

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={!tensInput || !onesInput || !totalInput}
            className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check My Answer
          </button>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-5 rounded-xl p-4 text-center font-medium ${
                feedbackMessage[feedback].isCorrect
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {feedbackMessage[feedback].text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BubbleGroup = ({
  count,
  label,
  variant,
}: {
  count: number;
  label: string;
  variant: "tens" | "ones";
}) => (
  <div className="flex gap-1.5">
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
          variant === "tens"
            ? "bg-primary/15 text-primary"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {label}
      </span>
    ))}
  </div>
);

export default Student;
