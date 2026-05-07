import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Profile {
  name: string;
  yearLevel: number;
  colour: string;
}

const getSelectedProfile = (): Profile | null => {
  try {
    const profiles: Profile[] = JSON.parse(localStorage.getItem("profiles") || "[]");
    const idx = Number(localStorage.getItem("selectedProfileIndex") || "0");
    return profiles[idx] || null;
  } catch {
    return null;
  }
};

const ContentHome = () => {
  const navigate = useNavigate();
  const profile = getSelectedProfile();
  const [literacyTapped, setLiteracyTapped] = useState(false);

  if (!profile) {
    navigate("/");
    return null;
  }

  const isYear2 = profile.yearLevel === 2;
  const yearLabel = profile.yearLevel === 0 ? "Kindy" : `Year ${profile.yearLevel}`;

  const cardBase: React.CSSProperties = {
    backgroundColor: "var(--colour-card-bg)",
    borderRadius: "var(--colour-card-radius)",
    padding: "16px 12px",
    transition: "background-color 0.15s",
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Profile avatar — top right */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/")}
            title="Switch profile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: profile.colour }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </button>
        </div>

        {/* Greeting */}
        <h1
          className="mt-2 text-center text-3xl font-bold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Hi {profile.name}!
        </h1>

        {isYear2 ? (
          <p className="mt-3 text-center text-lg text-muted-foreground">
            What would you like to work on today?
          </p>
        ) : (
          <p className="mt-3 text-center text-lg text-muted-foreground leading-relaxed">
            We're building {yearLabel} content now.
            <br />
            We'll have it ready soon.
          </p>
        )}

        {/* Subject cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {/* Maths */}
          {isYear2 ? (
            <Link
              to="/student"
              className="group flex flex-col items-center justify-center p-10 text-center hover:bg-[#f8fdfb]"
              style={{
                ...cardBase,
                border: `0.5px solid var(--colour-active-border)`,
                padding: "40px 12px",
                cursor: "pointer",
              }}
            >
              <span className="text-4xl">🔢</span>
              <h2
                className="mt-4 text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--colour-active-dark)" }}
              >
                Maths
              </h2>
            </Link>
          ) : (
            <div
              className="flex flex-col items-center justify-center p-10 text-center opacity-60"
              style={{
                ...cardBase,
                border: `0.5px solid hsl(var(--colour-coming-soon-border))`,
                padding: "40px 12px",
              }}
            >
              <span className="text-4xl grayscale">🔢</span>
              <h2
                className="mt-4 text-2xl font-bold text-muted-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Maths
              </h2>
              <span style={{ fontSize: "var(--font-badge-size)", fontWeight: "var(--font-badge-weight)", marginTop: 8, backgroundColor: "hsl(var(--colour-coming-soon-bg))", color: "hsl(var(--colour-coming-soon-text))", borderRadius: 6, padding: "2px 6px" }}>
                Coming soon
              </span>
            </div>
          )}

          {/* Literacy */}
          <button
            onClick={() => setLiteracyTapped(true)}
            className="flex flex-col items-center justify-center p-10 text-center opacity-60 hover:bg-[#fafafa]"
            style={{
              ...cardBase,
              border: `0.5px solid hsl(var(--colour-coming-soon-border))`,
              padding: "40px 12px",
              cursor: "default",
            }}
          >
            <span className="text-4xl grayscale">📖</span>
            <h2
              className="mt-4 text-2xl font-bold text-muted-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Literacy
            </h2>
            <span style={{ fontSize: "var(--font-badge-size)", fontWeight: "var(--font-badge-weight)", marginTop: 8, backgroundColor: "hsl(var(--colour-coming-soon-bg))", color: "hsl(var(--colour-coming-soon-text))", borderRadius: 6, padding: "2px 6px" }}>
              Coming soon
            </span>
          </button>
        </div>

        {/* Literacy tapped message */}
        {literacyTapped && (
          <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
            We're building this now — check back soon!
          </p>
        )}

        {/* Year level display */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {yearLabel} content
        </p>
      </div>
    </div>
  );
};

export default ContentHome;
