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
              className="group rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
            >
              <h2
                className="text-xl font-bold text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.label}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
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
