import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";

const BLUE = "#3B82F6";
const ORANGE = "#F97316";

const EXAMPLES = [
  { a: 34, b: 12 },
  { a: 53, b: 25 },
];

const tens = (n: number) => Math.floor(n / 10) * 10;
const ones = (n: number) => n % 10;

const SplitStrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);
  const isLast = exIndex === EXAMPLES.length - 1;

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
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Learn" />
          </div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Split Strategy — I Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Watch how the split strategy works.
          </p>
        </div>

        {/* ProgressIndicator inserted directly — move into shared QuestionCard wrapper when refactor occurs. */}
        <ProgressIndicator mode="learn" phase="ido" current={exIndex + 1} total={2} />

        <ExampleCard
          key={exIndex}
          example={EXAMPLES[exIndex]}
          isLast={isLast}
          onNext={() => setExIndex((i) => i + 1)}
        />
      </div>
      <ParentSignpost strategy="split" />
    </div>
  );
};

const Block = ({
  value,
  color,
  size = "normal",
}: {
  value: number;
  color: string;
  size?: "normal" | "small";
}) => {
  const dim =
    size === "small"
      ? "h-14 w-14 text-xl sm:h-16 sm:w-16 sm:text-2xl"
      : "h-16 w-16 text-2xl sm:h-20 sm:w-20 sm:text-3xl";
  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-2xl font-bold text-white`}
      style={{ backgroundColor: color }}
    >
      {value}
    </div>
  );
};

const StepPills = ({ current }: { current: 1 | 2 | 3 | 4 }) => (
  <div className="flex gap-1.5 mb-4">
    {[1, 2, 3, 4].map((n) => {
      const completed = n < current;
      const active = n === current;
      const style: React.CSSProperties = completed
        ? { background: "#1D9E75", color: "white", border: "1.5px solid #1D9E75" }
        : active
        ? { background: "#E1F5EE", color: "#0F6E56", border: "1.5px solid #1D9E75" }
        : {
            background: "transparent",
            color: "var(--color-text-tertiary)",
            border: "1px solid var(--color-border-secondary)",
          };
      return (
        <span
          key={n}
          style={{
            ...style,
            padding: "3px 12px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          Step {n}
        </span>
      );
    })}
  </div>
);

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div
    className="mt-3 mx-auto"
    style={{
      display: "inline-block",
      background: "#E1F5EE",
      color: "#0F6E56",
      borderRadius: 8,
      padding: "6px 12px",
      fontSize: 13,
    }}
  >
    {children}
  </div>
);

const Divider = () => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        height: 1,
        background: "#E1F5EE",
        margin: "20px 0",
        opacity: shown ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
    />
  );
};

/**
 * Wraps a newly revealed step. Mounts hidden, then fades + slides up after a delay.
 */
const RevealStep = ({
  delay = 200,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) => {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
      }}
    >
      {children}
    </div>
  );
};

const ExampleCard = ({
  example,
  isLast,
  onNext,
}: {
  example: { a: number; b: number };
  isLast: boolean;
  onNext: () => void;
}) => {
  const blueNum = Math.max(example.a, example.b);
  const orangeNum = Math.min(example.a, example.b);
  const bT = tens(blueNum);
  const bO = ones(blueNum);
  const oT = tens(orangeNum);
  const oO = ones(orangeNum);
  const tSum = bT + oT;
  const oSum = bO + oO;
  const total = blueNum + orangeNum;

  // step 1 internal: 'whole' -> 'splitA' -> 'splitB' -> 'done' (Next Step shows when done)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [s1Phase, setS1Phase] = useState<"whole" | "splitA" | "splitB">("whole");
  const [tensRevealed, setTensRevealed] = useState(false);
  const [onesRevealed, setOnesRevealed] = useState(false);
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [showFinalCta, setShowFinalCta] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setTensRevealed(true), 1000);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      const t = setTimeout(() => setOnesRevealed(true), 1000);
      return () => clearTimeout(t);
    }
    if (step === 4) {
      const t1 = setTimeout(() => setShowFinalAnswer(true), 400);
      const t2 = setTimeout(() => setShowFinalCta(true), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [step]);

  const s1Complete = s1Phase === "splitB";

  const opacityFor = (n: 1 | 2 | 3) => {
    if (step === 4) return 0.2;
    if (step > n) return 0.4;
    return 1;
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <StepPills current={step} />

      {/* Equation */}
      <p
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: "#1A2E1A",
          textAlign: "center",
          fontFamily: "var(--font-heading)",
        }}
      >
        {example.a} + {example.b}
      </p>

      {/* STEP 1 */}
      <div style={{ opacity: opacityFor(1), transition: "opacity 400ms ease-in-out" }}>
        <p className="mt-6 text-center text-base font-semibold text-foreground">
          Step 1: Split the numbers
        </p>

        <div className="mt-4 flex items-start justify-center gap-8">
          {/* Blue number */}
          {s1Phase === "whole" ? (
            <button
              onClick={() => step === 1 && setS1Phase("splitA")}
              disabled={step !== 1}
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl cursor-pointer hover:scale-110 active:scale-95"
              style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
            >
              {blueNum}
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
                <Block value={bT} color={BLUE} />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
              </div>
              <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
                <Block value={bO} color={ORANGE} />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
              </div>
            </div>
          )}

          {/* Orange number */}
          {s1Phase !== "splitB" ? (
            <button
              onClick={() => step === 1 && s1Phase === "splitA" && setS1Phase("splitB")}
              disabled={step !== 1 || s1Phase !== "splitA"}
              className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white transition-transform sm:h-24 sm:w-24 sm:text-4xl ${
                s1Phase === "splitA" ? "cursor-pointer hover:scale-110 active:scale-95" : ""
              }`}
              style={{ background: `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)` }}
            >
              {orangeNum}
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex flex-col items-center" style={{ animation: "slideLeft 0.4s ease-out" }}>
                <Block value={oT} color={BLUE} />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">tens</span>
              </div>
              <div className="flex flex-col items-center" style={{ animation: "slideRight 0.4s ease-out" }}>
                <Block value={oO} color={ORANGE} />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">ones</span>
              </div>
            </div>
          )}
        </div>

        {step === 1 && s1Phase === "whole" && (
          <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
            Tap each number to split it.
          </p>
        )}
        {step === 1 && s1Phase === "splitA" && (
          <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
            Now tap the next number.
          </p>
        )}
      </div>

      {step === 1 && s1Complete && (
        <NextStepButton onClick={() => setStep(2)} label="Next Step" />
      )}

      {/* STEP 2 */}
      {step >= 2 && (
        <>
          <Divider />
          <div style={{ opacity: opacityFor(2), transition: "opacity 400ms ease-in-out" }} className="text-center">
            <RevealStep>
              <p className="text-center text-base font-semibold text-foreground mb-3">
                Step 2: Add the tens
              </p>
              <div className="flex items-center justify-center gap-3">
                <Block value={bT} color={BLUE} size="small" />
                <span className="text-2xl font-bold text-muted-foreground">+</span>
                <Block value={oT} color={BLUE} size="small" />
                <span className="text-2xl font-bold text-muted-foreground">=</span>
                <span className="text-2xl font-bold" style={{ color: "#1A2E1A", minWidth: 40 }}>
                  {tensRevealed ? tSum : "?"}
                </span>
              </div>
              {tensRevealed && (
                <Callout>
                  The tens: {bT} + {oT} = {tSum}
                </Callout>
              )}
            </RevealStep>
          </div>
          {step === 2 && tensRevealed && (
            <NextStepButton onClick={() => setStep(3)} label="Next Step" />
          )}
        </>
      )}

      {/* STEP 3 */}
      {step >= 3 && (
        <>
          <Divider />
          <div style={{ opacity: opacityFor(3), transition: "opacity 400ms ease-in-out" }} className="text-center">
            <RevealStep>
              <p className="text-center text-base font-semibold text-foreground mb-3">
                Step 3: Add the ones
              </p>
              <div className="flex items-center justify-center gap-3">
                <Block value={bO} color={ORANGE} size="small" />
                <span className="text-2xl font-bold text-muted-foreground">+</span>
                <Block value={oO} color={ORANGE} size="small" />
                <span className="text-2xl font-bold text-muted-foreground">=</span>
                <span className="text-2xl font-bold" style={{ color: "#1A2E1A", minWidth: 40 }}>
                  {onesRevealed ? oSum : "?"}
                </span>
              </div>
              {onesRevealed && (
                <Callout>
                  The ones: {bO} + {oO} = {oSum}
                </Callout>
              )}
            </RevealStep>
          </div>
          {step === 3 && onesRevealed && (
            <NextStepButton onClick={() => setStep(4)} label="Next Step" />
          )}
        </>
      )}

      {/* STEP 4 */}
      {step >= 4 && (
        <>
          <Divider />
          <RevealStep>
          <div className="text-center">
            <p
              style={{
                fontSize: 22,
                color: "#1A2E1A",
                fontWeight: 500,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {example.a} + {example.b} =
            </p>
            <div
              style={{
                fontSize: 64,
                fontWeight: 500,
                color: "#1D9E75",
                textAlign: "center",
                lineHeight: 1,
                transform: showFinalAnswer ? "scale(1)" : "scale(0.6)",
                opacity: showFinalAnswer ? 1 : 0,
                transition: "transform 300ms ease-out, opacity 300ms ease-out",
              }}
            >
              {total}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#0F6E56",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {tSum} + {oSum} = {total}
            </p>
            <div
              style={{
                background: "#E1F5EE",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                color: "#085041",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Split, add the parts, put it together. That's the split strategy.
            </div>
          </div>
          </RevealStep>

          {showFinalCta && (
            <div className="mt-4 text-center animate-fade-in">
              {isLast ? (
                <Link
                  to="/learn/split-strategy/we-do"
                  className="inline-block rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
                  style={{ background: "#1D9E75" }}
                >
                  Let's try one together
                </Link>
              ) : (
                <button
                  onClick={onNext}
                  className="rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
                  style={{ background: "#1D9E75" }}
                >
                  Next Example
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const NextStepButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#0F6E56")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#1D9E75")}
    style={{
      background: "#1D9E75",
      color: "white",
      borderRadius: 12,
      padding: "10px 28px",
      fontSize: 14,
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      marginTop: 16,
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    }}
    className="animate-fade-in"
  >
    {label}
  </button>
);

export default SplitStrategyLearn;
