import { useState } from "react";
import { Link } from "react-router-dom";

interface TopicCard {
  name: string;
  description: string;
  active: boolean;
  to?: string;
}

const topics: TopicCard[] = [
  { name: "Addition", description: "Adding numbers together using smart strategies", active: true, to: "/student/addition" },
  { name: "Subtraction", description: "Taking numbers away and finding the difference", active: false },
  { name: "Multiplication", description: "Building equal groups to find totals", active: false },
  { name: "Sharing", description: "Splitting things into equal groups", active: false },
  { name: "Fractions", description: "Understanding equal parts of a whole", active: false },
  { name: "Decimals", description: "Numbers that sit between whole numbers", active: false },
  { name: "Measurement", description: "Length, mass, volume and time", active: false },
  { name: "Times Tables", description: "Practising multiplication facts until they stick", active: false },
];

const Student = () => {
  const [tappedTopic, setTappedTopic] = useState<string | null>(null);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <Link
          to="/home"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="mt-8 text-center">
          <h1
            className="text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Year 2 Maths
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            What would you like to work on?
          </p>
        </div>

        <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) =>
            topic.active && topic.to ? (
              <Link
                key={topic.name}
                to={topic.to}
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center transition-all hover:bg-primary/10 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <h2
                  className="text-xl font-bold text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {topic.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </Link>
            ) : (
              <button
                key={topic.name}
                onClick={() => setTappedTopic(topic.name)}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-muted/50 p-8 text-center opacity-60 transition-all hover:opacity-70 cursor-default"
              >
                <span className="absolute right-3 top-3 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Coming soon
                </span>
                <h2
                  className="text-xl font-bold text-muted-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {topic.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </button>
            )
          )}
        </div>

        {tappedTopic && (
          <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in">
            {tappedTopic} is coming soon. Check back shortly!
          </p>
        )}
      </div>
    </div>
  );
};

export default Student;
