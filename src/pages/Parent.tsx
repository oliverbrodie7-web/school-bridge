import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

/* ─── Reusable split-box animation (clean adult styling) ─── */
const SplitBox = ({
  num,
  color,
  isSplit,
  t,
  o,
  canTap,
  onTap,
}: {
  num: number;
  color: string;
  isSplit: boolean;
  t: number;
  o: number;
  canTap: boolean;
  onTap: () => void;
}) => {
  if (isSplit) {
    return (
      <div className="flex gap-3">
        <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl"
            style={{ backgroundColor: color }}
          >
            {t}
          </div>
          <span className="mt-1 text-xs font-medium text-muted-foreground">tens</span>
        </div>
        <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl"
            style={{ backgroundColor: color }}
          >
            {o}
          </div>
          <span className="mt-1 text-xs font-medium text-muted-foreground">ones</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onTap}
      disabled={!canTap}
      className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white transition-transform sm:h-20 sm:w-20 sm:text-3xl ${
        canTap ? "cursor-pointer hover:scale-105 active:scale-95" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      {num}
    </button>
  );
};

/* ─── Demo animation for Section 2 ─── */
type DemoPhase = "prompt" | "splitA" | "splitB" | "addTens" | "addOnes" | "answer" | "done";

const DemoAnimation = () => {
  const [phase, setPhase] = useState<DemoPhase>("prompt");

  const a = 34, b = 12;
  const blueNum = Math.max(a, b);
  const orangeNum = Math.min(a, b);
  const bT = tens(blueNum), bO = ones(blueNum);
  const oT = tens(orangeNum), oO = ones(orangeNum);
  const tSum = bT + oT, oSum = bO + oO, total = blueNum + orangeNum;

  const blueSplit = phase !== "prompt";
  const orangeSplit = !["prompt", "splitA"].includes(phase);

  // Auto-advance through phases with delays matching student experience
  useEffect(() => {
    if (phase === "splitB") {
      const t = setTimeout(() => setPhase("addTens"), 3000);
      return () => clearTimeout(t);
    }
    if (phase === "addTens") {
      const t = setTimeout(() => setPhase("addOnes"), 3500);
      return () => clearTimeout(t);
    }
    if (phase === "addOnes") {
      const t = setTimeout(() => setPhase("answer"), 3500);
      return () => clearTimeout(t);
    }
    if (phase === "answer") {
      const t = setTimeout(() => setPhase("done"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const stepIndex = ["addTens", "addOnes", "answer", "done"].indexOf(phase);
  const showSplitLabel = !["prompt", "splitA"].includes(phase);

  const reset = () => setPhase("prompt");

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl">
        {a} + {b}
      </p>

      {/* Step 1 label - above the boxes */}
      {showSplitLabel && (
        <p className="mt-5 text-center text-base font-medium text-foreground animate-fade-in">
          <span className="text-muted-foreground">Step 1: </span>
          Split each number into tens and ones
        </p>
      )}

      <div className="mt-3 flex items-start justify-center gap-8">
        <SplitBox
          num={blueNum}
          color={BLUE}
          isSplit={blueSplit}
          t={bT}
          o={bO}
          canTap={phase === "prompt"}
          onTap={() => setPhase("splitA")}
        />
        <SplitBox
          num={orangeNum}
          color={ORANGE}
          isSplit={orangeSplit}
          t={oT}
          o={oO}
          canTap={phase === "splitA"}
          onTap={() => setPhase("splitB")}
        />
      </div>

      {phase === "prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Tap each number to split it.
        </p>
      )}
      {phase === "splitA" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Now tap the orange number.
        </p>
      )}

      {(stepIndex >= 0) && (
        <div className="mt-5 space-y-2">
          {stepIndex >= 0 && (
            <p className="text-center text-base font-medium animate-fade-in" style={{ color: BLUE }}>
              <span className="text-muted-foreground">Step 2: </span>
              Tens: {bT} + {oT} = {tSum}
            </p>
          )}
          {stepIndex >= 1 && (
            <p className="text-center text-base font-medium animate-fade-in" style={{ color: ORANGE }}>
              <span className="text-muted-foreground">Step 3: </span>
              Ones: {bO} + {oO} = {oSum}
            </p>
          )}
          {stepIndex >= 2 && (
            <p className="text-center text-base font-semibold text-foreground animate-fade-in">
              <span className="text-muted-foreground">Step 4: </span>
              Answer: {tSum} + {oSum} = {total}
            </p>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center animate-fade-in">
          <button
            onClick={reset}
            className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Practice question for Section 4 ─── */
type PracticePhase = "idle" | "prompt" | "splitA" | "splitB" | "input" | "feedback";
type PracticeFeedback = null | "correct" | "tens" | "ones" | "total";

const PracticeQuestion = () => {
  const [phase, setPhase] = useState<PracticePhase>("idle");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [feedback, setFeedback] = useState<PracticeFeedback>(null);

  const a = 43, b = 25;
  const blueNum = Math.max(a, b);
  const orangeNum = Math.min(a, b);
  const bT = tens(blueNum), bO = ones(blueNum);
  const oT = tens(orangeNum), oO = ones(orangeNum);
  const tSum = bT + oT, oSum = bO + oO, total = blueNum + orangeNum;

  const blueSplit = !["idle", "prompt"].includes(phase);
  const orangeSplit = !["idle", "prompt", "splitA"].includes(phase);

  if (phase === "splitB") {
    setTimeout(() => setPhase("input"), 800);
  }

  const handleCheck = () => {
    const t = Number(tensInput);
    const o = Number(onesInput);
    const tot = Number(totalInput);

    if (t !== tSum) setFeedback("tens");
    else if (o !== oSum) setFeedback("ones");
    else if (tot !== total) setFeedback("total");
    else setFeedback("correct");
  };

  const feedbackMessages: Record<Exclude<PracticeFeedback, null>, { text: string; ok: boolean }> = {
    correct: { text: "You've got it. Now you can show your child.", ok: true },
    tens: { text: `Not quite — try adding just the tens: ${bT} + ${oT}`, ok: false },
    ones: { text: `Almost — check the ones: ${bO} + ${oO}`, ok: false },
    total: { text: "So close — try adding your tens and ones results together.", ok: false },
  };

  if (phase === "idle") {
    return (
      <button
        onClick={() => setPhase("prompt")}
        className="rounded-xl bg-foreground px-6 py-3.5 text-lg font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        Try a question
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 animate-fade-in">
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl">
        {a} + {b}
      </p>

      <div className="mt-6 flex items-start justify-center gap-8">
        <SplitBox
          num={blueNum}
          color={BLUE}
          isSplit={blueSplit}
          t={bT}
          o={bO}
          canTap={phase === "prompt"}
          onTap={() => setPhase("splitA")}
        />
        <SplitBox
          num={orangeNum}
          color={ORANGE}
          isSplit={orangeSplit}
          t={oT}
          o={oO}
          canTap={phase === "splitA"}
          onTap={() => setPhase("splitB")}
        />
      </div>

      {phase === "prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Tap each number to split it.
        </p>
      )}
      {phase === "splitA" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Now tap the smaller number.
        </p>
      )}

      {(phase === "input" || phase === "feedback") && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <InputRow
            label={`Tens: ${bT} + ${oT} = `}
            value={tensInput}
            onChange={(v) => { setTensInput(v); setFeedback(null); }}
          />
          <InputRow
            label={`Ones: ${bO} + ${oO} = `}
            value={onesInput}
            onChange={(v) => { setOnesInput(v); setFeedback(null); }}
          />
          <InputRow
            label="Total: "
            suffix={<span className="text-muted-foreground">{tensInput || "?"} + {onesInput || "?"} = </span>}
            value={totalInput}
            onChange={(v) => { setTotalInput(v); setFeedback(null); }}
          />

          {!feedback && (
            <button
              onClick={handleCheck}
              disabled={!tensInput || !onesInput || !totalInput}
              className="w-full rounded-xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          )}

          {feedback && (
            <div
              className={`rounded-xl p-4 text-center text-sm font-medium ${
                feedbackMessages[feedback].ok
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {feedbackMessages[feedback].text}
              {!feedbackMessages[feedback].ok && (
                <button
                  onClick={() => setFeedback(null)}
                  className="mt-2 block mx-auto text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InputRow = ({
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
    <span className="text-foreground font-medium text-sm">{label}</span>
    {suffix}
    <input
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-base font-semibold text-foreground outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-ring/20"
    />
  </div>
);

/* ─── Main Parent Guide ─── */
const Parent = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <Link
          to="/split-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        {/* ─── SECTION 1: REASSURANCE ─── */}
        <section className="mt-8">
          <h1
            className="text-2xl font-bold text-foreground sm:text-3xl leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You're not behind. The way maths is taught has changed.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            If your child came home with maths homework and you didn't recognise how they were solving it — that's completely normal. Australian schools now teach strategies like the Split Strategy that most parents were never shown. This guide will explain exactly what your child is learning and how you can help.
          </p>
        </section>

        <hr className="my-10 border-border" />

        {/* ─── SECTION 2: WHAT IS IT? ─── */}
        <section>
          <h2
            className="text-xl font-bold text-foreground sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What is the Split Strategy?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Instead of stacking numbers and carrying the one (the way most of us learned), the split strategy teaches children to break numbers into their tens and ones first, add each part separately, then combine the results.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            This isn't a shortcut or a gimmick. It's designed to build a deep understanding of how numbers actually work.
          </p>

          <div className="mt-8">
            <DemoAnimation />
          </div>

          <div className="mt-6 rounded-xl border-l-4 border-foreground/20 bg-muted p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-foreground/80">
              The goal of Year 2 maths is not to answer questions correctly. It is to develop an understanding of how place value relates to addition and subtraction. When your child splits 34 into 30 and 4, they are showing they understand that 34 is made of 3 tens and 4 ones. That understanding is the whole point.
            </p>
          </div>
        </section>

        <hr className="my-10 border-border" />

        {/* ─── SECTION 3: HOW TO USE WITH YOUR CHILD ─── */}
        <section>
          <h2
            className="text-xl font-bold text-foreground sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sitting down with your child? Here's exactly what to say.
          </h2>

          <div className="mt-6 space-y-4">
            <Card title="Getting started">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Say this:</span> "Before we add these numbers, let's split them up. What are the tens hiding in this number? What are the ones?"
              </p>
            </Card>

            <Card title="If they're stuck">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Say this:</span> "Look at the first digit — that tells you the tens. Look at the second digit — that tells you the ones. So 34 has 3 tens, which is 30, and 4 ones, which is just 4."
              </p>
            </Card>

            <Card title="When they get it wrong">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Don't say:</span> "That's wrong."
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Do say:</span> "Interesting — let's check the tens first. How many tens are hiding in that number?"
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
                Remember: the goal is understanding, not the answer.
              </p>
            </Card>
          </div>

          <h3
            className="mt-10 text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Common mistakes to watch for:
          </h3>

          <div className="mt-4 space-y-4">
            <MistakeCard
              mistake="Your child adds all four digits together (e.g. 3 + 4 + 1 + 2 = 10 instead of 34 + 12 = 46)"
              explanation="They haven't yet connected the digit to its place value."
              suggestion={`"The 3 in 34 isn't worth 3 — it's worth 30. It's in the tens column."`}
            />
            <MistakeCard
              mistake="Your child gets the split right but adds the parts incorrectly (e.g. splits correctly but says 30 + 10 = 31)"
              explanation="The split strategy is working, but basic addition facts need reinforcement."
              suggestion={`"Great splitting! Now let's count the tens together — 10, 20, 30, 40. So 30 + 10 = 40."`}
            />
          </div>
        </section>

        <hr className="my-10 border-border" />

        {/* ─── SECTION 4: OPTIONAL PRACTICE ─── */}
        <section className="pb-12">
          <h2
            className="text-xl font-bold text-foreground sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Want to try one yourself?
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Some parents find it helps to try the strategy once before sitting down with their child. No pressure — but it's here if you want it.
          </p>

          <div className="mt-6">
            <PracticeQuestion />
          </div>

          <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-base font-medium text-foreground">
              Ready to sit with your child?
            </p>
            <Link
              to="/learn/split-strategy"
              className="mt-4 inline-block rounded-xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Open the student lesson
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ─── Small components ─── */
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
    {children}
  </div>
);

const MistakeCard = ({
  mistake,
  explanation,
  suggestion,
}: {
  mistake: string;
  explanation: string;
  suggestion: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-2">
    <p className="text-sm font-medium text-foreground">{mistake}</p>
    <p className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">What's happening:</span> {explanation}
    </p>
    <p className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">What to say:</span> {suggestion}
    </p>
  </div>
);

export default Parent;
