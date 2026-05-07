import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PALETTE = ["#4A90D9", "#E8934A", "#6BBF8A", "#D96A6A", "#9B6BBF", "#4ABFBF"];

interface Profile {
  name: string;
  yearLevel: number;
  colour: string;
}

const getProfiles = (): Profile[] => {
  try {
    const raw = localStorage.getItem("profiles");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveProfiles = (profiles: Profile[]) => {
  localStorage.setItem("profiles", JSON.stringify(profiles));
};

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>(getProfiles);
  const [showSetup, setShowSetup] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState<number>(2);
  const navigate = useNavigate();

  const hasProfiles = profiles.length > 0;

  const handleAddProfile = (profile: Profile) => {
    const updated = [...profiles, profile];
    saveProfiles(updated);
    setProfiles(updated);
    setShowSetup(false);
  };

  const handleSelectProfile = (profile: Profile, index: number) => {
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

  const handleSaveEdit = () => {
    if (editingIndex === null || !editName.trim()) return;
    const updated = [...profiles];
    updated[editingIndex] = { ...updated[editingIndex], name: editName.trim(), yearLevel: editYear };
    saveProfiles(updated);
    setProfiles(updated);
    setEditingIndex(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditYear(2);
  };

  if (showSetup || !hasProfiles) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6">
        {!hasProfiles && !showSetup ? (
          <div className="text-center space-y-4">
            <h1
              className="text-3xl font-bold text-foreground sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's set up your first child's profile.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="mt-6 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <h1
          className="text-center text-3xl font-bold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Who's learning today?
        </h1>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {profiles.map((profile, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => handleSelectProfile(profile, i)}
                className="group flex w-36 flex-col items-center gap-3 p-4 transition-colors hover:bg-[var(--colour-card-hover-inactive)] active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--colour-card-bg)",
                  border: "0.5px solid hsl(var(--colour-card-border))",
                  borderRadius: "var(--colour-card-radius)",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
                  style={{ backgroundColor: profile.colour }}
                >
                  {(editingIndex === i ? editName : profile.name).charAt(0).toUpperCase()}
                </div>
                <div className="text-center w-full">
                  {editingIndex === i ? (
                    <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        autoFocus
                        className="w-full rounded-lg border border-border bg-background px-2 py-1 text-center text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <select
                        value={editYear}
                        onChange={(e) => setEditYear(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1 text-center text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {YEAR_LEVELS.map((yr) => (
                          <option key={yr.value} value={yr.value}>{yr.label}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        {profile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Year {profile.yearLevel}</p>
                    </>
                  )}
                </div>
              </button>
              {editingIndex !== i && (
                <button
                  onClick={(e) => handleStartEdit(e, i)}
                  className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit name"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowSetup(true)}
            className="rounded-xl border-2 border-border px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            Add a child
          </button>
        </div>
      </div>
    </div>
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
  onSave: (profile: Profile) => void;
  onCancel?: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [yearMessage, setYearMessage] = useState("");

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

  const doSave = () => {
    if (!name.trim() || yearLevel === null) return;
    onSave({ name: name.trim(), yearLevel, colour });
  };

  const handleStartLearning = () => {
    doSave();
  };

  const handleAddAnother = () => {
    doSave();
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
          className="rounded-xl bg-primary px-10 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start learning
        </button>
        <button
          onClick={handleAddAnother}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Add another child
        </button>
      </div>
    </div>
  );
};

export default Index;
