import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

/* ─── Question data ─── */
const QUESTIONS = [
  { computer: { number: 34, addend: 10 }, child: { number: 62, addend: 10 } },
  { computer: { number: 51, addend: 10 }, child: { number: 27, addend: 10 } },
  { computer: { number: 43, addend: 10 }, child: { number: 75, addend: 10 } },
  { computer: { number: 52, addend: 20 }, child: { number: 43, addend: 30 } },
];

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
            style={{
              animationDelay: `${(greenAnimating ? 0.8 : 0) + i * 0.12}s`,
              animationFillMode: "both",
            }}
          >
            <OnesBlock color={GREEN} />
          </div>
        ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Computer Demo Phase
   ═══════════════════════════════════════ */
type DemoPhase = "show" | "sliding" | "done";

const ComputerDemo = ({
  number,
  addend,
  onComplete,
}: {
  number: number;
  addend: number;
  onComplete: () => void;
}) => {
  const [phase, setPhase] = useState<DemoPhase>("show");
  const t = Math.floor(number / 10);
  const o = number % 10;
  const bt = Math.floor(addend / 10);
  const bo = addend % 10;
  const resultTens = t + bt;
  const resultOnes = o + bo;
  const result = number + addend;

  useEffect(() => {
    const slideDelay = 2000;
    const doneDelay = slideDelay + 1200 + bt * 150;
    const t1 = setTimeout(() => setPhase("sliding"), slideDelay);
    const t2 = setTimeout(() => setPhase("done"), doneDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [bt]);

  const merged = phase === "sliding" || phase === "done";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {number} + {addend}
      </p>

      {/* Narration */}
      <p
        className="text-center text-base text-muted-foreground"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {phase === "show" && `Watch — the computer will add ${addend}.`}
        {phase === "sliding" && "Adding the blocks…"}
        {phase === "done" &&
          `I added them. Now we have ${resultTens} tens and ${resultOnes} ones.`}
      </p>

      {/* Blocks */}
      <BlockRow
        tens={t}
        ones={o}
        tensColor={merged ? NEUTRAL : BLUE}
        onesColor={merged ? NEUTRAL : BLUE}
        greenTens={merged ? bt : 0}
        greenOnes={merged ? bo : 0}
        greenAnimating={phase === "sliding"}
      />

      {/* Addend label (before merge) */}
      {!merged && (
        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <span
            className="text-2xl font-bold"
            style={{ color: GREEN, fontFamily: "var(--font-heading)" }}
          >
            +{addend}
          </span>
          <div className="flex items-end gap-1.5">
            {Array.from({ length: bt }).map((_, i) => (
              <TensBlock key={`dt${i}`} color={GREEN} />
            ))}
            {bo > 0 && (
              <div className="ml-1 flex flex-wrap items-end gap-1">
                {Array.from({ length: bo }).map((_, i) => (
                  <OnesBlock key={`do${i}`} color={GREEN} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {phase === "done" && (
        <div className="text-center animate-fade-in">
          <p
            className="text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {number} + {addend} = {result}
          </p>
          <button
            onClick={onComplete}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Now it's your turn
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   Child Turn Phase
   ═══════════════════════════════════════ */
type ChildPhase = "show" | "tap-prompt" | "sliding" | "input" | "correct";

const ChildTurn = ({
  number,
  addend,
  onComplete,
}: {
  number: number;
  addend: number;
  onComplete: () => void;
}) => {
  const [phase, setPhase] = useState<ChildPhase>("show");
  const [tensInput, setTensInput] = useState("");
  const [onesInput, setOnesInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const tensRef = useRef<HTMLInputElement>(null);

  const t = Math.floor(number / 10);
  const o = number % 10;
  const bt = Math.floor(addend / 10);
  const bo = addend % 10;
  const resultTens = t + bt;
  const resultOnes = o + bo;
  const result = number + addend;
  const isPlus10 = addend === 10;

  // Auto show tap prompt after brief display
  useEffect(() => {
    const timer = setTimeout(() => setPhase("tap-prompt"), 1500);
    return () => clearTimeout(timer);
  }, []);

  // After slide, show input
  useEffect(() => {
    if (phase === "sliding") {
      const delay = 1000 + bt * 150;
      const timer = setTimeout(() => {
        setPhase("input");
        setTimeout(() => tensRef.current?.focus(), 100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [phase, bt]);

  const handleTap = () => {
    if (phase !== "tap-prompt") return;
    setPhase("sliding");
  };

  const merged = phase === "sliding" || phase === "input" || phase === "correct";

  const handleSubmit = () => {
    const tensCorrect = Number(tensInput) === resultTens;
    const onesCorrect = Number(onesInput) === resultOnes;
    if (tensCorrect && onesCorrect) {
      setShowHint(false);
      setPhase("correct");
    } else {
      setShowHint(true);
      if (!tensCorrect && !onesCorrect) {
        setHintMessage(
          "Not quite — count the tens blocks again, and check the ones too."
        );
      } else if (!tensCorrect) {
        setHintMessage("Look at the tens blocks — how many are there now?");
      } else {
        setHintMessage(
          isPlus10
            ? "The tens are right! Now look at the ones — did they change?"
            : "The tens are right! Now count all the ones blocks."
        );
      }
    }
  };

  const handleRetry = () => {
    setTensInput("");
    setOnesInput("");
    setShowHint(false);
    setTimeout(() => tensRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Equation */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {number} + {addend}
      </p>

      {/* Narration */}
      <p
        key={phase}
        className="text-center text-base text-muted-foreground animate-fade-in"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {phase === "show" && `Your turn! Here's ${number}.`}
        {phase === "tap-prompt" &&
          (isPlus10
            ? "Tap the green ten block to add it."
            : "Tap the green blocks to add them.")}
        {phase === "sliding" && "Great — watch them slide in…"}
        {phase === "input" && "Now count the blocks."}
        {phase === "correct" &&
          (isPlus10
            ? `Yes! ${number} + ${addend} = ${result}. The ones never change when we add 10.`
            : `Yes! ${number} + ${addend} = ${result}.`)}
      </p>

      {/* Blocks */}
      <BlockRow
        tens={t}
        ones={o}
        tensColor={merged ? NEUTRAL : BLUE}
        onesColor={merged ? NEUTRAL : BLUE}
        greenTens={merged ? bt : 0}
        greenOnes={merged ? bo : 0}
        greenAnimating={phase === "sliding"}
      />

      {/* Tappable green blocks */}
      {(phase === "show" || phase === "tap-prompt") && (
        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <span
            className="text-2xl font-bold"
            style={{ color: GREEN, fontFamily: "var(--font-heading)" }}
          >
            +{addend}
          </span>
          {phase === "tap-prompt" ? (
            <button
              onClick={handleTap}
              className="flex items-end gap-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              aria-label={`Tap to add ${addend}`}
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

      {/* Input boxes */}
      {phase === "input" && (
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
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />{" "}
            ones
          </p>

          {showHint && (
            <p
              className="text-base font-medium animate-fade-in"
              style={{ color: "#E88D30", fontFamily: "var(--font-body)" }}
            >
              {hintMessage}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Check
            </button>
            {showHint && (
              <button
                onClick={handleRetry}
                className="rounded-xl bg-muted px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Correct result */}
      {phase === "correct" && (
        <div className="mt-2 text-center animate-fade-in">
          <p
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Now we have <span className="font-bold">{resultTens}</span> tens and{" "}
            <span className="font-bold">{resultOnes}</span> ones
          </p>
          <p
            className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {number} + {addend} = {result}
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
            Next
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
type QStep = "computer" | "child";

const Plus10StrategyWeDo = () => {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState<QStep>("computer");

  const question = QUESTIONS[qIndex];
  const isLast = qIndex === QUESTIONS.length - 1;

  const handleComputerDone = () => setStep("child");

  const handleChildDone = () => {
    if (!isLast) {
      setQIndex((i) => i + 1);
      setStep("computer");
    } else {
      setStep("child"); // stay on last — button changes
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/plus10-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Plus10 Strategy We Do" /></div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            +10 Strategy — We Do
          </h1>
          <p
            className="mt-2 text-center text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            This time, the computer goes first. Then it's your turn.
          </p>
        </div>

        {/* Question indicator */}
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          Question {qIndex + 1} of {QUESTIONS.length}
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {step === "computer" ? (
            <ComputerDemo
              key={`demo-${qIndex}`}
              number={question.computer.number}
              addend={question.computer.addend}
              onComplete={handleComputerDone}
            />
          ) : (
            <ChildTurnWrapper
              key={`child-${qIndex}`}
              number={question.child.number}
              addend={question.child.addend}
              isLast={isLast}
              onNext={handleChildDone}
            />
          )}
        </div>
      </div>
      <ParentSignpost strategy="plus10" />
    </div>
  );
};

/* Wrapper that swaps the "Next" button on the last question */
const ChildTurnWrapper = ({
  number,
  addend,
  isLast,
  onNext,
}: {
  number: number;
  addend: number;
  isLast: boolean;
  onNext: () => void;
}) => {
  const [done, setDone] = useState(false);

  return done && isLast ? (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <p
        className="text-center text-lg font-semibold text-foreground"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Great teamwork! 🎉
      </p>
      <Link
        to="/learn/plus10-strategy/you-do"
        className="rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        I think you're ready — let's see what you can do!
      </Link>
    </div>
  ) : (
    <ChildTurn
      number={number}
      addend={addend}
      onComplete={() => {
        if (isLast) {
          setDone(true);
        } else {
          onNext();
        }
      }}
    />
  );
};

export default Plus10StrategyWeDo;
