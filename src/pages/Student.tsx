import { Link } from "react-router-dom";

const topics = [
  {
    label: "Addition",
    description: "Learn and practise strategies for adding numbers together.",
    to: "/student/addition",
  },
  {
    label: "Subtraction",
    description: "Learn and practise strategies for taking numbers away.",
    to: "/student/subtraction",
  },
];

const Student = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="mt-8 text-center">
          <h1
            className="text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What are you learning?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Pick a topic to get started.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.label}
              to={topic.to}
              className="group rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
            >
              <h2
                className="text-xl font-bold text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {topic.label}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Student;
