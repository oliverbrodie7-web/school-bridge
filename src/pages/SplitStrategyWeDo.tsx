import { useState } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import SplitWorkspace, { StepMode } from "@/components/SplitWorkspace";

// Year-2-safe sums (ones never carry). We Do = 3 examples, Noah fades light -> half -> handover.
interface WeDoExample {
  a: number;
  b: number;
  splitA: StepMode;
  splitB: StepMode;
  combine: StepMode;
  note: string; // Noah's opening framing for this example
}

const EXAMPLES: WeDoExample[] = [
  // 1 — light: Noah splits both, child taps the combine
  { a: 34, b: 12, splitA: "demo", splitB: "demo", combine: "demo", note: "Let's do this one together — I'll split, you bring the parts together." },
  // 2 — half: Noah splits the first, child splits the second and does the adding
  { a: 23, b: 45, splitA: "demo", splitB: "input", combine: "input", note: "I'll start us off — then it's over to you." },
  // 3 — handover: child does the whole thing, I'm just here if you need me
  { a: 41, b: 36, splitA: "input", splitB: "input", combine: "input", note: "Your turn to lead — I'm right here if you need me." },
];

const SplitStrategyWeDo = () => {
  const [qIndex, setQIndex] = useState(0);
  const [done, setDone] = useState(false);
  const finished = qIndex >= EXAMPLES.length;
  const ex = finished ? EXAMPLES[0] : EXAMPLES[qIndex];
  const isLast = qIndex === EXAMPLES.length - 1;

  const next = () => {
    setDone(false);
    setQIndex((i) => i + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/split-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy We Do" />
          </div>
          <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
            Split Strategy — We Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Let's do these together. Bit by bit, you'll take the lead.
          </p>
        </div>

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Great teamwork! 🎉
            </p>
            <Link
              to="/learn/split-strategy/you-do"
              className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              I think you're ready — let's see what you can do!
            </Link>
          </div>
        ) : (
          <>
            <ProgressIndicator mode="learn" phase="wedo" current={qIndex + 1} total={EXAMPLES.length} />

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <SplitWorkspace
                key={qIndex}
                a={ex.a}
                b={ex.b}
                coach="noah"
                splitA={ex.splitA}
                splitB={ex.splitB}
                combine={ex.combine}
                onComplete={() => setDone(true)}
              />

              {done && (
                <div className="mt-4 text-center animate-fade-in">
                  <button
                    onClick={next}
                    className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {isLast ? "Next" : "Next Question"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ParentSignpost strategy="split" />
    </div>
  );
};

export default SplitStrategyWeDo;
