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
  const navigate = useNavigate();

  const hasProfiles = profiles.length > 0;

  const handleAddProfile = (profile: Profile) => {
    const updated = [...profiles, profile];
    saveProfiles(updated);
    setProfiles(updated);
    setShowSetup(false);
  };

  const handleSelectProfile = (profile: Profile) => {
    // Navigate to the year level content home
    if (profile.yearLevel === 2) {
      navigate("/student");
    } else {
      navigate("/student");
    }
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
            <button
              key={i}
              onClick={() => handleSelectProfile(profile)}
              className="group flex w-36 flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md hover:scale-[1.03] active:scale-[0.98]"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: profile.colour }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {profile.name}
                </p>
                <p className="text-sm text-muted-foreground">Year {profile.yearLevel}</p>
              </div>
            </button>
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

const ProfileSetup = ({
  colourIndex,
  onSave,
  onCancel,
}: {
  colourIndex: number;
  onSave: (profile: Profile) => void;
  onCancel?: () => void;
}) => {
  const [name, setName] = useState("");
  const [yearLevel, setYearLevel] = useState(2);

  const colour = PALETTE[colourIndex % PALETTE.length];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), yearLevel, colour });
  };

  return (
    <div className="w-full max-w-md">
      <h2
        className="text-center text-2xl font-bold text-foreground sm:text-3xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Set up a profile
      </h2>
      <p className="mt-2 text-center text-muted-foreground">
        Tell us about the child who'll be learning.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-foreground">
            First name
          </label>
          <input
            id="childName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma"
            autoFocus
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Year level</label>
          <div className="mt-1.5 flex gap-3">
            {[1, 2, 3, 4, 5, 6].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setYearLevel(yr)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                  yearLevel === yr
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Preview avatar */}
        {name.trim() && (
          <div className="flex justify-center animate-fade-in">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: colour }}
            >
              {name.trim().charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-border px-6 py-3.5 text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Index;
