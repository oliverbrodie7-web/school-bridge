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
    <>
      <style>{`
        .entry-btn-primary {
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          border-radius: var(--btn-primary-radius);
          padding: var(--btn-primary-padding);
          font-size: var(--btn-primary-font-size);
          font-weight: var(--btn-primary-font-weight);
          font-family: var(--font-family);
          border: none;
          box-shadow: var(--shadow-card);
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
          transition: opacity 200ms ease, transform 100ms ease;
        }
        .entry-btn-primary:hover { opacity: 0.85; }
        .entry-btn-primary:active { transform: scale(0.97); }
        .entry-btn-secondary {
          background: var(--btn-secondary-bg);
          border: var(--btn-secondary-border);
          color: var(--btn-secondary-text);
          border-radius: var(--btn-secondary-radius);
          padding: var(--btn-secondary-padding);
          font-weight: var(--font-weight-label);
          font-family: var(--font-family);
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
          transition: background 200ms ease, transform 100ms ease;
        }
        .entry-btn-secondary:hover { background: #F0EBE1; }
        .entry-btn-secondary:active { transform: scale(0.97); }
      `}</style>
      <div
        className="flex min-h-screen flex-col items-center px-6 py-12"
        style={{ backgroundColor: "var(--colour-page-bg)" }}
      >
        <div className="w-full max-w-md">
          <Link
            to="/student"
            className="inline-flex items-center gap-1 transition-colors"
            style={{
              color: "var(--colour-muted)",
              fontSize: "var(--font-size-label)",
              fontWeight: "var(--font-weight-label)",
              fontFamily: "var(--font-family)",
            }}
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
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize: "var(--font-size-heading-xl)",
                  fontWeight: "var(--font-weight-heading)",
                  color: "var(--colour-heading)",
                }}
              >
                Halves, Quarters &amp; Eighths
              </h1>
              <p
                className="mt-3"
                style={{
                  fontSize: "var(--font-size-subheading)",
                  fontWeight: "var(--font-weight-body)",
                  color: "var(--colour-subheading)",
                  fontFamily: "var(--font-family)",
                }}
              >
                Learn how to split shapes and numbers into equal parts.
              </p>
            </div>
          </div>

          {/* Static visual preview: pizza + chocolate bar */}
          <div className="mt-6 flex items-end justify-center gap-8">
            <div className="flex flex-col items-center">
              <Pizza size={60} slices={4} shaded={[0]} />
              <span className="mt-1.5" style={{ fontSize: 11, color: "var(--colour-muted)" }}>
                pizza
              </span>
            </div>
            <div className="flex flex-col items-center">
              <ChocolateBar width={80} height={44} segments={2} shaded={[0]} />
              <span className="mt-1.5" style={{ fontSize: 11, color: "var(--colour-muted)" }}>
                chocolate bar
              </span>
            </div>
          </div>

          <div className="text-center space-y-8 mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-start">
              <Link to="/learn/halves-quarters-eighths" className="entry-btn-primary">Learn</Link>
              <div className="flex flex-col items-center">
                <Link to="/practise/halves-quarters-eighths" className="entry-btn-secondary">Practise</Link>
                {learnComplete && (
                  <p
                    className="mt-3 max-w-[260px] animate-fade-in"
                    style={{
                      background: "#FFF3E0",
                      border: "1px solid #F4A261",
                      borderRadius: 12,
                      padding: "10px 16px",
                      fontSize: "var(--font-size-label)",
                      color: "var(--colour-body)",
                      fontFamily: "var(--font-family)",
                    }}
                  >
                    Welcome back — looks like you've already done the lesson. Ready to practise on your own?
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/parent?strategy=halvesQuartersEighths"
              className="inline-block transition-colors"
              style={{
                color: "var(--colour-muted)",
                fontSize: "var(--font-size-label)",
                fontWeight: "var(--font-weight-label)",
                fontFamily: "var(--font-family)",
              }}
            >
              Parent Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HalvesQuartersEighthsLanding;
