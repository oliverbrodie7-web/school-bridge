import { Link } from "react-router-dom";
import MenuCard from "@/components/MenuCard";

const strategies = [
  {
    className: "strategy-card-halves-quarters-eighths",
    label: "Halves, Quarters & Eighths",
    symbol: "½",
    description: "Split shapes and numbers into equal parts",
    to: "/halves-quarters-eighths",
  },
];

const FractionsStrategies = () => {
  return (
    <div style={{ backgroundColor: "#FFF8EC", minHeight: "100vh" }}>
      <div className="flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <Link
            to="/student"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#999999",
              fontFamily: "'Nunito', sans-serif",
              textDecoration: "none",
            }}
          >
            ← Back
          </Link>

          <div className="mt-8 text-center">
            <h1
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#1A1A1A",
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Fractions
            </h1>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "#666666",
                textAlign: "center",
              }}
            >
              Choose a strategy to learn or practise
            </p>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {strategies.map((s) => (
              <MenuCard
                key={s.label}
                to={s.to}
                delayMs={0}
                className={s.className}
                style={{ textAlign: "center" }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#FFF3E0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 800,
                      fontSize: 20,
                      color: "#1A1A1A",
                    }}
                  >
                    {s.symbol}
                  </span>
                </div>
                <h2
                  style={{
                    marginTop: 12,
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1A1A1A",
                  }}
                >
                  {s.label}
                </h2>
                <p
                  style={{
                    marginTop: 4,
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#666666",
                    lineHeight: 1.4,
                  }}
                >
                  {s.description}
                </p>
              </MenuCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionsStrategies;
