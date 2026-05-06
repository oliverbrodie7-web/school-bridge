import { Link } from "react-router-dom";

const SubtractionStrategies = () => {
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
            Subtraction
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Strategies coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubtractionStrategies;
