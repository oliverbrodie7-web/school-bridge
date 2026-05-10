import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLearnComplete, migrateLocalProgressIfNeeded } from "@/lib/progress";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";

const SplitStrategyLanding = () => {
  const [learnComplete, setLearnComplete] = useState(false);

  useEffect(() => {
    (async () => {
      await migrateLocalProgressIfNeeded();
      setLearnComplete(await getLearnComplete("splitStrategy"));
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/student/addition"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-8">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10"><CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Landing" /></div>
          <div className="text-center">
            <h1
              className="text-3xl font-bold text-foreground sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Split Strategy
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              The split strategy breaks numbers into tens and ones to make addition easier.
            </p>
          </div>
        </div>

        <div className="text-center space-y-8 mt-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/learn/split-strategy"
              className="rounded-xl bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Learn
            </Link>
            <div className="flex flex-col items-center">
              <Link
                to="/practise/split-strategy"
                className="rounded-xl bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Practise
              </Link>
              {learnComplete && (
                <p className="mt-2 max-w-[220px] text-sm text-muted-foreground animate-fade-in">
                  Welcome back — looks like you've already done the lesson. Ready to practise on your own?
                </p>
              )}
            </div>
          </div>

          <Link
            to="/parent?strategy=split"
            className="inline-block rounded-xl bg-muted px-8 py-4 text-lg font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Parent Guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SplitStrategyLanding;
