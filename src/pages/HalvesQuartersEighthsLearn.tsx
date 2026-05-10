import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CurriculumBadge from "@/components/CurriculumBadge";
import { Pizza, ChocolateBar } from "@/components/FractionFood";

const TEAL = "#1D9E75";
const LABEL = "#0F6E56";

const AC9M2N03_PROPS = {
  code: "AC9M2N03",
  title: "Halves, quarters and eighths",
  description:
    "Recognise one-half as one of two equal parts; connect halves, quarters and eighths via repeated halving.",
  year: "Year 2",
  strand: "Number",
};

type SquarePhase = "prompt" | "splitting" | "pictorial" | "abstract";
type CirclePhase =
  | "prompt"
  | "halving"
  | "promptQuarter"
  | "quartering"
  | "pictorial"
  | "abstract";

const HalvesQuartersEighthsLearn = () => {
  const [exIndex, setExIndex] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/halves-quarters-eighths"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge
              {...AC9M2N03_PROPS}
              pageName="Halves, Quarters & Eighths Learn — I Do"
            />
          </div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Halves, Quarters &amp; Eighths — I Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Watch how shapes split into equal parts.
          </p>
        </div>

        {exIndex === 0 ? (
          <HalfSquareCard onNext={() => setExIndex(1)} />
        ) : (
          <QuarterCircleCard />
        )}
      </div>
    </div>
  );
};

/* ──────────────── EXAMPLE 1: HALF (SQUARE) ──────────────── */
const HalfSquareCard = ({ onNext }: { onNext: () => void }) => {
  const [phase, setPhase] = useState<SquarePhase>("prompt");

  useEffect(() => {
    if (phase === "splitting") {
      const t = setTimeout(() => setPhase("pictorial"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "pictorial") {
      const t = setTimeout(() => setPhase("abstract"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const split = phase !== "prompt";
  const filled = phase === "pictorial" || phase === "abstract";

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Example 1: </span>One half
      </p>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => phase === "prompt" && setPhase("splitting")}
          disabled={phase !== "prompt"}
          aria-label="Tap to split the square"
          className={phase === "prompt" ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : "cursor-default"}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <svg width="220" height="220" viewBox="0 0 200 200">
            {/* Whole square */}
            <rect
              x="2"
              y="2"
              width="196"
              height="196"
              fill={GREY}
              stroke={GREY_BORDER}
              strokeWidth="1"
              rx="6"
            />
            {/* Left half teal fill */}
            {filled && (
              <rect
                x="2"
                y="2"
                width="98"
                height="196"
                fill={TEAL}
                rx="6"
                style={{ animation: "fadeFill 200ms ease-in" }}
              />
            )}
            {/* Right half border re-stroke for clarity after fill */}
            {filled && (
              <rect
                x="100"
                y="2"
                width="98"
                height="196"
                fill="none"
                stroke={GREY_BORDER}
                strokeWidth="1"
              />
            )}
            {/* Dividing line */}
            <line
              x1="100"
              y1="2"
              x2="100"
              y2="198"
              stroke={LABEL}
              strokeWidth="2"
              strokeDasharray="196"
              strokeDashoffset={split ? 0 : 196}
              style={{ transition: "stroke-dashoffset 600ms ease-out" }}
            />
          </svg>
        </button>
      </div>

      {/* Labels */}
      {filled && (
        <div className="mt-3 flex justify-center gap-[110px] animate-fade-in">
          <span style={{ color: LABEL, fontWeight: 600, fontSize: 18 }}>1/2</span>
          <span style={{ color: LABEL, fontWeight: 600, fontSize: 18 }}>1/2</span>
        </div>
      )}

      {/* Prompt */}
      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap the shape to split it into 2 equal parts.
        </p>
      )}

      {/* Pictorial message */}
      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          Each part is the same size. We call each part <strong>one half</strong>.
        </p>
      )}

      {/* Abstract */}
      {phase === "abstract" && (
        <>
          <p
            className="mt-4 text-center text-lg font-semibold animate-fade-in"
            style={{ color: LABEL }}
          >
            1 out of 2 equal parts = 1/2
          </p>

          <Callout>
            A half is only a half if both parts are exactly equal. Unequal parts
            are <em>not</em> halves.
          </Callout>

          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={onNext}
              className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next Example
            </button>
          </div>
        </>
      )}

      <Keyframes />
    </div>
  );
};

/* ──────────────── EXAMPLE 2: QUARTER (CIRCLE) ──────────────── */
const QuarterCircleCard = () => {
  const [phase, setPhase] = useState<CirclePhase>("prompt");

  useEffect(() => {
    if (phase === "halving") {
      const t = setTimeout(() => setPhase("promptQuarter"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "quartering") {
      const t = setTimeout(() => setPhase("pictorial"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "pictorial") {
      const t = setTimeout(() => setPhase("abstract"), 2400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const halfDrawn = phase !== "prompt";
  const quarterDrawn = ["quartering", "pictorial", "abstract"].includes(phase);
  const filled = phase === "pictorial" || phase === "abstract";

  const tappable =
    phase === "prompt"
      ? () => setPhase("halving")
      : phase === "promptQuarter"
      ? () => setPhase("quartering")
      : null;

  // Top-right quarter sector path (cx=100, cy=100, r=95)
  const tr = "M 100 100 L 100 5 A 95 95 0 0 1 195 100 Z";

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Example 2: </span>One quarter
      </p>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => tappable?.()}
          disabled={!tappable}
          aria-label="Tap to split the circle"
          className={tappable ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : "cursor-default"}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <svg width="220" height="220" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="95"
              fill={GREY}
              stroke={GREY_BORDER}
              strokeWidth="1"
            />
            {/* Filled top-right quarter */}
            {filled && (
              <path
                d={tr}
                fill={TEAL}
                style={{ animation: "fadeFill 200ms ease-in" }}
              />
            )}
            {/* Horizontal divider */}
            <line
              x1="5"
              y1="100"
              x2="195"
              y2="100"
              stroke={LABEL}
              strokeWidth="2"
              strokeDasharray="190"
              strokeDashoffset={halfDrawn ? 0 : 190}
              style={{ transition: "stroke-dashoffset 600ms ease-out" }}
            />
            {/* Vertical divider */}
            <line
              x1="100"
              y1="5"
              x2="100"
              y2="195"
              stroke={LABEL}
              strokeWidth="2"
              strokeDasharray="190"
              strokeDashoffset={quarterDrawn ? 0 : 190}
              style={{ transition: "stroke-dashoffset 600ms ease-out" }}
            />
          </svg>
        </button>
      </div>

      {/* Quarter labels */}
      {filled && (
        <div className="relative mx-auto mt-3 animate-fade-in" style={{ width: 220, height: 24 }}>
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-1">
            <span className="text-center" style={{ color: LABEL, fontWeight: 600, fontSize: 16 }}>1/4</span>
            <span className="text-center" style={{ color: LABEL, fontWeight: 600, fontSize: 16 }}>1/4</span>
          </div>
        </div>
      )}
      {filled && (
        <div className="text-center text-xs text-muted-foreground -mt-1 animate-fade-in">
          (and 1/4 + 1/4 below the line — 4 equal parts)
        </div>
      )}

      {/* Prompts */}
      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap the shape to split it in half first.
        </p>
      )}
      {phase === "promptQuarter" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Now tap again to split each half in half.
        </p>
      )}

      {/* Pictorial message */}
      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          We split the half in half again. Now there are 4 equal parts. Each
          part is <strong>one quarter</strong>.
        </p>
      )}

      {/* Abstract */}
      {phase === "abstract" && (
        <>
          <p
            className="mt-4 text-center text-lg font-semibold animate-fade-in"
            style={{ color: LABEL }}
          >
            1 out of 4 equal parts = 1/4
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground animate-fade-in">
            It took 2 halvings to make quarters.
          </p>

          <Callout>
            Quarters come from halving twice. This is called{" "}
            <strong>repeated halving</strong> — and it's how your child's teacher
            explains fractions at school.
          </Callout>

          <div className="mt-6 text-center animate-fade-in">
            <Link
              to="/learn/halves-quarters-eighths/we-do"
              className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Let's try one together
            </Link>
          </div>
        </>
      )}

      <Keyframes />
    </div>
  );
};

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div
    className="mt-5 animate-fade-in"
    style={{
      backgroundColor: "#E1F5EE",
      border: `0.5px solid ${TEAL}`,
      borderRadius: 12,
      padding: "12px 14px",
      color: LABEL,
      fontSize: 14,
      lineHeight: 1.55,
    }}
  >
    {children}
  </div>
);

const Keyframes = () => (
  <style>{`
    @keyframes fadeFill {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `}</style>
);

export default HalvesQuartersEighthsLearn;
