import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CurriculumBadge from "@/components/CurriculumBadge";

const TEAL = "#1D9E75";
const GREY = "#F5F5F5";
const GREY_BORDER = "#D4D4D4";
const LABEL = "#0F6E56";

const AC9M2N03_PROPS = {
  code: "AC9M2N03",
  title: "Halves, quarters and eighths",
  description:
    "Recognise one-half as one of two equal parts; connect halves, quarters and eighths via repeated halving.",
  year: "Year 2",
  strand: "Number",
};

type ShapeKind = "halfSquare" | "quarterCircle" | "eighthSquare";

interface QSpec {
  kind: ShapeKind;
  totalParts: number;
  partName: string; // canonical name
  acceptedNames: string[]; // lowercase variants accepted
  acceptedFraction: string; // e.g. "1/2"
  taps: number; // total taps required for child shape
  computerMessage: string;
  promptMessage: string;
  successMessage: string;
  wrongHint: string;
}

const QUESTIONS: QSpec[] = [
  {
    kind: "halfSquare",
    totalParts: 2,
    partName: "one half",
    acceptedNames: ["one half", "1/2", "a half", "half", "one-half"],
    acceptedFraction: "1/2",
    taps: 1,
    computerMessage:
      "I split the square into 2 equal parts. Each part is one half.",
    promptMessage: "Tap the shape to split it.",
    successMessage:
      "That's right! 2 equal parts means each part is one half.",
    wrongHint:
      "Count the parts carefully — how many sections did the line make?",
  },
  {
    kind: "quarterCircle",
    totalParts: 4,
    partName: "one quarter",
    acceptedNames: ["one quarter", "1/4", "a quarter", "quarter", "one-quarter"],
    acceptedFraction: "1/4",
    taps: 2,
    computerMessage:
      "I halved it twice to make 4 equal parts. Each part is one quarter.",
    promptMessage: "Tap twice to split into quarters.",
    successMessage:
      "That's right! Halving twice makes 4 equal parts — each is one quarter.",
    wrongHint:
      "Remember — we halved it twice. How many parts did we end up with?",
  },
  {
    kind: "eighthSquare",
    totalParts: 8,
    partName: "one eighth",
    acceptedNames: ["one eighth", "1/8", "an eighth", "eighth", "one-eighth"],
    acceptedFraction: "1/8",
    taps: 3,
    computerMessage:
      "I halved it three times to make 8 equal parts. Each part is one eighth.",
    promptMessage: "Tap three times to split into eighths.",
    successMessage:
      "That's right! Halving 3 times makes 8 equal parts — each is one eighth.",
    wrongHint:
      "We halved it 3 times — 2, then 4, then 8. How many parts are there now?",
  },
];

const HalvesQuartersEighthsWeDo = () => {
  const [qIndex, setQIndex] = useState(0);
  const finished = qIndex >= QUESTIONS.length;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/halves-quarters-eighths"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge
              {...AC9M2N03_PROPS}
              pageName="Halves, Quarters & Eighths Learn — We Do"
            />
          </div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Halves, Quarters &amp; Eighths — We Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            This time, the computer goes first. Then it's your turn.
          </p>
        </div>

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Great teamwork! 🎉
            </p>
            <Link
              to="/learn/halves-quarters-eighths/you-do"
              className="inline-block rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              I think you're ready — let's see what you can do!
            </Link>
          </div>
        ) : (
          <QuestionCard
            key={qIndex}
            spec={QUESTIONS[qIndex]}
            qNum={qIndex + 1}
            isLast={qIndex === QUESTIONS.length - 1}
            onNext={() => setQIndex((i) => i + 1)}
          />
        )}
      </div>
      <Keyframes />
    </div>
  );
};

/* ──────────────── QUESTION CARD ──────────────── */
const QuestionCard = ({
  spec,
  qNum,
  isLast,
  onNext,
}: {
  spec: QSpec;
  qNum: number;
  isLast: boolean;
  onNext: () => void;
}) => {
  // Computer demo state: animated taps
  const [computerTaps, setComputerTaps] = useState(0);
  const [computerFilled, setComputerFilled] = useState(false);
  const [computerDone, setComputerDone] = useState(false);

  // Child state
  const [childTaps, setChildTaps] = useState(0);
  const [partsInput, setPartsInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [hint, setHint] = useState("");
  const [childCorrect, setChildCorrect] = useState(false);

  // Animate computer demo
  useEffect(() => {
    if (computerTaps < spec.taps) {
      const t = setTimeout(() => setComputerTaps((n) => n + 1), 800);
      return () => clearTimeout(t);
    }
    if (!computerFilled) {
      const t = setTimeout(() => setComputerFilled(true), 500);
      return () => clearTimeout(t);
    }
    if (!computerDone) {
      const t = setTimeout(() => setComputerDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [computerTaps, computerFilled, computerDone, spec.taps]);

  const childReady = childTaps >= spec.taps;

  const handleChildTap = () => {
    if (childTaps < spec.taps) setChildTaps((n) => n + 1);
  };

  const handleCheck = () => {
    const partsOk = Number(partsInput) === spec.totalParts;
    const nameOk = spec.acceptedNames.includes(
      nameInput.trim().toLowerCase()
    );
    if (partsOk && nameOk) {
      setChildCorrect(true);
      setHint("");
    } else {
      setHint(spec.wrongHint);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Computer card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-center text-lg font-semibold text-foreground">
          <span className="text-muted-foreground">Question {qNum}: </span>
          My turn
        </p>
        <div className="mt-6 flex justify-center">
          <ShapeSVG
            kind={spec.kind}
            taps={computerTaps}
            filled={computerFilled}
          />
        </div>
        {computerDone && (
          <p className="mt-6 text-center text-base text-foreground animate-fade-in">
            {spec.computerMessage}
          </p>
        )}
      </div>

      {/* Child card */}
      {computerDone && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 animate-fade-in">
          <p className="text-center text-lg font-semibold text-foreground">
            Your turn
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleChildTap}
              disabled={childTaps >= spec.taps}
              aria-label="Tap to split the shape"
              className={
                childTaps < spec.taps
                  ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  : "cursor-default"
              }
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <ShapeSVG
                kind={spec.kind}
                taps={childTaps}
                filled={childCorrect}
              />
            </button>
          </div>

          {!childReady && (
            <p className="mt-6 text-center text-lg font-medium text-muted-foreground animate-fade-in">
              {spec.promptMessage}
              {spec.taps > 1 && (
                <span className="block text-sm mt-1">
                  ({childTaps} / {spec.taps} taps)
                </span>
              )}
            </p>
          )}

          {childReady && !childCorrect && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div className="flex flex-col items-center gap-3">
                <label className="text-base text-foreground flex items-center gap-2 flex-wrap justify-center">
                  There are
                  <input
                    type="number"
                    inputMode="numeric"
                    value={partsInput}
                    onChange={(e) => setPartsInput(e.target.value)}
                    placeholder="?"
                    className="h-12 w-20 rounded-xl border-2 text-center text-xl font-bold outline-none transition-colors focus:ring-2"
                    style={{
                      borderColor: TEAL,
                      color: LABEL,
                      backgroundColor: "#E1F5EE",
                    }}
                  />
                  equal parts
                </label>
                <label className="text-base text-foreground flex items-center gap-2 flex-wrap justify-center">
                  Each part is called
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="?"
                    className="h-12 w-40 rounded-xl border-2 px-3 text-center text-lg font-semibold outline-none transition-colors focus:ring-2"
                    style={{
                      borderColor: TEAL,
                      color: LABEL,
                      backgroundColor: "#E1F5EE",
                    }}
                  />
                </label>
              </div>

              {hint && (
                <p className="text-center text-base font-medium text-destructive animate-fade-in">
                  {hint}
                </p>
              )}

              <div className="text-center">
                <button
                  onClick={handleCheck}
                  disabled={!partsInput || !nameInput}
                  className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Check
                </button>
              </div>
            </div>
          )}

          {childCorrect && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div className="flex justify-center gap-6">
                <div
                  className="rounded-xl px-4 py-2 text-lg font-semibold"
                  style={{ backgroundColor: "#E1F5EE", color: LABEL, border: `1px solid ${TEAL}` }}
                >
                  {spec.totalParts}
                </div>
                <div
                  className="rounded-xl px-4 py-2 text-lg font-semibold"
                  style={{ backgroundColor: "#E1F5EE", color: LABEL, border: `1px solid ${TEAL}` }}
                >
                  {spec.partName} ({spec.acceptedFraction})
                </div>
              </div>
              <p className="text-center text-base font-semibold" style={{ color: LABEL }}>
                {spec.successMessage}
              </p>
              <div className="text-center">
                <button
                  onClick={onNext}
                  className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {isLast ? "Next" : "Next Question"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ──────────────── SHAPE RENDERER ──────────────── */
const ShapeSVG = ({
  kind,
  taps,
  filled,
}: {
  kind: ShapeKind;
  taps: number;
  filled: boolean;
}) => {
  if (kind === "halfSquare") {
    const split = taps >= 1;
    return (
      <svg width="220" height="220" viewBox="0 0 200 200">
        <rect x="2" y="2" width="196" height="196" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />
        {filled && (
          <rect x="2" y="2" width="98" height="196" fill={TEAL} rx="6" style={{ animation: "fadeFill 200ms ease-in" }} />
        )}
        <line
          x1="100" y1="2" x2="100" y2="198"
          stroke={LABEL} strokeWidth="2"
          strokeDasharray="196"
          strokeDashoffset={split ? 0 : 196}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
    );
  }

  if (kind === "quarterCircle") {
    const half = taps >= 1;
    const quarter = taps >= 2;
    const tr = "M 100 100 L 100 5 A 95 95 0 0 1 195 100 Z";
    return (
      <svg width="220" height="220" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="95" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" />
        {filled && (
          <path d={tr} fill={TEAL} style={{ animation: "fadeFill 200ms ease-in" }} />
        )}
        <line x1="5" y1="100" x2="195" y2="100" stroke={LABEL} strokeWidth="2"
          strokeDasharray="190" strokeDashoffset={half ? 0 : 190}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }} />
        <line x1="100" y1="5" x2="100" y2="195" stroke={LABEL} strokeWidth="2"
          strokeDasharray="190" strokeDashoffset={quarter ? 0 : 190}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }} />
      </svg>
    );
  }

  // eighthSquare: tap1 = vertical halve, tap2 = horizontal -> quarters, tap3 = second vertical -> eighths (4 columns x 2 rows)
  const tap1 = taps >= 1;
  const tap2 = taps >= 2;
  const tap3 = taps >= 3;
  return (
    <svg width="240" height="220" viewBox="0 0 220 200">
      <rect x="2" y="2" width="216" height="196" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />
      {filled && (
        <rect x="2" y="2" width="54" height="98" fill={TEAL} rx="6" style={{ animation: "fadeFill 200ms ease-in" }} />
      )}
      {/* Tap 1: middle vertical */}
      <line x1="110" y1="2" x2="110" y2="198" stroke={LABEL} strokeWidth="2"
        strokeDasharray="196" strokeDashoffset={tap1 ? 0 : 196}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      {/* Tap 2: horizontal */}
      <line x1="2" y1="100" x2="218" y2="100" stroke={LABEL} strokeWidth="2"
        strokeDasharray="216" strokeDashoffset={tap2 ? 0 : 216}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      {/* Tap 3: two more verticals at quarters */}
      <line x1="56" y1="2" x2="56" y2="198" stroke={LABEL} strokeWidth="2"
        strokeDasharray="196" strokeDashoffset={tap3 ? 0 : 196}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      <line x1="164" y1="2" x2="164" y2="198" stroke={LABEL} strokeWidth="2"
        strokeDasharray="196" strokeDashoffset={tap3 ? 0 : 196}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
    </svg>
  );
};

const Keyframes = () => (
  <style>{`
    @keyframes fadeFill {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `}</style>
);

export default HalvesQuartersEighthsWeDo;
