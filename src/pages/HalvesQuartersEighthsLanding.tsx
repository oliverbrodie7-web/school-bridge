import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CurriculumBadge from "@/components/CurriculumBadge";
import { Pizza, ChocolateBar } from "@/components/FractionFood";

const AC9M2N03_PROPS = {
  code: "AC9M2N03",
  title: "Halves, quarters and eighths",
  description:
    "Recognise one-half as one of two equal parts; connect halves, quarters and eighths via repeated halving.",
  year: "Year 2",
  strand: "Number",
};

const HalvesQuartersEighthsLanding = () => {
  const [learnComplete, setLearnComplete] = useState(false);

  useEffect(() => {
    setLearnComplete(
      localStorage.getItem("halvesQuartersEighths_learnComplete") === "true"
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/student"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-8">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge
              {...AC9M2N03_PROPS}
              pageName="Halves, Quarters & Eighths Landing"
            />
          </div>
          <div className="text-center">
            <h1
              className="text-3xl font-bold text-foreground sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Halves, Quarters &amp; Eighths
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Learn how to split shapes and numbers into equal parts.
            </p>
          </div>
        </div>

        {/* Static visual preview: pizza + chocolate bar */}
        <div className="mt-6 flex items-end justify-center gap-8">
          <div className="flex flex-col items-center">
            <Pizza size={60} slices={4} shaded={[0]} />
            <span
              className="mt-1.5"
              style={{ fontSize: 11, color: "var(--color-text-tertiary, hsl(var(--muted-foreground)))" }}
            >
              pizza
            </span>
          </div>
          <div className="flex flex-col items-center">
            <ChocolateBar width={80} height={44} segments={2} shaded={[0]} />
            <span
              className="mt-1.5"
              style={{ fontSize: 11, color: "var(--color-text-tertiary, hsl(var(--muted-foreground)))" }}
            >
              chocolate bar
            </span>
          </div>
        </div>

        <div className="text-center space-y-8 mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/learn/halves-quarters-eighths"
              className="rounded-xl bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Learn
            </Link>
            <div className="flex flex-col items-center">
              <Link
                to="/practise/halves-quarters-eighths"
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
            to="/parent?strategy=halvesQuartersEighths"
            className="inline-block rounded-xl bg-muted px-8 py-4 text-lg font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Parent Guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HalvesQuartersEighthsLanding;
