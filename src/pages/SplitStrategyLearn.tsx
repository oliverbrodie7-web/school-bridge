import { useState } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import SplitWorkspace from "@/components/SplitWorkspace";

const TEAL = "#1D9E75";

// Year-2-safe sums (ones never carry). See it = 2 gentle examples.
const EXAMPLES = [
  { a: 34, b: 12 },
  { a: 53, b: 25 },
];

const SplitStrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);
  const [done, setDone] = useState(false);
  const isLast = exIndex === EXAMPLES.length - 1;
  const ex = EXAMPLES[exIndex];

  const next = () => {
    setDone(false);
    setExIndex((i) => i + 1);
  };

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
          <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
            Split Strategy — I Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">Watch how the split strategy works.</p>
        </div>

        <ProgressIndicator mode="learn" phase="ido" current={exIndex + 1} total={EXAMPLES.length} />

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <SplitWorkspace
            key={exIndex}
            a={ex.a}
            b={ex.b}
            coach="mia"
            splitA="demo"
            splitB="demo"
            combine="demo"
            onComplete={() => setDone(true)}
          />

          {done && (
            <div className="mt-4 text-center animate-fade-in">
              {isLast ? (
                <Link
                  to="/learn/split-strategy/we-do"
                  className="inline-block rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
                  style={{ background: TEAL }}
                >
                  Let's try one together
                </Link>
              ) : (
                <button
                  onClick={next}
                  className="rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
                  style={{ background: TEAL }}
                >
                  Next Example
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <ParentSignpost strategy="split" />
    </div>
  );
};

export default SplitStrategyLearn;
