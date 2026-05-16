import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile, fetchProfiles, migrateLocalProfilesIfNeeded } from "@/lib/profiles";
import MenuCard from "@/components/MenuCard";

const ContentHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [literacyTapped, setLiteracyTapped] = useState(false);

  useEffect(() => {
    (async () => {
      await migrateLocalProfilesIfNeeded();
      try {
        const profiles = await fetchProfiles();
        const idx = Number(localStorage.getItem("selectedProfileIndex") || "0");
        setProfile(profiles[idx] || null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div
        className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center"
        style={{ backgroundColor: "var(--colour-page-bg)" }}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!profile) {
    navigate("/");
    return null;
  }

  const isYear2 = profile.yearLevel === 2;
  const yearLabel = profile.yearLevel === 0 ? "Kindy" : `Year ${profile.yearLevel}`;

  const selectedProfileIndex = Number(localStorage.getItem("selectedProfileIndex") || "0");
  const avatarColourVar = `var(--colour-avatar-${selectedProfileIndex % 6})`;

  return (
    <>
      <style>{`
        .icon-tile {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
      `}</style>

      <div
        className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-12"
        style={{ backgroundColor: "var(--colour-page-bg)" }}
      >
        <div className="w-full max-w-2xl">
          {/* Profile avatar — top right */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/")}
              title="Switch profile"
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{
                backgroundColor: avatarColourVar,
                border: "none",
                boxShadow: "var(--shadow-avatar)",
                fontFamily: "var(--font-family)",
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </button>
          </div>

          {/* Greeting */}
          <h1
            className="mt-2 text-center"
            style={{
              fontFamily: "var(--font-family)",
              fontSize: "var(--font-size-heading-xl)",
              fontWeight: "var(--font-weight-heading)",
              color: "var(--colour-heading)",
            }}
          >
            Hi {profile.name}!
          </h1>

          {isYear2 ? (
            <p
              className="mt-3 text-center"
              style={{
                fontSize: "var(--font-size-subheading)",
                fontWeight: "var(--font-weight-body)",
                color: "var(--colour-subheading)",
              }}
            >
              What would you like to work on today?
            </p>
          ) : (
            <p
              className="mt-3 text-center leading-relaxed"
              style={{
                fontSize: "var(--font-size-subheading)",
                fontWeight: "var(--font-weight-body)",
                color: "var(--colour-subheading)",
              }}
            >
              We're building {yearLabel} content now.
              <br />
              We'll have it ready soon.
            </p>
          )}

          {/* Subject cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {/* Maths */}
            {isYear2 ? (
              <MenuCard
                to="/student"
                delayMs={0}
                style={{ justifyContent: "center", textAlign: "center" }}
              >
                <div className="icon-tile" style={{ backgroundColor: "#F0EBE1" }}>
                  <span>🔢</span>
                </div>
                <h2
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "var(--font-size-heading-lg)",
                    fontWeight: "var(--font-weight-heading)",
                    color: "var(--colour-heading)",
                  }}
                >
                  Maths
                </h2>
              </MenuCard>
            ) : (
              <MenuCard active={false} delayMs={0} style={{ justifyContent: "center", textAlign: "center" }}>
                <div className="icon-tile" style={{ backgroundColor: "var(--colour-card-bg-muted)" }}>
                  <span className="grayscale">🔢</span>
                </div>
                <h2
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "var(--font-size-heading-lg)",
                    fontWeight: "var(--font-weight-heading)",
                    color: "var(--colour-muted)",
                  }}
                >
                  Maths
                </h2>
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
              </MenuCard>
            )}

            {/* Literacy — coming soon, tap to reveal message */}
            <MenuCard
              active={false}
              onClick={() => setLiteracyTapped(true)}
              delayMs={100}
              style={{ justifyContent: "center", textAlign: "center" }}
            >
              <div className="icon-tile" style={{ backgroundColor: "var(--colour-card-bg-muted)" }}>
                <span className="grayscale">📖</span>
              </div>
              <h2
                className="mt-4"
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize: "var(--font-size-heading-lg)",
                  fontWeight: "var(--font-weight-heading)",
                  color: "var(--colour-muted)",
                }}
              >
                Literacy
              </h2>
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
            </MenuCard>
          </div>

          {/* Literacy tapped message */}
          {literacyTapped && (
            <p
              className="mt-4 text-center animate-fade-in"
              style={{
                fontSize: "var(--font-size-label)",
                color: "var(--colour-muted)",
              }}
            >
              We're building this now — check back soon!
            </p>
          )}

          {/* Year level display */}
          <p
            className="mt-8 text-center"
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--colour-muted)",
            }}
          >
            {yearLabel} content
          </p>
        </div>
      </div>
    </>
  );
};

export default ContentHome;
