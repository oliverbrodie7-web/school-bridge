import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BLUE = "#3B82F6";
const GREEN = "#22C55E";
const NEUTRAL = "#64748B";

const EXAMPLES = [
  { number: 23, label: "2 tens and 3 ones", resultLabel: "3 tens and 3 ones", result: 33 },
  { number: 45, label: "4 tens and 5 ones", resultLabel: "5 tens and 5 ones", result: 55 },
];

type Phase = "show-number" | "show-plus10" | "tap-prompt" | "animating" | "result" | "insight";

/* ─── Narration per phase ─── */
const getNarration = (example: (typeof EXAMPLES)[number], phase: Phase) => {
  const t = Math.floor(example.number / 10);
  const o = example.number % 10;
  const resultTens = t + 1;

  switch (phase) {
    case "show-number":
      return `Let's look at the number ${example.number}. It has ${t} tens and ${o} ones.`;
    case "show-plus10":
      return `We want to add 10. That's the same as adding 1 more ten.`;
    case "tap-prompt":
      return `Tap the green ten block to add it to our tens.`;
    case "animating":
      return `Watch — the new ten joins the other tens…`;
    case "result":
      return `Now we have ${resultTens} tens and ${o} ones. That makes ${example.result}!`;
    case "insight":
      return "";
  }
};

/* ─── Tens block: Dienes-style segmented rod (10 units) ─── */
const TensBlock = ({ color, className = "" }: { color: string; className?: string }) => (
  <div
    className={`flex flex-col overflow-hidden rounded-md ${className}`}
    style={{ width: 24, gap: 1, backgroundColor: "transparent" }}
  >
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="rounded-[2px]"
        style={{
          width: 24,
          height: 6,
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);

/* ─── Ones block: small square ─── */
const OnesBlock = ({ color }: { color: string }) => (
  <div
    className="rounded-sm"
    style={{
      width: 24,
      height: 24,
      backgroundColor: color,
    }}
  />
);

/* ─── Block visualisation for a number ─── */
const NumberBlocks = ({
  number,
  color,
  label,
}: {
  number: number;
  color: string;
  label: string;
}) => {
  const t = Math.floor(number / 10);
  const o = number % 10;

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="text-4xl font-bold sm:text-5xl"
        style={{ color, fontFamily: "var(--font-heading)" }}
      >
        {number}
      </span>
      <div className="flex items-end gap-1.5">
        {Array.from({ length: t }).map((_, i) => (
          <TensBlock key={`t${i}`} color={color} />
        ))}
        <div className="ml-2 flex flex-wrap items-end gap-1">
          {Array.from({ length: o }).map((_, i) => (
            <OnesBlock key={`o${i}`} color={color} />
          ))}
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

/* ─── Main page ─── */
const Plus10StrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/plus10-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <h1
          className="mt-6 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          +10 Strategy — I Do
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Watch how adding 10 works.
        </p>

        <ExampleCard
          key={exIndex}
          example={EXAMPLES[exIndex]}
          isLast={exIndex === EXAMPLES.length - 1}
          onNext={() => setExIndex((i) => i + 1)}
        />
      </div>
    </div>
  );
};

/* ─── Single worked example ─── */
const ExampleCard = ({
  example,
  isLast,
  onNext,
}: {
  example: (typeof EXAMPLES)[number];
  isLast: boolean;
  onNext: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("show-number");

  const t = Math.floor(example.number / 10);
  const o = example.number % 10;
  const resultTens = t + 1;

  // Only auto-advance the animating phase (the rest are tap-to-advance)
  useEffect(() => {
    if (phase === "animating") {
      const t1 = setTimeout(() => setPhase("result"), 1200);
      const t2 = setTimeout(() => setPhase("insight"), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  const handleTapGreenBlock = () => {
    if (phase !== "tap-prompt") return;
    setPhase("animating");
  };

  const narration = getNarration(example, phase);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Equation header */}
      <p
        className="text-center text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {example.number} + 10
      </p>

      {/* Narration text */}
      {narration && (
        <p
          key={phase}
          className="mt-6 text-center text-lg font-medium text-foreground leading-relaxed animate-fade-in"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {narration}
        </p>
      )}

      <div className="mt-6">
        {/* Step 1: Starting number with blocks */}
        <div className="animate-fade-in">
          <NumberBlocks number={example.number} color={BLUE} label={example.label} />
        </div>

        {/* "Next" button after show-number */}
        {phase === "show-number" && (
          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={() => setPhase("show-plus10")}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: +10 appears with green block */}
        {phase !== "show-number" && (
          <div className="mt-8 flex items-center justify-center gap-6 animate-fade-in">
            <span
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: GREEN, fontFamily: "var(--font-heading)" }}
            >
              +10
            </span>
            <div className="flex flex-col items-center gap-2">
              {phase === "show-plus10" ? (
                <TensBlock color={GREEN} />
              ) : phase === "tap-prompt" ? (
                <button
                  onClick={handleTapGreenBlock}
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  aria-label="Tap to add the green ten block"
                >
                  <TensBlock
                    color={GREEN}
                    className="ring-2 ring-green-400 ring-offset-2 ring-offset-card"
                  />
                  <span
                    className="mt-1 block h-1 w-full animate-pulse rounded-full"
                    style={{ backgroundColor: GREEN }}
                  />
                </button>
              ) : phase === "animating" || phase === "result" || phase === "insight" ? (
                <div style={{ width: 24, height: 64, opacity: 0 }} />
              ) : (
                <TensBlock color={GREEN} />
              )}
              {phase !== "animating" && phase !== "result" && phase !== "insight" && (
                <span className="text-sm font-medium text-muted-foreground">1 ten</span>
              )}
            </div>
          </div>
        )}

        {/* "Next" button after show-plus10 to advance to tap-prompt */}
        {phase === "show-plus10" && (
          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={() => setPhase("tap-prompt")}
              className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 3: Combined result */}
        {(phase === "animating" || phase === "result" || phase === "insight") && (
          <div className="mt-8 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              {/* Combined block row */}
              <div className="flex items-end gap-1.5">
                {Array.from({ length: t }).map((_, i) => (
                  <TensBlock key={`bt${i}`} color={NEUTRAL} />
                ))}
                <TensBlock color={GREEN} className="animate-fade-in" />
                <div className="ml-2 flex flex-wrap items-end gap-1">
                  {Array.from({ length: o }).map((_, i) => (
                    <OnesBlock key={`bo${i}`} color={NEUTRAL} />
                  ))}
                </div>
              </div>

              {/* Result text */}
              {(phase === "result" || phase === "insight") && (
                <div className="mt-4 text-center animate-fade-in">
                  <p className="text-base font-medium text-muted-foreground">
                    Now we have {resultTens} tens and {o} ones
                  </p>
                  <p
                    className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {example.number} + 10 = {example.result}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Key insight callout */}
        {phase === "insight" && (
          <div
            className="mt-8 rounded-xl border-2 p-5 text-center animate-fade-in"
            style={{
              borderColor: GREEN,
              backgroundColor: "#F0FDF4",
            }}
          >
            <p className="text-base font-semibold text-foreground leading-relaxed sm:text-lg">
              Did you notice? Only the tens changed.
              <br />
              The ones stayed exactly the same.
              <br />
              <span className="mt-1 inline-block font-bold" style={{ color: GREEN }}>
                That's what always happens when we add 10.
              </span>
            </p>
          </div>
        )}

        {/* Navigation */}
        {phase === "insight" && (
          <div className="mt-8 text-center animate-fade-in">
            {isLast ? (
              <Link
                to="/learn/plus10-strategy/we-do"
                className="inline-block rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Let's try one together
              </Link>
            ) : (
              <button
                onClick={onNext}
                className="rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Next Example
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plus10StrategyLearn;
