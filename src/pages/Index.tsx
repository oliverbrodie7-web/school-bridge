import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Profile,
  fetchProfiles,
  insertProfile,
  updateProfile,
  migrateLocalProfilesIfNeeded,
} from "@/lib/profiles";

const PALETTE = ["#4A90D9", "#E8934A", "#6BBF8A", "#D96A6A", "#9B6BBF", "#4ABFBF"];

const QUOTES = [
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Do not be embarrassed by your failures, learn from them and start again.", author: "Richard Branson" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Children must be taught how to think, not what to think.", author: "Margaret Mead" },
  { text: "It is easier to build strong children than to repair broken adults.", author: "Frederick Douglass" },
  { text: "What we learn with pleasure we never forget.", author: "Alfred Mercier" },
  { text: "The whole purpose of education is to turn mirrors into windows.", author: "Sydney J. Harris" },
  { text: "A child who reads will be an adult who thinks.", author: "Unknown" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await migrateLocalProfilesIfNeeded();
      const { migrateLocalProgressIfNeeded } = await import("@/lib/progress");
      await migrateLocalProgressIfNeeded();
      try {
        const data = await fetchProfiles();
        setProfiles(data);
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasProfiles = profiles.length > 0;

  const handleAddProfile = async (profile: Omit<Profile, "id">) => {
    try {
      const created = await insertProfile(profile);
      setProfiles((prev) => [...prev, created]);
      setShowSetup(false);
    } catch {
      // silent — could add toast later
    }
  };

  const handleSelectProfile = (_profile: Profile, index: number) => {
    if (editingIndex !== null) return;
    localStorage.setItem("selectedProfileIndex", String(index));
    navigate("/home");
  };

  const handleStartEdit = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditName(profiles[index].name);
    setEditYear(profiles[index].yearLevel);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editName.trim()) return;
    const target = profiles[editingIndex];
    const newName = editName.trim();
    const newYear = editYear;
    try {
      await updateProfile(target.id, { name: newName, yearLevel: newYear });
      setProfiles((prev) =>
        prev.map((p, i) => (i === editingIndex ? { ...p, name: newName, yearLevel: newYear } : p))
      );
    } catch {
      // silent
    }
    setEditingIndex(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditYear(2);
  };

  const NUNITO = "'Nunito', sans-serif";
  const PAGE_BG = "linear-gradient(135deg, #E8EFFE 0%, #EDE9F6 100%)";

  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #5B7FE8, #7B6FD0)",
    "linear-gradient(135deg, #E87B5B, #D06F9B)",
    "linear-gradient(135deg, #5BB8E8, #5BE8B0)",
    "linear-gradient(135deg, #E8C45B, #E87B5B)",
    "linear-gradient(135deg, #7BE87B, #5BB8E8)",
    "linear-gradient(135deg, #D06F9B, #7B6FD0)",
  ];

  const PILL_STYLES: { bg: string; color: string; border: string }[] = [
    { bg: "#E8EFFE", color: "#3355CC", border: "rgba(91,127,232,0.3)" },
    { bg: "#FEE8E8", color: "#CC3355", border: "rgba(232,91,91,0.3)" },
    { bg: "#E8F7FE", color: "#1A7FAA", border: "rgba(91,183,232,0.3)" },
    { bg: "#FEF8E8", color: "#AA7A1A", border: "rgba(232,196,91,0.3)" },
    { bg: "#E8FEE8", color: "#1AAA55", border: "rgba(91,232,123,0.3)" },
    { bg: "#FEE8F5", color: "#AA1A7A", border: "rgba(208,111,155,0.3)" },
  ];

  if (loading) {
    return (
      <div
        className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center"
        style={{ background: PAGE_BG, fontFamily: NUNITO }}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-[#5B7FE8]" />
      </div>
    );
  }

  if (showSetup || !hasProfiles) {
    return (
      <div
        className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6"
        style={{ background: PAGE_BG, fontFamily: NUNITO }}
      >
        {!hasProfiles && !showSetup ? (
          <div className="text-center" style={{ fontFamily: NUNITO }}>
            <h1
              style={{
                fontFamily: NUNITO,
                fontSize: 32,
                fontWeight: 800,
                color: "#1A1A2E",
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              Welcome 👋
            </h1>
            <p style={{ fontFamily: NUNITO, fontSize: 15, fontWeight: 500, color: "#5B7FE8", marginBottom: 28 }}>
              Let's set up your first child's profile.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              style={{
                fontFamily: NUNITO,
                background: "linear-gradient(135deg, #5B7FE8, #7B6FD0)",
                border: "none",
                borderRadius: 14,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 800,
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(91,127,232,0.3)",
                transition: "all 200ms ease",
              }}
            >
              Get started
            </button>
          </div>
        ) : (
          <ProfileSetup
            colourIndex={profiles.length}
            onSave={handleAddProfile}
            onCancel={hasProfiles ? () => setShowSetup(false) : undefined}
          />
        )}
      </div>
    );
  }

  const quote = getDailyQuote();

  return (
    <>
      <style>{`
        @keyframes profileArrive {
          from { opacity: 0; transform: scale(0.7) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .profile-card-anim {
          opacity: 0;
          animation: profileArrive 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .profile-card-anim:hover .profile-edit-icon { opacity: 1; }
        .profile-card-anim:hover {
          border-color: rgba(91,127,232,0.5) !important;
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 8px 24px rgba(91,127,232,0.15);
        }
        .add-child-card:hover {
          background: rgba(232,239,254,0.8) !important;
          border-color: rgba(91,127,232,0.5) !important;
        }
      `}</style>
      <div
        className="flex flex-col items-center px-7"
        style={{
          background: PAGE_BG,
          minHeight: "calc(100vh - 3.5rem)",
          fontFamily: NUNITO,
          padding: "40px 28px 32px",
        }}
      >
        <div className="w-full max-w-3xl">
          <h1
            style={{
              fontFamily: NUNITO,
              fontSize: 28,
              fontWeight: 800,
              color: "#1A1A2E",
              textAlign: "center",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Who's learning today? 👋
          </h1>
          <p
            style={{
              fontFamily: NUNITO,
              fontSize: 14,
              fontWeight: 500,
              color: "#5B7FE8",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Tap your name to get started
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {profiles.map((profile, i) => {
              const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
              const pill = PILL_STYLES[i % PILL_STYLES.length];
              const isEditing = editingIndex === i;
              return (
                <div
                  key={profile.id ?? i}
                  className="profile-card-anim"
                  onClick={() => !isEditing && handleSelectProfile(profile, i)}
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1.5px solid rgba(91,127,232,0.25)",
                    borderRadius: 20,
                    padding: "22px 14px",
                    width: 130,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    position: "relative",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    transition: "all 200ms ease",
                    animationDelay: `${i * 100}ms`,
                    fontFamily: NUNITO,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditing) handleCancelEdit();
                      else handleStartEdit(e, i);
                    }}
                    className="profile-edit-icon"
                    title={isEditing ? "Close" : "Edit"}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: 12,
                      color: "#7B6FD0",
                      opacity: isEditing ? 1 : 0,
                      transition: "opacity 200ms",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: NUNITO,
                      fontWeight: 700,
                    }}
                  >
                    {isEditing ? "✕" : "✎"}
                  </button>

                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: NUNITO,
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    {(isEditing ? editName : profile.name).charAt(0).toUpperCase()}
                  </div>

                  {isEditing ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}
                    >
                      <input
                        type="text"
                        value={editName}
                        autoFocus
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        style={{
                          fontFamily: NUNITO,
                          fontSize: 12,
                          padding: "5px 8px",
                          border: "1px solid rgba(91,127,232,0.3)",
                          borderRadius: 8,
                          textAlign: "center",
                          color: "#1A1A2E",
                          outline: "none",
                          background: "#fff",
                        }}
                      />
                      <select
                        value={editYear}
                        onChange={(e) => setEditYear(Number(e.target.value))}
                        style={{
                          fontFamily: NUNITO,
                          fontSize: 12,
                          padding: "5px 8px",
                          border: "1px solid rgba(91,127,232,0.3)",
                          borderRadius: 8,
                          textAlign: "center",
                          color: "#1A1A2E",
                          background: "#fff",
                          outline: "none",
                        }}
                      >
                        {YEAR_LEVELS.map((yr) => (
                          <option key={yr.value} value={yr.value}>
                            {yr.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleSaveEdit}
                        style={{
                          fontFamily: NUNITO,
                          background: "linear-gradient(135deg, #5B7FE8, #7B6FD0)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "5px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <p
                        style={{
                          fontFamily: NUNITO,
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1A1A2E",
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        {profile.name}
                      </p>
                      <span
                        style={{
                          fontFamily: NUNITO,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 99,
                          padding: "3px 10px",
                          background: pill.bg,
                          color: pill.color,
                          border: `1px solid ${pill.border}`,
                        }}
                      >
                        {profile.yearLevel === 0 ? "Kindy" : `Year ${profile.yearLevel}`}
                      </span>
                    </>
                  )}
                </div>
              );
            })}

            <div
              className="add-child-card profile-card-anim"
              onClick={() => setShowSetup(true)}
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "2px dashed rgba(91,127,232,0.3)",
                borderRadius: 20,
                padding: "22px 14px",
                width: 130,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                transition: "all 200ms ease",
                animationDelay: `${profiles.length * 100}ms`,
                fontFamily: NUNITO,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(232,239,254,0.8)",
                  border: "2px dashed rgba(91,127,232,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  color: "#5B7FE8",
                  fontFamily: NUNITO,
                  fontWeight: 700,
                }}
              >
                +
              </div>
              <span
                style={{
                  fontFamily: NUNITO,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#5B7FE8",
                  textAlign: "center",
                }}
              >
                + Add a child
              </span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(91,127,232,0.15)",
              borderRadius: 16,
              padding: "16px 24px",
              textAlign: "center",
              maxWidth: 440,
              margin: "0 auto 20px",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <p
              style={{
                fontFamily: NUNITO,
                fontSize: 14,
                fontStyle: "italic",
                color: "#3A3A5C",
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {quote.text}
            </p>
            <p
              style={{
                fontFamily: NUNITO,
                fontSize: 11,
                fontWeight: 800,
                color: "#5B7FE8",
                marginTop: 6,
                letterSpacing: "0.02em",
                marginBottom: 0,
              }}
            >
              {quote.author}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              to="/parent"
              style={{
                fontFamily: NUNITO,
                fontSize: 12,
                fontWeight: 600,
                color: "#7B6FD0",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              Are you a parent? Parent Guide →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Profile Setup Flow ─── */

const YEAR_LEVELS = [
  { label: "Kindy", value: 0 },
  { label: "Year 1", value: 1 },
  { label: "Year 2", value: 2 },
  { label: "Year 3", value: 3 },
  { label: "Year 4", value: 4 },
  { label: "Year 5", value: 5 },
  { label: "Year 6", value: 6 },
  { label: "Year 7", value: 7 },
  { label: "Year 8", value: 8 },
  { label: "Year 9", value: 9 },
  { label: "Year 10", value: 10 },
];

const ProfileSetup = ({
  colourIndex,
  onSave,
  onCancel,
}: {
  colourIndex: number;
  onSave: (profile: Omit<Profile, "id">) => void;
  onCancel?: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [yearMessage, setYearMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const colour = PALETTE[colourIndex % PALETTE.length];

  const handleNext1 = () => {
    if (!name.trim()) {
      setNameError("Please enter your child's name to continue.");
      return;
    }
    setNameError("");
    setStep(2);
  };

  const handleNext2 = () => {
    if (yearLevel === null) return;
    setStep(3);
  };

  const handleSelectYear = (val: number) => {
    setYearLevel(val);
    const lvl = YEAR_LEVELS.find((y) => y.value === val);
    if (val !== 2 && lvl) {
      setYearMessage(
        `We're building content for ${lvl.label} now. You can still create this profile and we'll have content ready soon.`
      );
    } else {
      setYearMessage("");
    }
  };

  const yearLabel = yearLevel !== null ? YEAR_LEVELS.find((y) => y.value === yearLevel)?.label : "";

  const doSave = async () => {
    if (submitting) return;
    if (!name.trim() || yearLevel === null) return;
    setSubmitting(true);
    try {
      await onSave({ name: name.trim(), yearLevel, colour });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartLearning = () => {
    doSave();
  };

  const handleAddAnother = async () => {
    await doSave();
    setName("");
    setYearLevel(null);
    setYearMessage("");
    setNameError("");
    setStep(1);
  };

  // Step 1 — Name
  if (step === 1) {
    return (
      <div className="w-full max-w-md">
        {onCancel && (
          <button
            onClick={onCancel}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        )}
        <h2
          className="text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What's your child's first name?
        </h2>

        <div className="mt-8">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="First name"
            autoFocus
            className="w-full rounded-xl border border-border bg-background px-5 py-4 text-lg text-center text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {nameError && (
            <p className="mt-3 text-center text-sm text-destructive animate-fade-in">
              {nameError}
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext1}
            className="rounded-xl bg-primary px-10 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Year level
  if (step === 2) {
    return (
      <div className="w-full max-w-lg">
        <button
          onClick={() => setStep(1)}
          className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <h2
          className="text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What year level is {name.trim()} in?
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {YEAR_LEVELS.map((yr) => {
            const isActive = yr.value === 2;
            const isSelected = yearLevel === yr.value;
            return (
              <button
                key={yr.value}
                type="button"
                onClick={() => handleSelectYear(yr.value)}
                className={`relative flex flex-col items-center justify-center rounded-xl px-3 py-4 text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : isActive
                    ? "border border-border text-foreground hover:border-primary hover:bg-accent"
                    : "border border-border text-muted-foreground/60 hover:border-muted-foreground"
                }`}
              >
                <span>{yr.label}</span>
                {!isActive && (
                  <span className="mt-1 text-[10px] font-normal opacity-70">Coming soon</span>
                )}
              </button>
            );
          })}
        </div>

        {yearMessage && (
          <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
            {yearMessage}
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleNext2}
            disabled={yearLevel === null}
            className="rounded-xl bg-primary px-10 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Step 3 — Confirmation
  return (
    <div className="w-full max-w-md text-center">
      <h2
        className="text-3xl font-bold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        All set!
      </h2>

      <div
        className="mt-8 mx-auto inline-flex flex-col items-center gap-3 p-4"
        style={{
          backgroundColor: "var(--colour-card-bg)",
          border: "0.5px solid hsl(var(--colour-card-border))",
          borderRadius: "var(--colour-card-radius)",
        }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
          style={{ backgroundColor: colour }}
        >
          {name.trim().charAt(0).toUpperCase()}
        </div>
        <p className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {name.trim()}
        </p>
        <p className="text-base text-muted-foreground">{yearLabel}</p>
      </div>

      <p className="mt-6 text-muted-foreground leading-relaxed">
        You can add more children any time from the home screen.
        <br />
        Each child has their own profile.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleStartLearning}
          disabled={submitting}
          style={submitting ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          className="rounded-xl bg-primary px-10 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start learning
        </button>
        <button
          onClick={handleAddAnother}
          disabled={submitting}
          style={submitting ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Add another child
        </button>
      </div>
    </div>
  );
};

export default Index;
