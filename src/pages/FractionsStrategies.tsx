import { Link } from "react-router-dom";

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
    <>
      <style>{`
        @keyframes fracBounceIn {
          0%   { opacity: 0; transform: scale(0.6) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .frac-card {
          background: #ffffff;
          border: 2px solid #1A1A1A;
          border-radius: 22px;
          padding: 24px 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 200ms ease, box-shadow 200ms ease;
          animation: fracBounceIn 500ms cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: 0ms;
        }
        .frac-card:hover {
          transform: scale(1.04) translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.10);
        }
        .frac-card:active {
          transform: scale(0.95);
          transition: transform 100ms ease;
        }
        .frac-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: #FFF3E0;
          display: flex; align-items: center; justify-content: center;
        }
        .frac-icon span {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #1A1A1A;
        }
        .frac-name {
          margin-top: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #1A1A1A;
        }
        .frac-desc {
          margin-top: 4px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #666666;
          line-height: 1.4;
        }
      `}</style>

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
                <Link key={s.label} to={s.to} className={`${s.className} frac-card`}>
                  <div className="frac-icon">
                    <span>{s.symbol}</span>
                  </div>
                  <h2 className="frac-name">{s.label}</h2>
                  <p className="frac-desc">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FractionsStrategies;
