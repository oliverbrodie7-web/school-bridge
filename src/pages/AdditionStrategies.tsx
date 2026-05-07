import { Link } from "react-router-dom";

const strategies = [
  {
    className: "strategy-card-plus10",
    label: "+10 Strategy",
    symbol: "+10",
    description: "Learn how adding 10s is faster than counting by 1s",
    to: "/plus10-strategy",
  },
  {
    className: "strategy-card-split",
    label: "Split Strategy",
    symbol: "+",
    description: "Break numbers into tens and ones to make adding easier",
    to: "/split-strategy",
  },
];

const AdditionStrategies = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <Link
          to="/student"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="mt-8 text-center">
          <h1
            className="text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Addition
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Choose a strategy to learn or practise
          </p>
        </div>

        <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2">
          {strategies.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className={`${s.className} group flex flex-col items-center text-center hover:bg-[var(--colour-card-hover-active)]`}
              style={{
                backgroundColor: "var(--colour-card-bg)",
                border: "0.5px solid var(--colour-active-border)",
                borderRadius: "var(--colour-card-radius)",
                padding: "16px 12px",
                transition: "background-color 0.15s",
                cursor: "pointer",
              }}
            >
              {/* Icon tile */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "var(--colour-active-light)",
                }}
              >
                <span
                  className="font-bold"
                  style={{ color: "var(--colour-active-dark)", fontSize: 16 }}
                >
                  {s.symbol}
                </span>
              </div>

              <h2
                className="mt-3 font-semibold text-foreground"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--font-topic-name-size)",
                  fontWeight: "var(--font-topic-name)",
                }}
              >
                {s.label}
              </h2>
              <p
                className="mt-1 text-muted-foreground"
                style={{
                  fontSize: "var(--font-description-size)",
                  lineHeight: "var(--font-description-lh)",
                  fontWeight: "var(--font-description-weight)",
                }}
              >
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionStrategies;
