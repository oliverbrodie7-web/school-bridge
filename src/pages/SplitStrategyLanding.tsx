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
    <>
      <style>{`
        @keyframes morphA {
          from { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          to   { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes morphB {
          from { border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%; }
          to   { border-radius: 60% 40% 40% 60% / 60% 60% 40% 40%; }
        }
        @keyframes learnPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
          50%      { box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 6px rgba(0,0,0,0.06); }
        }
        .ssl-blob-wrap { width: 160px; height: 160px; position: relative; margin: 0 auto 8px; }
        .ssl-blob-1 {
          width: 130px; height: 130px; position: absolute; top: 0; left: 15px;
          background: #C8E6C9;
          animation: morphA 4s ease-in-out infinite alternate;
        }
        .ssl-blob-2 {
          width: 95px; height: 95px; position: absolute; top: 15px; left: 15px;
          background: #6BBF8A; opacity: 0.75;
          animation: morphB 4s ease-in-out infinite alternate-reverse;
        }
        .ssl-learn-btn {
          background: #ffffff; color: #1A1A1A; border: 2px solid #1A1A1A; border-radius: 16px;
          padding: 18px; font-size: 16px; font-weight: 800; width: 100%; cursor: pointer;
          font-family: 'Nunito', sans-serif; text-align: center; text-decoration: none;
          display: block;
          animation: learnPulse 2.5s ease-in-out infinite;
        }
        .ssl-learn-btn-done {
          background: #F5F5F5; color: #AAAAAA; border: 2px solid #E8E8E8;
          animation: none;
        }
        .ssl-learn-sub { font-size: 11px; font-weight: 500; color: #666666; display: block; margin-top: 3px; }
        .ssl-learn-sub-done { color: #AAAAAA; }
        .ssl-practise-btn {
          background: #ffffff; color: #1A1A1A; border: 2px solid #E8E0D4;
          border-radius: 16px; padding: 16px; font-size: 15px; font-weight: 700;
          width: 100%; cursor: pointer; font-family: 'Nunito', sans-serif;
          text-align: center; text-decoration: none; display: block;
          transition: background 150ms ease, transform 100ms ease;
        }
        .ssl-practise-btn:hover { background: #F5F0E8; }
        .ssl-practise-btn:active { transform: scale(0.98); }
        .ssl-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 600px) {
          .ssl-grid { grid-template-columns: 40% 60%; gap: 40px; align-items: center; }
          .ssl-left { display: flex; align-items: center; justify-content: center; }
          .ssl-right { text-align: left; }
          .ssl-right h1 { text-align: left; margin-left: 0; }
          .ssl-right p { text-align: left; margin-left: 0; }
        }
        .ssl-pg-pill {
          background: #ffffff; border: 1.5px solid #E8E0D4; border-radius: 99px;
          padding: 6px 16px; font-size: 12px; font-weight: 700; color: #1A1A1A;
          display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
          font-family: 'Nunito', sans-serif; text-decoration: none;
          transition: background 200ms ease, border-color 200ms ease;
        }
        .ssl-pg-pill:hover { background: #F5F0E8; border-color: #D4C9B8; }
        .ssl-pg-arrow { color: #999999; }
        /* Curriculum badge — warm-palette override, scoped to this screen only */
        .ssl-badge-warm > div > button {
          background-color: #F5F0E8 !important;
          border: 1px solid #D4C9B8 !important;
          color: #1A1A1A !important;
        }
        .ssl-badge-warm > div > button:hover {
          background-color: #EDE6D7 !important;
        }
        .ssl-badge-warm > div > button > div > span:nth-child(1) {
          color: #888888 !important;
          font-size: 10px !important;
          font-weight: 400 !important;
        }
        .ssl-badge-warm > div > button > div > span:nth-child(2) {
          color: #1A1A1A !important;
          font-size: 11px !important;
          font-weight: 700 !important;
        }
        .ssl-badge-warm > div > button > svg {
          color: #888888 !important;
        }
        .ssl-badge-warm .curriculum-badge-card {
          background-color: #ffffff !important;
          border: 1px solid #E8E0D4 !important;
        }
      `}</style>

      <div style={{ backgroundColor: "#FFF8EC", minHeight: "100vh" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 40px" }}>
          {/* Section 1: Header row */}
          <div className="flex items-start justify-between pt-6">
            <Link
              to="/student/addition"
              style={{ fontSize: 13, fontWeight: 600, color: "#999999", fontFamily: "'Nunito', sans-serif", textDecoration: "none" }}
            >
              ← Back
            </Link>
            <span className="ssl-badge-warm">
              <CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Landing" />
            </span>
          </div>

          <div className="ssl-grid mt-8">
            {/* Section 2: Hero visual */}
            <div className="ssl-left">
              <div className="ssl-blob-wrap">
                <div className="ssl-blob-1" />
                <div className="ssl-blob-2" />
              </div>
            </div>

            {/* Sections 3-7: Text, buttons, nudge, link */}
            <div className="ssl-right">
              {/* Section 3: Strategy name */}
              <h1
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  textAlign: "center",
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                Split Strategy
              </h1>

              {/* Section 4: Description */}
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#666666",
                  textAlign: "center",
                  lineHeight: 1.5,
                  maxWidth: 320,
                  margin: "0 auto 28px",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                The split strategy breaks numbers into tens and ones to make addition easier.
              </p>

              {/* Section 5: Stacked buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto 20px" }}>
                <Link to="/learn/split-strategy" className={learnComplete ? "ssl-learn-btn ssl-learn-btn-done" : "ssl-learn-btn"}>
                  Learn
                  <span className={learnComplete ? "ssl-learn-sub ssl-learn-sub-done" : "ssl-learn-sub"}>
                    {learnComplete ? "Already completed" : "New to this? Start here"}
                  </span>
                </Link>
                <Link to="/practise/split-strategy" className="ssl-practise-btn">
                  Practise
                </Link>
              </div>

              {/* Section 6: Returning nudge */}
              {learnComplete && (
                <div
                  className="animate-fade-in"
                  style={{
                    background: "#FFF3E0",
                    border: "1.5px solid #F4A261",
                    borderRadius: 14,
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "#555555",
                    textAlign: "center",
                    maxWidth: 320,
                    margin: "0 auto 16px",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Welcome back — looks like you've already done the lesson. Ready to practise on your own?
                </div>
              )}

              {/* Section 7: Parent Guide pill */}
              <div style={{ textAlign: "center" }}>
                <Link to="/parent?strategy=split" className="ssl-pg-pill">
                  Parent Guide
                  <span className="ssl-pg-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitStrategyLanding;
