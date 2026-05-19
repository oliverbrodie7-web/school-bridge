import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
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

        {/* ProgressIndicator inserted directly — move into shared QuestionCard wrapper when refactor occurs. */}
        <ProgressIndicator mode="learn" phase="ido" current={exIndex + 1} total={2} />

        {exIndex === 0 ? (
          <HalfChocolateCard onNext={() => setExIndex(1)} />
        ) : (
          <QuarterPizzaCard />
        )}
      </div>
      <ParentSignpost strategy="halvesQuartersEighths" />
    </div>
  );
};

/* ──────────────── EXAMPLE 1: HALF (CHOCOLATE BAR) ──────────────── */
const HalfChocolateCard = ({ onNext }: { onNext: () => void }) => {
  const [phase, setPhase] = useState<SquarePhase>("prompt");
  const [buttonFading, setButtonFading] = useState(false);
  const handleTap = () => {
    setButtonFading(true);
    setTimeout(() => setPhase("splitting"), 300);
  };

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
    <div
      className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        scrollBehavior: "auto",
        overflowAnchor: "none",
      }}
    >
      <p className="text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Example 1: </span>One half
      </p>

      <p className="mt-4 text-center text-base text-foreground">
        Mia had a chocolate bar. She wanted to share it equally with her friend.
      </p>

      <div className="mt-6 flex justify-center">
        {!filled ? (
          <ChocolateBar
            width={280}
            height={120}
            segments={2}
            shaded={[0]}
            breaksDrawn={split}
            filled={filled}
          />
        ) : (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              alignItems: "flex-start",
              margin: "0 auto 8px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 100,
                  height: 90,
                  background: "#7B4A2A",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              />
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1D9E75" }}>1/2</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1D9E75" }}>Mia's piece ✓</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 100,
                  height: 90,
                  background: "#B07040",
                  opacity: 0.5,
                  borderRadius: 10,
                }}
              />
              <div style={{ fontSize: 22, fontWeight: 800, color: "#CCCCCC" }}>1/2</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#999999" }}>Friend's piece</div>
            </div>
          </div>
        )}
      </div>


      {phase === "prompt" && (
        <>
          <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
            How many equal pieces does she need to break it into?
          </p>
          <button
            type="button"
            onClick={handleTap}
            className="hqe-tap-button"
            style={{ opacity: buttonFading ? 0 : 1, transition: "opacity 200ms ease" }}
          >
            Tap the bar to break it
          </button>
        </>
      )}

      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          Mia broke the bar into 2 equal pieces. Each piece is <strong>one half</strong>. Mia and her friend each get 1/2.
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
            A half only works if both pieces are exactly the same size — just like Mia's chocolate bar.
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
  const [buttonFading, setButtonFading] = useState(false);

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

  const handleTap = () => {
    if (!tappable) return;
    setButtonFading(true);
    setTimeout(() => {
      tappable();
      setButtonFading(false);
    }, 300);
  };

  // Render with 2 slices (halves) until second tap, then 4 slices (quarters).
  const slices = quarterDrawn ? 4 : halfDrawn ? 2 : 1;
  const shaded = filled ? [0] : [];

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-lg font-semibold text-foreground">
        <span className="text-muted-foreground">Example 2: </span>One quarter
      </p>

      <p className="mt-4 text-center text-base text-foreground">
        Mia had a pizza. She wanted to share it equally between herself and 3 friends — 4 people in total.
      </p>

      <div className="mt-6 flex justify-center">
        {!filled ? (
          <Pizza size={240} slices={slices} shaded={shaded} cutsDrawn={true} filled={filled} />
        ) : (
          <svg width={220} height={220} viewBox="0 0 220 220" style={{ display: "block", margin: "0 auto" }} className="animate-fade-in">
            {/* Outer crust ring */}
            <circle cx={110} cy={110} r={104} fill="#C45E0A" />
            <circle cx={110} cy={110} r={96} fill="#FDE68A" />

            {/* SLICE 1 — Mia's (top right, red/taken) */}
            <path d="M110,110 L110,14 A96,96 0 0,1 206,110 Z" fill="#EF4444" stroke="#FFF8EC" strokeWidth={8} />
            {/* Toppings on Mia's slice */}
            <circle cx={153} cy={52} r={5.5} fill="#B91C1C" opacity={0.9} />
            <circle cx={170} cy={75} r={5} fill="#B91C1C" opacity={0.85} />
            <circle cx={150} cy={80} r={4.5} fill="#B91C1C" opacity={0.8} />
            <circle cx={172} cy={55} r={4} fill="#B91C1C" opacity={0.75} />
            {/* Crust arc slice 1 */}
            <path d="M110,14 A96,96 0 0,1 206,110" fill="none" stroke="#C45E0A" strokeWidth={12} strokeLinecap="butt" />

            {/* SLICE 2 — bottom right (faded) */}
            <path d="M110,110 L206,110 A96,96 0 0,1 110,206 Z" fill="#FDE68A" stroke="#FFF8EC" strokeWidth={8} opacity={0.45} />
            <path d="M206,110 A96,96 0 0,1 110,206" fill="none" stroke="#C45E0A" strokeWidth={12} strokeLinecap="butt" opacity={0.3} />

            {/* SLICE 3 — bottom left (faded) */}
            <path d="M110,110 L110,206 A96,96 0 0,1 14,110 Z" fill="#FDE68A" stroke="#FFF8EC" strokeWidth={8} opacity={0.45} />
            <path d="M110,206 A96,96 0 0,1 14,110" fill="none" stroke="#C45E0A" strokeWidth={12} strokeLinecap="butt" opacity={0.3} />

            {/* SLICE 4 — top left (faded) */}
            <path d="M110,110 L14,110 A96,96 0 0,1 110,14 Z" fill="#FDE68A" stroke="#FFF8EC" strokeWidth={8} opacity={0.45} />
            <path d="M14,110 A96,96 0 0,1 110,14" fill="none" stroke="#C45E0A" strokeWidth={12} strokeLinecap="butt" opacity={0.3} />

            {/* Pronounced cut lines */}
            <line x1={0} y1={110} x2={220} y2={110} stroke="#FFF8EC" strokeWidth={10} />
            <line x1={110} y1={0} x2={110} y2={220} stroke="#FFF8EC" strokeWidth={10} />

            {/* Centre dot */}
            <circle cx={110} cy={110} r={8} fill="#FFF8EC" />

            {/* 1/4 labels */}
            <text x={163} y={76} fontFamily="Nunito,sans-serif" fontSize={17} fontWeight={800} fill="white" textAnchor="middle" dominantBaseline="middle">1/4</text>
            <text x={163} y={148} fontFamily="Nunito,sans-serif" fontSize={17} fontWeight={800} fill="#C45E0A" textAnchor="middle" dominantBaseline="middle" opacity={0.5}>1/4</text>
            <text x={57} y={148} fontFamily="Nunito,sans-serif" fontSize={17} fontWeight={800} fill="#C45E0A" textAnchor="middle" dominantBaseline="middle" opacity={0.5}>1/4</text>
            <text x={57} y={76} fontFamily="Nunito,sans-serif" fontSize={17} fontWeight={800} fill="#C45E0A" textAnchor="middle" dominantBaseline="middle" opacity={0.5}>1/4</text>
          </svg>
        )}
      </div>

      {filled && (
        <div className="text-center animate-fade-in" style={{ color: "#1D9E75", fontWeight: 800, fontSize: 13, marginTop: 12, marginBottom: 16 }}>
          Mia's slice = 1/4 ✓
        </div>
      )}

      {phase === "prompt" && (
        <>
          <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
            How many equal slices does she need to cut it into?
          </p>
          <button type="button" onClick={handleTap} className="hqe-tap-button" style={{ opacity: buttonFading ? 0 : 1, transition: "opacity 200ms ease" }}>
            Tap the pizza to slice it
          </button>
        </>
      )}
      {phase === "promptQuarter" && (
        <>
          <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
            Now tap again to slice each half in half.
          </p>
          <button type="button" onClick={handleTap} className="hqe-tap-button" style={{ opacity: buttonFading ? 0 : 1, transition: "opacity 200ms ease" }}>
            Tap the pizza to slice it
          </button>
        </>
      )}

      {(phase === "pictorial" || phase === "abstract") && (
        <p className="mt-6 text-center text-base text-foreground animate-fade-in">
          Mia sliced the pizza in half, then in half again — making 4 equal slices. Each slice is <strong>one quarter</strong>. Each person gets 1/4.
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
            Quarters come from cutting twice. Next time you share a pizza with 3 friends, count the slices — 4 equal ones means each is one quarter.
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
    @keyframes learnPulse {
      0%, 100% { box-shadow: 0 4px 12px rgba(29,158,117,0.3); }
      50% { box-shadow: 0 4px 20px rgba(29,158,117,0.5), 0 0 0 4px rgba(29,158,117,0.15); }
    }
    .hqe-tap-button {
      background: #1D9E75;
      color: #ffffff;
      border: none;
      border-radius: 99px;
      padding: 10px 28px;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Nunito', sans-serif;
      display: block;
      margin: 16px auto 0;
      cursor: pointer;
      animation: learnPulse 2s ease-in-out infinite, fade-in 0.3s ease-out;
      transition: opacity 200ms ease;
    }
    .hqe-tap-button:active { opacity: 0; }
  `}</style>
);

export default HalvesQuartersEighthsLearn;
