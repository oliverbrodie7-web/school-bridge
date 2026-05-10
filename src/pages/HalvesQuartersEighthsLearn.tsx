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
            Watch how a chocolate bar and a pizza split into equal pieces.
          </p>
        </div>

        {exIndex === 0 ? (
          <HalfChocolateCard onNext={() => setExIndex(1)} />
        ) : (
          <QuarterPizzaCard />
        )}
      </div>
    </div>
  );
};

/* ──────────────── EXAMPLE 1: HALF (CHOCOLATE BAR) ──────────────── */
const HalfChocolateCard = ({ onNext }: { onNext: () => void }) => {
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
          aria-label="Tap the bar to break it"
          className={phase === "prompt" ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : "cursor-default"}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ChocolateBar
            width={280}
            height={120}
            segments={2}
            shaded={[0]}
            breaksDrawn={split}
            filled={filled}
          />
        </button>
      </div>

      {filled && (
        <div className="mt-3 flex justify-center gap-[140px] animate-fade-in">
          <span style={{ color: LABEL, fontWeight: 600, fontSize: 18 }}>1/2</span>
          <span style={{ color: LABEL, fontWeight: 600, fontSize: 18 }}>1/2</span>
        </div>
      )}

      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap the bar to break it into 2 equal pieces.
        </p>
      )}

      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          Each piece is the same size. We call each piece <strong>one half</strong>.
        </p>
      )}

      {phase === "abstract" && (
        <>
          <p
            className="mt-4 text-center text-lg font-semibold animate-fade-in"
            style={{ color: LABEL }}
          >
            1 out of 2 equal pieces = 1/2
          </p>

          <Callout>
            A half is only a half if both pieces are exactly the same size.
            Unequal pieces are <em>not</em> halves.
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

/* ──────────────── EXAMPLE 2: QUARTER (PIZZA) ──────────────── */
const QuarterPizzaCard = () => {
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

  // Render with 2 slices (halves) until second tap, then 4 slices (quarters).
  const slices = quarterDrawn ? 4 : halfDrawn ? 2 : 1;
  const shaded = filled ? [0] : [];

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
          aria-label="Tap the pizza to slice it"
          className={tappable ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : "cursor-default"}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <Pizza size={240} slices={slices} shaded={shaded} cutsDrawn={true} filled={filled} />
        </button>
      </div>

      {filled && (
        <div className="mt-3 text-center animate-fade-in" style={{ color: LABEL, fontWeight: 600, fontSize: 16 }}>
          1/4 + 1/4 + 1/4 + 1/4 — 4 equal slices
        </div>
      )}

      {phase === "prompt" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Tap the pizza to slice it in half first.
        </p>
      )}
      {phase === "promptQuarter" && (
        <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
          Now tap again to slice each half in half.
        </p>
      )}

      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          We sliced the pizza in half, then in half again. Now there are 4 equal
          slices. Each slice is <strong>one quarter</strong>.
        </p>
      )}

      {phase === "abstract" && (
        <>
          <p
            className="mt-4 text-center text-lg font-semibold animate-fade-in"
            style={{ color: LABEL }}
          >
            1 out of 4 equal slices = 1/4
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground animate-fade-in">
            It took 2 slices to make quarters.
          </p>

          <Callout>
            Quarters come from slicing twice. Next time you share a pizza, count
            the slices — if there are 4 equal ones, each slice is one quarter.
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
