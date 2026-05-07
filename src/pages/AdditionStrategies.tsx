import { Link } from "react-router-dom";

const strategies = [
  {
    label: "Split Strategy",
    description: "Break numbers into tens and ones to make addition easier.",
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
            Pick a strategy to learn or practise.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {strategies.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="group flex flex-col items-center text-center hover:bg-[#f8fdfb]"
              style={{
                backgroundColor: "var(--colour-card-bg)",
                border: "0.5px solid var(--colour-active-border)",
                borderRadius: "var(--colour-card-radius)",
                padding: "16px 12px",
                transition: "background-color 0.15s",
                cursor: "pointer",
              }}
            >
              <h2
                className="font-semibold text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-topic-name-size)", fontWeight: "var(--font-topic-name)" }}
              >
                {s.label}
              </h2>
              <p
                className="mt-2 text-muted-foreground"
                style={{ fontSize: "var(--font-description-size)", lineHeight: "var(--font-description-lh)", fontWeight: "var(--font-description-weight)" }}
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
