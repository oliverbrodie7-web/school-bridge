import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import { Pizza } from "@/components/FractionFood";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

/* ─── Small coloured block (Split Strategy) ─── */
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
    ? "h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl"
    : "h-14 w-14 text-xl sm:h-16 sm:w-16 sm:text-2xl";
  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-xl font-bold text-white transition-opacity duration-500 ${ghost ? "opacity-20" : "opacity-100"}`}
      style={{ backgroundColor: color }}
    >
      {value}
    </div>
  );
};

/* ─── Dienes-style tens block (used in +10) ─── */
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

/* ─── Dienes-style ones block ─── */
const OnesBlock = ({ color }: { color: string }) => (
  <div className="rounded-sm" style={{ width: 24, height: 24, backgroundColor: color }} />
);

/* ═══════════════════════════════════════════════════
   SPLIT STRATEGY — Demo Animation (Section 2)
   ═══════════════════════════════════════════════════ */
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

  const tensGone = ["addTens", "addOnes", "answer", "done"].includes(phase);
  const onesGone = ["addOnes", "answer", "done"].includes(phase);
  const showStep2 = tensGone;
  const showStep3 = onesGone;
  const showStep4 = ["answer", "done"].includes(phase);

  const reset = () => setPhase("prompt");

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl">
        {a} + {b}
      </p>
      <p className="mt-5 text-center text-base font-medium text-foreground">
        <span className="text-muted-foreground">Step 1: </span>
        Split each number into tens and ones
      </p>
      <div className="mt-3 flex items-start justify-center gap-8">
        {!blueSplit ? (
          <button
            onClick={() => setPhase("splitA")}
            disabled={phase !== "prompt"}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white transition-transform sm:h-20 sm:w-20 sm:text-3xl ${phase === "prompt" ? "cursor-pointer hover:scale-105 active:scale-95" : ""}`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {blueNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={bT} color={BLUE} ghost={tensGone} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={bO} color={ORANGE} ghost={onesGone} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">ones</span>
            </div>
          </div>
        )}

        {!orangeSplit ? (
          <button
            onClick={() => setPhase("splitB")}
            disabled={phase !== "splitA"}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white transition-transform sm:h-20 sm:w-20 sm:text-3xl ${phase === "splitA" ? "cursor-pointer hover:scale-105 active:scale-95" : ""}`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {orangeNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={oT} color={BLUE} ghost={tensGone} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={oO} color={ORANGE} ghost={onesGone} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">ones</span>
            </div>
          </div>
        )}
      </div>

      {phase === "prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">Tap each number to split it.</p>
      )}
      {phase === "splitA" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">Now tap the next number.</p>
      )}

      {showStep2 && (
        <div className="mt-6 animate-fade-in">
          <p className="text-center text-base font-medium text-muted-foreground mb-2">
            Step 2: <span style={{ color: BLUE }}>Add the tens</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Block value={bT} color={BLUE} size="small" />
            <span className="text-xl font-bold text-muted-foreground">+</span>
            <Block value={oT} color={BLUE} size="small" />
            <span className="text-xl font-bold text-muted-foreground">=</span>
            <span className="text-xl font-bold text-foreground">{tSum}</span>
          </div>
        </div>
      )}

      {showStep3 && (
        <div className="mt-5 animate-fade-in">
          <p className="text-center text-base font-medium text-muted-foreground mb-2">
            Step 3: <span style={{ color: ORANGE }}>Add the ones</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Block value={bO} color={ORANGE} size="small" />
            <span className="text-xl font-bold text-muted-foreground">+</span>
            <Block value={oO} color={ORANGE} size="small" />
            <span className="text-xl font-bold text-muted-foreground">=</span>
            <span className="text-xl font-bold text-foreground">{oSum}</span>
          </div>
        </div>
      )}

      {showStep4 && (
        <div className="mt-5 animate-fade-in">
          <p className="text-center text-base font-semibold text-foreground">
            <span className="text-muted-foreground">Step 4: </span>
            Answer: {tSum} + {oSum} = {total}
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center animate-fade-in">
          <button onClick={reset} className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SPLIT STRATEGY — Practice Question (Section 4)
   ═══════════════════════════════════════════════════ */
type PracticePhase = "idle" | "prompt" | "splitA" | "splitB" | "input" | "feedback";
type PracticeFeedback = null | "correct" | "tens" | "ones" | "total";

const SplitPracticeQuestion = () => {
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
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl">{a} + {b}</p>
      <div className="mt-6 flex items-start justify-center gap-8">
        {!blueSplit ? (
          <button
            onClick={() => setPhase("splitA")}
            disabled={phase !== "prompt"}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white transition-transform sm:h-20 sm:w-20 sm:text-3xl ${phase === "prompt" ? "cursor-pointer hover:scale-105 active:scale-95" : ""}`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {blueNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={bT} color={BLUE} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={bO} color={ORANGE} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">ones</span>
            </div>
          </div>
        )}

        {!orangeSplit ? (
          <button
            onClick={() => setPhase("splitB")}
            disabled={phase !== "splitA"}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white transition-transform sm:h-20 sm:w-20 sm:text-3xl ${phase === "splitA" ? "cursor-pointer hover:scale-105 active:scale-95" : ""}`}
            style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
          >
            {orangeNum}
          </button>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
              <Block value={oT} color={BLUE} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">tens</span>
            </div>
            <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
              <Block value={oO} color={ORANGE} />
              <span className="mt-1 text-xs font-medium text-muted-foreground">ones</span>
            </div>
          </div>
        )}
      </div>

      {phase === "prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">Tap each number to split it.</p>
      )}
      {phase === "splitA" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">Now tap the next number.</p>
      )}

      {(phase === "input" || phase === "feedback") && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <InputRow label={`Tens: ${bT} + ${oT} = `} value={tensInput} onChange={(v) => { setTensInput(v); setFeedback(null); }} />
          <InputRow label={`Ones: ${bO} + ${oO} = `} value={onesInput} onChange={(v) => { setOnesInput(v); setFeedback(null); }} />
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
            <div className={`rounded-xl p-4 text-center text-sm font-medium ${feedbackMessages[feedback].ok ? "bg-secondary text-secondary-foreground" : "bg-destructive/10 text-destructive"}`}>
              {feedbackMessages[feedback].text}
              {!feedbackMessages[feedback].ok && (
                <button onClick={() => setFeedback(null)} className="mt-2 block mx-auto text-sm underline hover:no-underline">Try again</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   +10 STRATEGY — Demo Animation (Section 2)
   ═══════════════════════════════════════════════════ */
type Plus10DemoPhase = "idle" | "tap-prompt" | "animating" | "result" | "done";

const Plus10DemoAnimation = () => {
  const [phase, setPhase] = useState<Plus10DemoPhase>("tap-prompt");
  const num = 34;
  const t = Math.floor(num / 10);
  const o = num % 10;
  const resultTens = t + 1;
  const result = num + 10;

  const merged = phase === "animating" || phase === "result" || phase === "done";

  useEffect(() => {
    if (phase === "animating") {
      const timer = setTimeout(() => setPhase("result"), 1200);
      return () => clearTimeout(timer);
    }
    if (phase === "result") {
      const timer = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const reset = () => setPhase("tap-prompt");

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
        {num} + 10
      </p>

      {phase === "tap-prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Tap the green ten block to add it to the tens.
        </p>
      )}

      {/* Block row */}
      <div className="mt-6 flex flex-col items-center gap-3 animate-fade-in">
        <div className="flex items-end gap-1.5">
          {/* Existing blue tens */}
          {Array.from({ length: t }).map((_, i) => (
            <TensBlock key={`t${i}`} color={merged ? NEUTRAL : BLUE} />
          ))}

          {/* Green block — only inline after merge */}
          {merged && (
            <div style={phase === "animating" ? { animation: "slideDown 0.8s ease-out forwards" } : undefined}>
              <TensBlock color={phase === "done" || phase === "result" ? NEUTRAL : GREEN} />
            </div>
          )}

          {/* Ones — never move */}
          <div className="ml-2 flex flex-wrap items-end gap-1">
            {Array.from({ length: o }).map((_, i) => (
              <OnesBlock key={`o${i}`} color={merged ? NEUTRAL : BLUE} />
            ))}
          </div>
        </div>

        {/* Green block below — tappable before merge */}
        {!merged && (
          <div className="mt-4 flex items-center gap-4 animate-fade-in">
            <span className="text-2xl font-bold" style={{ color: GREEN, fontFamily: "var(--font-heading)" }}>+10</span>
            <button
              onClick={() => phase === "tap-prompt" && setPhase("animating")}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label="Tap to add the green ten block"
            >
              <TensBlock color={GREEN} className="ring-2 ring-green-400 ring-offset-2 ring-offset-card" />
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {(phase === "result" || phase === "done") && (
        <div className="mt-5 text-center animate-fade-in">
          <p className="text-base font-medium text-muted-foreground">
            Now we have {resultTens} tens and {o} ones.
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {num} + 10 = {result}
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center animate-fade-in">
          <button onClick={reset} className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   +10 STRATEGY — Practice Question (Section 4)
   ═══════════════════════════════════════════════════ */
type Plus10PracticePhase = "idle" | "tap-prompt" | "animating" | "input" | "feedback";
type Plus10Feedback = null | "correct" | "tens-wrong" | "ones-wrong" | "answer-wrong";

const Plus10PracticeQuestion = () => {
  const [phase, setPhase] = useState<Plus10PracticePhase>("idle");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [feedback, setFeedback] = useState<Plus10Feedback>(null);

  const num = 56;
  const t = Math.floor(num / 10);
  const o = num % 10;
  const resultTens = t + 1;
  const result = num + 10;

  const merged = phase === "animating" || phase === "input" || phase === "feedback";

  useEffect(() => {
    if (phase === "animating") {
      const timer = setTimeout(() => setPhase("input"), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleCheck = () => {
    const tVal = Number(tensInput);
    const oVal = Number(onesInput);
    const aVal = Number(answerInput);
    if (tVal !== resultTens) setFeedback("tens-wrong");
    else if (oVal !== o) setFeedback("ones-wrong");
    else if (aVal !== result) setFeedback("answer-wrong");
    else setFeedback("correct");
  };

  if (phase === "idle") {
    return (
      <button
        onClick={() => setPhase("tap-prompt")}
        className="rounded-xl bg-foreground px-6 py-3.5 text-lg font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        Try a question
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 animate-fade-in">
      <p className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
        {num} + 10
      </p>

      {phase === "tap-prompt" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Tap the green ten block to add it.
        </p>
      )}

      {/* Block row */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-end gap-1.5">
          {Array.from({ length: t }).map((_, i) => (
            <TensBlock key={`t${i}`} color={merged ? NEUTRAL : BLUE} />
          ))}

          {merged && (
            <div style={phase === "animating" ? { animation: "slideDown 0.8s ease-out forwards" } : undefined}>
              <TensBlock color={phase === "input" || phase === "feedback" ? NEUTRAL : GREEN} />
            </div>
          )}

          <div className="ml-2 flex flex-wrap items-end gap-1">
            {Array.from({ length: o }).map((_, i) => (
              <OnesBlock key={`o${i}`} color={merged ? NEUTRAL : BLUE} />
            ))}
          </div>
        </div>

        {!merged && (
          <div className="mt-4 flex items-center gap-4 animate-fade-in">
            <span className="text-2xl font-bold" style={{ color: GREEN, fontFamily: "var(--font-heading)" }}>+10</span>
            <button
              onClick={() => phase === "tap-prompt" && setPhase("animating")}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <TensBlock color={GREEN} className="ring-2 ring-green-400 ring-offset-2 ring-offset-card" />
            </button>
          </div>
        )}
      </div>

      {/* Input fields */}
      {(phase === "input" || phase === "feedback") && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-foreground font-medium text-sm">Now we have</span>
            <input
              type="number"
              inputMode="numeric"
              value={tensInput}
              onChange={(e) => { setTensInput(e.target.value); setFeedback(null); }}
              className="w-16 rounded-lg border border-input bg-background px-3 py-2 text-center text-base font-semibold text-foreground outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-ring/20"
              placeholder="?"
            />
            <span className="text-foreground font-medium text-sm">tens and</span>
            <input
              type="number"
              inputMode="numeric"
              value={onesInput}
              onChange={(e) => { setOnesInput(e.target.value); setFeedback(null); }}
              className="w-16 rounded-lg border border-input bg-background px-3 py-2 text-center text-base font-semibold text-foreground outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-ring/20"
              placeholder="?"
            />
            <span className="text-foreground font-medium text-sm">ones</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-foreground font-medium text-sm">So the answer is</span>
            <input
              type="number"
              inputMode="numeric"
              value={answerInput}
              onChange={(e) => { setAnswerInput(e.target.value); setFeedback(null); }}
              className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-base font-semibold text-foreground outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-ring/20"
              placeholder="?"
            />
          </div>

          {!feedback && (
            <button
              onClick={handleCheck}
              disabled={!tensInput || !onesInput || !answerInput}
              className="w-full rounded-xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          )}

          {feedback && (
            <div className={`rounded-xl p-4 text-center text-sm font-medium ${feedback === "correct" ? "bg-secondary text-secondary-foreground" : "bg-destructive/10 text-destructive"}`}>
              {feedback === "correct" && "You've got it. The ones never change."}
              {feedback === "tens-wrong" && `Not quite — count the tens blocks. We had ${t}, now we have one more.`}
              {feedback === "ones-wrong" && `The ones didn't change — they're still ${o}.`}
              {feedback === "answer-wrong" && `Almost — ${resultTens} tens is ${resultTens * 10}, plus ${o} ones.`}
              {feedback !== "correct" && (
                <button onClick={() => setFeedback(null)} className="mt-2 block mx-auto text-sm underline hover:no-underline">Try again</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════
   +10 PARENT GUIDE
   ═══════════════════════════════════════════════════ */
const Plus10ParentGuide = () => (
  <div className="flex min-h-screen flex-col items-center px-6 py-12">
    <div className="w-full max-w-2xl">
      <Link
        to="/plus10-strategy"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back
      </Link>

      {/* ─── SECTION 1: REASSURANCE ─── */}
      <section className="relative mt-8">
        <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Parent Guide Split" /></div>
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl leading-tight pr-24"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Adding 10 should be simple. Here's why it sometimes isn't.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Most of us were taught to add numbers by counting up one at a time. Your child is being taught something more powerful — that when you add 10, only the tens digit ever changes. The ones stay exactly the same. Once this clicks, it changes how children see all of maths.
        </p>
      </section>

      <hr className="my-10 border-border" />

      {/* ─── SECTION 2: WHAT IS IT? ─── */}
      <section>
        <h2
          className="text-xl font-bold text-foreground sm:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What is the +10 Strategy?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Instead of counting up 10 individual steps, the +10 strategy teaches children to jump straight to the answer by recognising that adding 10 only ever changes the tens column. The ones digit never moves.
        </p>

        <div className="mt-8">
          <Plus10DemoAnimation />
        </div>

        <div className="mt-6 rounded-xl border-l-4 border-foreground/20 bg-muted p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-foreground/80">
            The goal of this strategy is not to get the answer. It is to help your child see that our number system is organised by tens and ones — and that adding 10 is as simple as changing one digit. This is place value in action.
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
              <span className="font-semibold text-foreground">Say this:</span> "Before we add 10, look at the tens digit. After we add 10, what do you think will happen to it? What about the ones digit?"
            </p>
          </Card>

          <Card title="If they're stuck">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Say this:</span> "Cover the ones digit with your finger. Now just look at the tens. If we add one more ten, what number comes next?"
            </p>
          </Card>

          <Card title="When they get it wrong">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Don't say:</span> "That's wrong."
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Do say:</span> "Let's look at the ones blocks — did they move at all? So what stayed the same?"
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
              Remember: you're building understanding, not just getting the answer.
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
            mistake="Your child adds 10 by counting up by ones (e.g. 34, 35, 36… all the way to 44)"
            explanation="They haven't yet made the connection between adding 10 and the tens column."
            suggestion={`"Can we find a faster way? Watch what happens to the tens block when we add 10."`}
          />
          <MistakeCard
            mistake="Your child changes the ones digit instead of the tens digit (e.g. 34 + 10 = 35)"
            explanation="They haven't yet connected the position of digits to their value."
            suggestion={`"Point to the tens. Point to the ones. Which column gets a new ten added to it?"`}
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
          Understanding this yourself makes it much easier to explain to your child.
        </p>

        <div className="mt-6">
          <Plus10PracticeQuestion />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-base font-medium text-foreground">
            Ready to sit with your child?
          </p>
          <Link
            to="/learn/plus10-strategy"
            className="mt-4 inline-block rounded-xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Open the student lesson
          </Link>
        </div>
      </section>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   SPLIT STRATEGY PARENT GUIDE
   ═══════════════════════════════════════════════════ */
const SplitParentGuide = () => (
  <div className="flex min-h-screen flex-col items-center px-6 py-12">
    <div className="w-full max-w-2xl">
      <Link
        to="/split-strategy"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back
      </Link>

      {/* ─── SECTION 1: REASSURANCE ─── */}
      <section className="relative mt-8">
        <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Parent Guide Plus10" /></div>
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl leading-tight pr-24"
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
          <SplitPracticeQuestion />
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

/* ═══════════════════════════════════════════════════
   HALVES, QUARTERS & EIGHTHS — Parent Guide
   ═══════════════════════════════════════════════════ */
const HQE_TEAL = "#1D9E75";
const HQE_LABEL = "#0F6E56";
const HQE_GREY = "#F5F5F5";
const HQE_GREY_BORDER = "#D4D4D4";

const AC9M2N03_PROPS = {
  code: "AC9M2N03",
  title: "Halves, quarters and eighths",
  description:
    "Recognise one-half as one of two equal parts; connect halves, quarters and eighths via repeated halving.",
  year: "Year 2",
  strand: "Number",
};

type HQEDemoPhase = "prompt" | "halved" | "quartered" | "shaded";

const HQEDemoAnimation = () => {
  const [phase, setPhase] = useState<HQEDemoPhase>("prompt");

  const slices = phase === "prompt" ? 1 : phase === "halved" ? 2 : 4;
  const shaded = phase === "shaded" ? [0] : [];

  const advance = () => {
    if (phase === "prompt") setPhase("halved");
    else if (phase === "halved") setPhase("quartered");
    else if (phase === "quartered") setPhase("shaded");
  };

  const reset = () => setPhase("prompt");

  const splitDone = phase === "quartered" || phase === "shaded";
  const canTapWhole = phase === "prompt" || phase === "halved";

  const handleSliceTap = (i: number) => {
    if (phase === "quartered" && i === 0) setPhase("shaded");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="text-sm font-medium text-muted-foreground text-center">
        Tap the pizza to slice it in half. Tap again to make quarters. Tap one slice to shade it.
      </p>

      <div className="mt-6 flex justify-center">
        <div
          role={canTapWhole ? "button" : undefined}
          onClick={canTapWhole ? advance : undefined}
          aria-label="Tap pizza to slice"
          className={
            canTapWhole
              ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
              : "cursor-default"
          }
          style={{ background: "transparent", border: "none", padding: 0, display: "inline-block" }}
        >
          <Pizza
            size={220}
            slices={slices}
            shaded={shaded}
            onSliceTap={splitDone && phase !== "shaded" ? handleSliceTap : undefined}
          />
        </div>
      </div>

      {phase === "halved" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Two equal slices — that's halves. Tap again to slice each half.
        </p>
      )}
      {phase === "quartered" && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
          Four equal slices — that's quarters. Tap one slice to shade it.
        </p>
      )}
      {phase === "shaded" && (
        <div className="mt-4 text-center animate-fade-in space-y-3">
          <p className="text-base font-semibold" style={{ color: HQE_LABEL }}>
            1 out of 4 equal slices = 1/4
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium underline-offset-2 hover:underline text-muted-foreground"
          >
            Replay
          </button>
        </div>
      )}
      <style>{`@keyframes fadeFill { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

/* ─── HQE Optional Practice (Section 4) ─── */
type HQEPracticePhase = "idle" | "active";

const HQEParentPractice = () => {
  const [phase, setPhase] = useState<HQEPracticePhase>("idle");
  const [taps, setTaps] = useState(0);
  const [shaded, setShaded] = useState<number[]>([]);
  const [shadedIn, setShadedIn] = useState("");
  const [partsIn, setPartsIn] = useState("");
  const [fractionIn, setFractionIn] = useState("");
  const [feedback, setFeedback] = useState<null | "correct" | "incorrect">(null);

  const splitDone = taps >= 2;
  const shadeDone = shaded.length >= 1;

  const handleTap = () => { if (taps < 2) setTaps((n) => n + 1); };
  const handleWedgeTap = (i: number) => {
    if (!splitDone || shadeDone) return;
    setShaded([i]);
  };

  const handleCheck = () => {
    const ok =
      Number(shadedIn) === 1 &&
      Number(partsIn) === 4 &&
      ["1/4", "one quarter", "a quarter", "quarter"].includes(fractionIn.trim().toLowerCase());
    setFeedback(ok ? "correct" : "incorrect");
  };

  const reset = () => {
    setPhase("idle");
    setTaps(0);
    setShaded([]);
    setShadedIn("");
    setPartsIn("");
    setFractionIn("");
    setFeedback(null);
  };

  if (phase === "idle") {
    return (
      <button
        onClick={() => setPhase("active")}
        className="rounded-xl bg-foreground px-6 py-3.5 text-lg font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        Try a question
      </button>
    );
  }

  // Build 4 quarter wedges of a circle
  const cx = 100, cy = 100, r = 90;
  const wedges = splitDone
    ? [0, 1, 2, 3].map((i) => {
        const a1 = (i * Math.PI) / 2 - Math.PI / 2;
        const a2 = ((i + 1) * Math.PI) / 2 - Math.PI / 2;
        return {
          d: `M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`,
        };
      })
    : [];

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 animate-fade-in">
      <p className="text-sm text-muted-foreground text-center">
        {!splitDone
          ? `Tap the pizza to slice it into quarters. (${taps} / 2 taps)`
          : !shadeDone
            ? "Now tap one slice to shade it."
            : "Fill in the answer below."}
      </p>

      <div className="mt-6 flex justify-center">
        <div
          role={!splitDone ? "button" : undefined}
          onClick={!splitDone ? handleTap : undefined}
          aria-label="Tap pizza to slice"
          className={
            !splitDone
              ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
              : "cursor-default"
          }
          style={{ background: "transparent", border: "none", padding: 0, display: "inline-block" }}
        >
          <Pizza
            size={220}
            slices={splitDone ? 4 : taps >= 1 ? 2 : 1}
            shaded={shaded}
            onSliceTap={splitDone && !shadeDone ? handleWedgeTap : undefined}
          />
        </div>
      </div>

      {shadeDone && feedback !== "correct" && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-foreground">
            <span>I took</span>
            <input
              type="number" inputMode="numeric" value={shadedIn}
              onChange={(e) => { setShadedIn(e.target.value); setFeedback(null); }}
              className="w-16 rounded-lg border border-input bg-background px-3 py-2 text-center font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
              placeholder="?"
            />
            <span>out of</span>
            <input
              type="number" inputMode="numeric" value={partsIn}
              onChange={(e) => { setPartsIn(e.target.value); setFeedback(null); }}
              className="w-16 rounded-lg border border-input bg-background px-3 py-2 text-center font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
              placeholder="?"
            />
            <span>equal slices =</span>
            <input
              type="text" value={fractionIn}
              onChange={(e) => { setFractionIn(e.target.value); setFeedback(null); }}
              className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-center font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
              placeholder="1/4"
            />
          </div>

          {feedback === "incorrect" && (
            <p className="text-center text-sm font-medium text-destructive animate-fade-in">
              Quarters come from slicing or breaking twice. Tap again.
            </p>
          )}

          <div className="text-center">
            <button
              onClick={handleCheck}
              disabled={!shadedIn || !partsIn || !fractionIn}
              className="rounded-xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </div>
        </div>
      )}

      {feedback === "correct" && (
        <div className="mt-6 text-center space-y-3 animate-fade-in">
          <p className="text-base font-semibold" style={{ color: HQE_LABEL }}>
            You've got it. Now you can show your child.
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium underline-offset-2 hover:underline text-muted-foreground"
          >
            Try again
          </button>
        </div>
      )}
      <style>{`@keyframes fadeFill { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

const HalvesQuartersEighthsParentGuide = () => (
  <div className="flex min-h-screen flex-col items-center px-6 py-12">
    <div className="w-full max-w-2xl">
      <Link
        to="/halves-quarters-eighths"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back
      </Link>

      {/* SECTION 1 — REASSURANCE */}
      <section className="relative mt-8">
        <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
          <CurriculumBadge {...AC9M2N03_PROPS} pageName="Parent Guide HQE" />
        </div>
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl leading-tight pr-24"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Fractions look different now than when you were at school.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          If your child came home talking about halves and quarters and you weren't sure how to help — you're not alone. Australian schools now teach fractions by connecting them to equal parts of real objects before ever writing a number. This guide will show you exactly what your child is learning and how to support them at home.
        </p>
      </section>

      <hr className="my-10 border-border" />

      {/* SECTION 2 — WHAT IS THIS TOPIC? */}
      <section>
        <h2
          className="text-xl font-bold text-foreground sm:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What are halves, quarters and eighths?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Your child is learning that a fraction is only a fraction if all parts are equal. A half means 1 of 2 equal parts. A quarter means 1 of 4 equal parts — made by halving twice. An eighth means 1 of 8 equal parts — made by halving three times. This is called <span className="font-semibold text-foreground">repeated halving</span>.
        </p>

        <h3
          className="mt-8 text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Concrete, Pictorial, Abstract
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Your child's teacher uses a three-step approach called Concrete, Pictorial, Abstract. First, children handle real objects — folding paper, cutting food, splitting groups of counters — to feel what equal parts mean. Then they draw and see pictures of those splits. Finally, they write the fraction as a number.
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          At home, try the Concrete stage first. Get a real pizza or a chocolate bar and ask your child to share it into equal parts before coming to this screen. Cutting a real pizza into quarters, or snapping a chocolate bar into equal pieces, is the physical experience that makes fractions stick. The screen shows the picture — the kitchen table provides the real thing.
        </p>

        <div className="mt-8">
          <HQEDemoAnimation />
        </div>

        <div className="mt-6 rounded-xl border-l-4 border-foreground/20 bg-muted p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-foreground/80">
            The most important thing your child is learning is not what 1/4 looks like — it is that a fraction only works when all parts are exactly equal. An unequal slice is not a fraction at all. Next time you share a pizza or break a chocolate bar, ask your child: are all the pieces the same size? That question is the foundation of all fraction work through to high school.
          </p>
        </div>
      </section>

      <hr className="my-10 border-border" />

      {/* SECTION 3 — HOW TO USE WITH YOUR CHILD */}
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
              <span className="font-semibold text-foreground">Say this:</span> "Before we write the fraction, let's split the shape. How many equal parts do we need? Are all the parts the same size?"
            </p>
          </Card>

          <Card title="If they're stuck">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Say this:</span> "Let's use a real chocolate bar instead. Snap it into equal pieces — how many pieces did you make? Are they all the same size?"
            </p>
          </Card>

          <Card title="When they get it wrong">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Don't say:</span> "That's wrong."
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Do say:</span> "Are all the parts exactly the same size? If not, it's not a fraction yet — let's try splitting it more carefully."
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
              Remember: equal parts is the whole point.
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
            mistake="Your child splits a shape into unequal parts and calls it a half."
            explanation="They understand the idea of splitting but haven't yet connected fractions to equal parts."
            suggestion={`"Are both slices exactly the same size? If one slice is bigger, it's not a half yet — let's try cutting it more carefully."`}
          />
          <MistakeCard
            mistake="Your child confuses the number of shaded parts with the fraction (e.g. shades 2 of 4 parts and says '2' instead of 2/4)."
            explanation="They haven't yet connected the fraction notation to the number of equal parts."
            suggestion={`"How many parts did we split it into altogether? That's the bottom number. How many did we shade? That's the top number."`}
          />
        </div>
      </section>

      <hr className="my-10 border-border" />

      {/* SECTION 4 — OPTIONAL PRACTICE */}
      <section className="pb-12">
        <h2
          className="text-xl font-bold text-foreground sm:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Want to try one yourself?
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Trying it yourself makes it much easier to explain to your child.
        </p>

        <div className="mt-6">
          <HQEParentPractice />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-base font-medium text-foreground">
            Ready to sit with your child?
          </p>
          <Link
            to="/learn/halves-quarters-eighths"
            className="mt-4 inline-block rounded-xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Open the student lesson
          </Link>
        </div>
      </section>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN PARENT COMPONENT — Router
   ═══════════════════════════════════════════════════ */
const Parent = () => {
  const [searchParams] = useSearchParams();
  const strategy = searchParams.get("strategy");

  if (strategy === "plus10") return <Plus10ParentGuide />;
  if (strategy === "split") return <SplitParentGuide />;
  if (strategy === "halvesQuartersEighths") return <HalvesQuartersEighthsParentGuide />;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl text-center">
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Parent Guide
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          We're building the Parent Guide content now.
          <br />
          Check back soon!
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Parent;
