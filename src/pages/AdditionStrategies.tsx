import { Link } from "react-router-dom";

const strategies = [
  {
    className: "strategy-card-plus10",
    label: "+10 Strategy",
    symbol: "+10",
    description: "Learn how adding 10s is faster than counting by 1s",
    to: "/plus10-strategy",
    tileBg: "#FFF3E0",
    tileColor: "#B35A00",
  },
  {
    className: "strategy-card-split",
    label: "Split Strategy",
    symbol: "+",
    description: "Break numbers into tens and ones to make adding easier",
    to: "/split-strategy",
    tileBg: "#E8F4FD",
    tileColor: "#1A5D8F",
  },
];

const AdditionStrategies = () => {
  return (
    <>
      <style>{`
        @keyframes bounceIn {
          from { transform: scale(0.6) translateY(30px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        .strategy-card {
          animation: var(--animation-bounce-in);
          transition: transform 200ms ease, box-shadow 200ms ease !important;
        }
        .strategy-card:hover {
          transform: scale(1.04) translateY(-3px) !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.10) !important;
          cursor: pointer;
        }
        .strategy-card:active {
          transform: scale(0.95) !important;
          transition: transform 100ms ease !important;
        }
      `}</style>

      <div
        className="flex min-h-screen flex-col items-center px-6 py-12"
        style={{ backgroundColor: "var(--colour-page-bg)" }}
      >
        <div className="w-full max-w-2xl">
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

          <div className="mt-8 text-center">
            <h1
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "var(--font-size-heading-xl)",
                fontWeight: "var(--font-weight-heading)",
                color: "var(--colour-heading)",
              }}
            >
              Addition
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
              Choose a strategy to learn or practise
            </p>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {strategies.map((s, i) => (
              <Link
                key={s.label}
                to={s.to}
                className={`${s.className} strategy-card flex flex-col items-center text-center`}
                style={{
                  backgroundColor: "var(--colour-card-bg)",
                  border: "1.5px solid #D4C9B8",
                  borderRadius: "var(--border-radius-card)",
                  padding: "var(--card-padding)",
                  boxShadow: "var(--shadow-card)",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {/* Icon tile */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: s.tileBg,
                  }}
                >
                  <span
                    className="font-bold"
                    style={{ color: s.tileColor, fontSize: 16 }}
                  >
                    {s.symbol}
                  </span>
                </div>

                <h2
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "var(--font-size-heading-md)",
                    fontWeight: "var(--font-weight-heading)",
                    color: "var(--colour-heading)",
                  }}
                >
                  {s.label}
                </h2>
                <p
                  className="mt-1"
                  style={{
                    fontSize: "var(--font-size-small)",
                    lineHeight: 1.4,
                    fontWeight: "var(--font-weight-body)",
                    color: "var(--colour-subheading)",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionStrategies;
