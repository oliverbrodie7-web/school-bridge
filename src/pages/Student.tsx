import { useState } from "react";
import { Link } from "react-router-dom";
import MenuCard from "@/components/MenuCard";

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
  { name: "Fractions", description: "Understanding equal parts of a whole", active: true, to: "/student/fractions", symbol: "½", iconId: "topic-icon-fractions" },
  { name: "Decimals", description: "Numbers that sit between whole numbers", active: false, symbol: "0.1", iconId: "topic-icon-decimals" },
  { name: "Measurement", description: "Length, mass, volume and time", active: false, symbol: "cm", iconId: "topic-icon-measurement" },
  { name: "Times Tables", description: "Practising multiplication facts until they stick", active: false, symbol: "×", iconId: "topic-icon-times-tables" },
];

const Student = () => {
  const [tappedTopic, setTappedTopic] = useState<string | null>(null);

  // Track index for stagger delay across active cards only
  let activeIndex = -1;

  const renderCard = (topic: TopicCard) => {
    const isActive = Boolean(topic.active && topic.to);
    if (isActive) activeIndex += 1;
    const delayMs = isActive ? activeIndex * 80 : 0;

    const iconTile = (
      <div
        id={topic.iconId}
        className="flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: isActive ? "#F0EBE1" : "var(--colour-border)",
          color: isActive ? "var(--colour-heading)" : "var(--colour-muted)",
          fontSize: topic.symbol.length > 1 ? 14 : 20,
          fontWeight: 700,
        }}
      >
        {topic.symbol}
      </div>
    );

    const content = (
      <>
        {iconTile}
        <span
          style={{
            fontSize: "var(--font-size-body)",
            fontWeight: isActive ? "var(--font-weight-heading)" : "var(--font-weight-label)",
            marginTop: 10,
            color: isActive ? "var(--colour-heading)" : "var(--colour-muted)",
            fontFamily: "var(--font-family)",
          }}
        >
          {topic.name}
        </span>
        <span
          style={{
            fontSize: "var(--font-size-small)",
            lineHeight: 1.4,
            fontWeight: "var(--font-weight-body)",
            marginTop: 4,
            color: isActive ? "var(--colour-subheading)" : "var(--colour-muted)",
            textAlign: "center",
            fontFamily: "var(--font-family)",
          }}
        >
          {topic.description}
        </span>
        {!isActive && (
          <span
            style={{
              fontSize: "var(--font-size-pill)",
              fontWeight: "var(--font-weight-label)",
              marginTop: 8,
              backgroundColor: "var(--colour-pill-bg)",
              color: "var(--colour-pill-text)",
              border: "1px solid var(--colour-pill-border)",
              borderRadius: "var(--border-radius-pill)",
              padding: "2px 10px",
            }}
          >
            Coming soon
          </span>
        )}
        {!isActive && tappedTopic === topic.name && (
          <span
            className="animate-fade-in"
            style={{
              fontSize: "var(--font-size-small)",
              marginTop: 6,
              color: "var(--colour-muted)",
              textAlign: "center",
            }}
          >
            We're building this now — check back soon!
          </span>
        )}
      </>
    );

    return (
      <MenuCard
        key={topic.name}
        to={isActive ? topic.to : undefined}
        active={isActive}
        delayMs={delayMs}
        onClick={
          isActive
            ? undefined
            : () => setTappedTopic(tappedTopic === topic.name ? null : topic.name)
        }
      >
        {content}
      </MenuCard>
    );
  };

  return (
    <div
      className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-12"
      style={{ backgroundColor: "var(--colour-page-bg)" }}
    >
      <div className="w-full max-w-4xl">
        <Link
          to="/home"
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
            Year 2 Maths
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
