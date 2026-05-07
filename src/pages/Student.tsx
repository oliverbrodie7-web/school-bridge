import { useState } from "react";
import { Link } from "react-router-dom";

interface TopicCard {
  name: string;
  description: string;
  active: boolean;
  to?: string;
  symbol: string;
  iconId: string;
}

const topics: TopicCard[] = [
  { name: "Addition", description: "Adding numbers together using smart strategies", active: true, to: "/student/addition", symbol: "+", iconId: "topic-icon-addition" },
  { name: "Subtraction", description: "Taking numbers away and finding the difference", active: false, symbol: "−", iconId: "topic-icon-subtraction" },
  { name: "Multiplication", description: "Building equal groups to find totals", active: false, symbol: "×", iconId: "topic-icon-multiplication" },
  { name: "Sharing", description: "Splitting things into equal groups", active: false, symbol: "÷", iconId: "topic-icon-sharing" },
  { name: "Fractions", description: "Understanding equal parts of a whole", active: false, symbol: "½", iconId: "topic-icon-fractions" },
  { name: "Decimals", description: "Numbers that sit between whole numbers", active: false, symbol: "0.1", iconId: "topic-icon-decimals" },
  { name: "Measurement", description: "Length, mass, volume and time", active: false, symbol: "cm", iconId: "topic-icon-measurement" },
  { name: "Times Tables", description: "Practising multiplication facts until they stick", active: false, symbol: "×", iconId: "topic-icon-times-tables" },
];

const Student = () => {
  const [tappedTopic, setTappedTopic] = useState<string | null>(null);

  const renderCard = (topic: TopicCard) => {
    const isActive = topic.active && topic.to;

    const iconTile = (
      <div
        id={topic.iconId}
        className="flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: isActive ? "var(--colour-active-light)" : "hsl(var(--colour-coming-soon-bg))",
          color: isActive ? "var(--colour-active-dark)" : "hsl(var(--colour-coming-soon-text))",
          fontSize: topic.symbol.length > 1 ? 14 : 20,
          fontWeight: 600,
        }}
      >
        {topic.symbol}
      </div>
    );

    const content = (
      <>
        {iconTile}
        <span style={{ fontSize: "var(--font-topic-name-size)", fontWeight: "var(--font-topic-name)", marginTop: 10, color: isActive ? "hsl(var(--foreground))" : "hsl(var(--colour-coming-soon-text))" }}>
          {topic.name}
        </span>
        <span style={{ fontSize: "var(--font-description-size)", lineHeight: "var(--font-description-lh)", fontWeight: "var(--font-description-weight)", marginTop: 4, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
          {topic.description}
        </span>
        {!isActive && (
          <span style={{ fontSize: "var(--font-badge-size)", fontWeight: "var(--font-badge-weight)", marginTop: 8, backgroundColor: "hsl(var(--colour-coming-soon-bg))", color: "hsl(var(--colour-coming-soon-text))", borderRadius: 6, padding: "2px 6px" }}>
            Coming soon
          </span>
        )}
        {!isActive && tappedTopic === topic.name && (
          <span className="animate-fade-in" style={{ fontSize: "var(--font-description-size)", marginTop: 6, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            We're building this now — check back soon!
          </span>
        )}
      </>
    );

    const cardStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px 12px",
      borderRadius: "var(--colour-card-radius)",
      border: isActive ? `0.5px solid var(--colour-active-border)` : `0.5px solid hsl(var(--colour-card-border))`,
      backgroundColor: "var(--colour-card-bg)",
      textDecoration: "none",
      transition: "background-color 0.15s",
      cursor: "pointer",
    };

    if (isActive) {
      return (
        <Link
          key={topic.name}
          to={topic.to!}
          className="hover:bg-[#f8fdfb]"
          style={cardStyle}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={topic.name}
        onClick={() => setTappedTopic(tappedTopic === topic.name ? null : topic.name)}
        className="hover:bg-[#fafafa]"
        style={{ ...cardStyle, cursor: "default" }}
      >
        {content}
      </button>
    );
  };

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

        <div className="mt-10 grid gap-[10px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default Student;
