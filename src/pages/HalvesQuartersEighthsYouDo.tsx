import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLearnComplete } from "@/lib/progress";
import CurriculumBadge from "@/components/CurriculumBadge";

const TEAL = "#1D9E75";
const TEAL_FILL = "#1D9E75";
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

/* ──────────────── QUESTION TYPES ──────────────── */
type ShapeKind = "circle" | "square" | "rectangle";

interface ShadeQuestion {
  type: "shade";
  id: string;
  shape: ShapeKind;
  taps: number; // splits required
  totalParts: number;
  shadeCount: number; // how many parts to shade
  fraction: string; // canonical, e.g. "1/2"
  acceptedFractions: string[];
  prompt: string;
  successMessage: string;
}

interface ChooseQuestion {
  type: "choose";
  id: string;
  prompt: string;
  options: { label: string; parts: number }[];
  correctParts: number;
  successMessage: string;
  wrongHint: string;
}

type Question = ShadeQuestion | ChooseQuestion;

const QUESTIONS: Question[] = [
  {
    type: "shade",
    id: "q1",
    shape: "circle",
    taps: 1,
    totalParts: 2,
    shadeCount: 1,
    fraction: "1/2",
    acceptedFractions: ["1/2"],
    prompt: "Tap to split into 2 equal parts. Shade one half.",
    successMessage: "Yes! 1 out of 2 equal parts is one half.",
  },
  {
    type: "shade",
    id: "q2",
    shape: "square",
    taps: 2,
    totalParts: 4,
    shadeCount: 1,
    fraction: "1/4",
    acceptedFractions: ["1/4"],
    prompt: "Tap to split into 4 equal parts. Shade one quarter.",
    successMessage: "Yes! 1 out of 4 equal parts is one quarter.",
  },
  {
    type: "shade",
    id: "q3",
    shape: "rectangle",
    taps: 1,
    totalParts: 2,
    shadeCount: 2,
    fraction: "2/2",
    acceptedFractions: ["2/2", "1", "1/1", "the whole thing", "whole"],
    prompt: "Tap to split into 2 equal parts. Shade both halves.",
    successMessage: "Yes! 2 out of 2 equal parts makes the whole thing.",
  },
  {
    type: "shade",
    id: "q4",
    shape: "circle",
    taps: 3,
    totalParts: 8,
    shadeCount: 1,
    fraction: "1/8",
    acceptedFractions: ["1/8"],
    prompt: "Tap to split into 8 equal parts. Shade one eighth.",
    successMessage: "Yes! 1 out of 8 equal parts is one eighth.",
  },
  {
    type: "choose",
    id: "q5",
    prompt: "Which shape shows quarters?",
    options: [
      { label: "A", parts: 2 },
      { label: "B", parts: 4 },
    ],
    correctParts: 4,
    successMessage: "Yes! 4 equal parts = quarters.",
    wrongHint: "Count the parts in each shape — which one has 4?",
  },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ──────────────── ROOT ──────────────── */
const HalvesQuartersEighthsYouDo = () => {
  const [seed, setSeed] = useState(0);
  const queue = useMemo(() => shuffle(QUESTIONS), [seed]);
  const [qIndex, setQIndex] = useState(0);
  const finished = qIndex >= queue.length;
  const navigate = useNavigate();

  const resetAll = () => {
    setSeed((s) => s + 1);
    setQIndex(0);
  };

  const handleReadyForPractise = async () => {
    try {
      localStorage.setItem("halvesQuartersEighths_learnComplete", "true");
    } catch {
      /* ignore */
    }
    void setLearnComplete("halvesQuartersEighths");
    navigate("/practise/halves-quarters-eighths");
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/learn/halves-quarters-eighths/we-do"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge
              {...AC9M2N03_PROPS}
              pageName="Halves, Quarters & Eighths Learn — You Do"
            />
          </div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Halves, Quarters &amp; Eighths — You Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Your turn — you've got this.
          </p>
        </div>

        {finished ? (
          <div className="mt-10 text-center space-y-6 animate-fade-in">
            <p
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Amazing work! You did it all by yourself! 🌟
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={resetAll}
                className="rounded-xl border-2 border-primary px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                I'd like more practise
              </button>
              <button
                onClick={handleReadyForPractise}
                className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                I'm ready to try on my own
              </button>
            </div>
          </div>
        ) : queue[qIndex].type === "shade" ? (
          <ShadeCard
            key={`${seed}-${qIndex}-${queue[qIndex].id}`}
            spec={queue[qIndex] as ShadeQuestion}
            qNum={qIndex + 1}
            total={queue.length}
            onNext={() => setQIndex((i) => i + 1)}
          />
        ) : (
          <ChooseCard
            key={`${seed}-${qIndex}-${queue[qIndex].id}`}
            spec={queue[qIndex] as ChooseQuestion}
            qNum={qIndex + 1}
            total={queue.length}
            onNext={() => setQIndex((i) => i + 1)}
          />
        )}
      </div>
      <Keyframes />
    </div>
  );
};

/* ──────────────── SHADE QUESTION CARD ──────────────── */
const ShadeCard = ({
  spec,
  qNum,
  total,
  onNext,
}: {
  spec: ShadeQuestion;
  qNum: number;
  total: number;
  onNext: () => void;
}) => {
  const [taps, setTaps] = useState(0);
  const [shaded, setShaded] = useState<number[]>([]);
  const [shadeInput, setShadeInput] = useState<number | null>(null);
  const [partsInput, setPartsInput] = useState<number | null>(null);
  const [fractionInput, setFractionInput] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [correct, setCorrect] = useState(false);

  const splitDone = taps >= spec.taps;
  const shadeDone = shaded.length >= spec.shadeCount;

  const handleTapShape = () => {
    if (!splitDone) {
      setTaps((n) => n + 1);
    }
  };

  const handleTapPart = (idx: number) => {
    if (!splitDone || shadeDone) return;
    if (shaded.includes(idx)) return;
    setShaded((s) => [...s, idx]);
  };

  const fractionOptions = useMemo(() => {
    const all = ["1/2", "1/4", "1/8", "2/2"];
    return shuffle(
      Array.from(new Set([spec.fraction, ...all])).slice(0, 4)
    );
  }, [spec.fraction]);

  const partsOptions = [2, 4, 8];

  const checkAnswer = () => {
    const shadeOk = shadeInput === spec.shadeCount;
    const partsOk = partsInput === spec.totalParts;
    const fractionOk =
      fractionInput !== null &&
      spec.acceptedFractions.includes(fractionInput.toLowerCase());

    if (shadeOk && partsOk && fractionOk) {
      setCorrect(true);
      setHint("");
      return;
    }
    if (!shadeOk) {
      setHint("Almost — count just the shaded parts.");
    } else if (!partsOk) {
      setHint("Almost — count all the equal parts altogether.");
    } else {
      setHint(
        `Not quite — ${spec.shadeCount} out of ${spec.totalParts} equal parts.`
      );
    }
  };

  const tryAgain = () => {
    setHint("");
    setShadeInput(null);
    setPartsInput(null);
    setFractionInput(null);
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Question {qNum} of {total}
      </p>

      <div className="mt-6 flex justify-center">
        <ShapeCanvas
          shape={spec.shape}
          taps={taps}
          totalParts={spec.totalParts}
          shaded={shaded}
          onTapShape={handleTapShape}
          onTapPart={handleTapPart}
          interactive={!correct}
        />
      </div>

      {!splitDone && (
        <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
          {spec.prompt}
          {spec.taps > 1 && (
            <span className="block text-sm mt-1">
              ({taps} / {spec.taps} taps)
            </span>
          )}
        </p>
      )}

      {splitDone && !shadeDone && (
        <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
          {spec.shadeCount === 1
            ? "Now tap a part to shade it."
            : `Now tap ${spec.shadeCount} parts to shade them. (${shaded.length} / ${spec.shadeCount})`}
        </p>
      )}

      {shadeDone && !correct && (
        <div className="mt-6 space-y-5 animate-fade-in">
          <p className="text-center text-base text-foreground">
            I shaded ___ out of ___ equal parts = ___
          </p>

          <ChipRow
            label="How many did you shade?"
            options={[1, 2, 3, 4]}
            value={shadeInput}
            onChange={setShadeInput}
            active={shadeInput === null}
            pulse={shadeInput === null}
          />

          <ChipRow
            label="How many equal parts are there?"
            options={partsOptions}
            value={partsInput}
            onChange={setPartsInput}
            active={shadeInput !== null && partsInput === null}
          />

          <FractionChipRow
            label="Which fraction is it?"
            options={fractionOptions}
            value={fractionInput}
            onChange={setFractionInput}
            active={partsInput !== null && fractionInput === null}
          />

          {hint && (
            <p className="text-center text-base font-medium text-destructive animate-fade-in">
              {hint}
            </p>
          )}

          <div className="text-center flex justify-center gap-3">
            {hint ? (
              <button
                onClick={tryAgain}
                className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Try again
              </button>
            ) : (
              <button
                onClick={checkAnswer}
                disabled={
                  shadeInput === null ||
                  partsInput === null ||
                  fractionInput === null
                }
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            )}
          </div>
        </div>
      )}

      {correct && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <p className="text-base font-semibold" style={{ color: LABEL }}>
            {spec.successMessage}
          </p>
          <button
            onClick={onNext}
            className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────── CHOOSE QUESTION CARD ──────────────── */
const ChooseCard = ({
  spec,
  qNum,
  total,
  onNext,
}: {
  spec: ChooseQuestion;
  qNum: number;
  total: number;
  onNext: () => void;
}) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [hint, setHint] = useState("");
  const [correct, setCorrect] = useState(false);

  // Shuffle the order of A/B once per mount
  const shown = useMemo(() => shuffle(spec.options), [spec]);

  const handlePick = (parts: number) => {
    if (correct) return;
    setPicked(parts);
    if (parts === spec.correctParts) {
      setCorrect(true);
      setHint("");
    } else {
      setHint(spec.wrongHint);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Question {qNum} of {total}
      </p>

      <p className="mt-4 text-center text-lg font-semibold text-foreground">
        {spec.prompt}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {shown.map((opt) => {
          const isCorrect = correct && opt.parts === spec.correctParts;
          const isWrongPick = picked === opt.parts && !correct;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handlePick(opt.parts)}
              className="rounded-2xl border-2 p-3 transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: isCorrect
                  ? TEAL
                  : isWrongPick
                  ? "hsl(var(--destructive))"
                  : GREY_BORDER,
                backgroundColor: isCorrect ? "#E1F5EE" : "#FFFFFF",
              }}
            >
              <PreSplitSquare parts={opt.parts} />
            </button>
          );
        })}
      </div>

      {hint && !correct && (
        <p className="mt-5 text-center text-base font-medium text-destructive animate-fade-in">
          {hint}
        </p>
      )}

      {correct && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <p className="text-base font-semibold" style={{ color: LABEL }}>
            {spec.successMessage}
          </p>
          <button
            onClick={onNext}
            className="rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────── CHIP ROWS ──────────────── */
const ChipRow = ({
  label,
  options,
  value,
  onChange,
  active = false,
  pulse = false,
}: {
  label: string;
  options: number[];
  value: number | null;
  onChange: (n: number) => void;
  active?: boolean;
  pulse?: boolean;
}) => (
  <div
    className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-all ${
      pulse ? "animate-pulse" : ""
    }`}
    style={{
      boxShadow: active ? `0 0 0 2px ${TEAL}40` : "none",
    }}
  >
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    {value === null && (
      <p className="text-[11px] italic text-muted-foreground/70 -mt-1">Tap to choose</p>
    )}
    <div className="flex flex-wrap justify-center gap-2 mt-0.5">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded-xl border shadow-sm px-5 py-2.5 text-lg font-bold transition-all hover:bg-[#F5FBF8] hover:border-[#1D9E75]/40 active:scale-95"
          style={{
            backgroundColor: value === n ? "#E1F5EE" : "#FFFFFF",
            borderColor: value === n ? TEAL : GREY_BORDER,
            borderWidth: value === n ? 2 : 1,
            color: LABEL,
            minHeight: 44,
            minWidth: 56,
          }}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

const FractionChipRow = ({
  label = "Fraction",
  options,
  value,
  onChange,
  active = false,
}: {
  label?: string;
  options: string[];
  value: string | null;
  onChange: (n: string) => void;
  active?: boolean;
}) => (
  <div
    className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-all"
    style={{
      boxShadow: active ? `0 0 0 2px ${TEAL}40` : "none",
    }}
  >
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    {value === null && (
      <p className="text-[11px] italic text-muted-foreground/70 -mt-1">Tap to choose</p>
    )}
    <div className="flex flex-wrap justify-center gap-2 mt-0.5">
      {options.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className="rounded-xl border shadow-sm px-5 py-2.5 text-lg font-semibold transition-all hover:bg-[#F5FBF8] hover:border-[#1D9E75]/40 active:scale-95"
          style={{
            backgroundColor: value === f ? "#E1F5EE" : "#FFFFFF",
            borderColor: value === f ? TEAL : GREY_BORDER,
            borderWidth: value === f ? 2 : 1,
            color: LABEL,
            minHeight: 44,
            minWidth: 64,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  </div>
);

/* ──────────────── SHAPE CANVAS ──────────────── */
const ShapeCanvas = ({
  shape,
  taps,
  totalParts,
  shaded,
  onTapShape,
  onTapPart,
  interactive,
}: {
  shape: ShapeKind;
  taps: number;
  totalParts: number;
  shaded: number[];
  onTapShape: () => void;
  onTapPart: (idx: number) => void;
  interactive: boolean;
}) => {
  const splitComplete = totalParts > 0 && (
    (totalParts === 2 && taps >= 1) ||
    (totalParts === 4 && taps >= 2) ||
    (totalParts === 8 && taps >= 3)
  );

  // Container size
  const W = shape === "rectangle" ? 280 : 220;
  const H = shape === "rectangle" ? 160 : 220;

  const wrapperClass = !splitComplete && interactive
    ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
    : "";

  return (
    <button
      type="button"
      onClick={() => !splitComplete && interactive && onTapShape()}
      disabled={splitComplete || !interactive}
      className={wrapperClass}
      style={{ background: "transparent", border: "none", padding: 0 }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {shape === "circle" && (
          <CircleShape
            taps={taps}
            totalParts={totalParts}
            shaded={shaded}
            onTapPart={onTapPart}
            interactive={interactive && splitComplete}
          />
        )}
        {shape === "square" && (
          <SquareShape
            taps={taps}
            totalParts={totalParts}
            shaded={shaded}
            onTapPart={onTapPart}
            interactive={interactive && splitComplete}
          />
        )}
        {shape === "rectangle" && (
          <RectangleShape
            taps={taps}
            shaded={shaded}
            onTapPart={onTapPart}
            interactive={interactive && splitComplete}
          />
        )}
      </svg>
    </button>
  );
};

/* ──────────────── CIRCLE: halves (2), quarters? not used here, eighths (8) ──────────────── */
const CircleShape = ({
  taps,
  totalParts,
  shaded,
  onTapPart,
  interactive,
}: {
  taps: number;
  totalParts: number;
  shaded: number[];
  onTapPart: (idx: number) => void;
  interactive: boolean;
}) => {
  const cx = 110, cy = 110, r = 95;

  // Build wedge paths for totalParts (when split complete)
  const wedges: { d: string }[] = [];
  if (totalParts === 2 && taps >= 1) {
    // Two halves split horizontally
    wedges.push({
      d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx - r} ${cy} Z`,
    }); // top
    wedges.push({
      d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy} L ${cx - r} ${cy} Z`,
    }); // bottom
  } else if (totalParts === 8 && taps >= 3) {
    // Eight wedges
    for (let i = 0; i < 8; i++) {
      const a1 = (i * Math.PI) / 4 - Math.PI / 2;
      const a2 = ((i + 1) * Math.PI) / 4 - Math.PI / 2;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      wedges.push({
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`,
      });
    }
  }

  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={GREY} stroke={GREY_BORDER} strokeWidth="1" />

      {/* Wedge fills + click targets */}
      {wedges.map((w, i) => (
        <path
          key={i}
          d={w.d}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{
            cursor: interactive ? "pointer" : "default",
            animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined,
          }}
          onClick={() => interactive && onTapPart(i)}
        />
      ))}

      {/* Splitting lines */}
      {/* For halves: horizontal */}
      {totalParts === 2 && (
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={LABEL} strokeWidth="2"
          strokeDasharray={r * 2} strokeDashoffset={taps >= 1 ? 0 : r * 2}
          style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      )}
      {/* For eighths: 4 diameters at 0, 45, 90, 135 deg */}
      {totalParts === 8 && [0, 1, 2, 3].map((i) => {
        const ang = (i * Math.PI) / 4;
        const dx = r * Math.cos(ang), dy = r * Math.sin(ang);
        const tapNeeded = i === 0 ? 1 : i === 2 ? 2 : 3;
        return (
          <line
            key={i}
            x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
            stroke={LABEL} strokeWidth="2"
            strokeDasharray={r * 2}
            strokeDashoffset={taps >= tapNeeded ? 0 : r * 2}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }}
          />
        );
      })}
    </>
  );
};

/* ──────────────── SQUARE: quarters (4) via 2x2 ──────────────── */
const SquareShape = ({
  taps,
  totalParts,
  shaded,
  onTapPart,
  interactive,
}: {
  taps: number;
  totalParts: number;
  shaded: number[];
  onTapPart: (idx: number) => void;
  interactive: boolean;
}) => {
  // 196x196 square, top-left at (2,2)
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  if (totalParts === 4 && taps >= 2) {
    cells.push({ x: 2, y: 2, w: 98, h: 98 });
    cells.push({ x: 100, y: 2, w: 98, h: 98 });
    cells.push({ x: 2, y: 100, w: 98, h: 98 });
    cells.push({ x: 100, y: 100, w: 98, h: 98 });
  }

  return (
    <>
      <rect x="2" y="2" width="196" height="196" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />

      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x} y={c.y} width={c.w} height={c.h}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{
            cursor: interactive ? "pointer" : "default",
            animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined,
          }}
          onClick={() => interactive && onTapPart(i)}
        />
      ))}

      {/* Vertical line (tap 1) */}
      <line x1="100" y1="2" x2="100" y2="198" stroke={LABEL} strokeWidth="2"
        strokeDasharray="196" strokeDashoffset={taps >= 1 ? 0 : 196}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      {/* Horizontal line (tap 2) */}
      <line x1="2" y1="100" x2="198" y2="100" stroke={LABEL} strokeWidth="2"
        strokeDasharray="196" strokeDashoffset={taps >= 2 ? 0 : 196}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
    </>
  );
};

/* ──────────────── RECTANGLE: halves split vertically ──────────────── */
const RectangleShape = ({
  taps,
  shaded,
  onTapPart,
  interactive,
}: {
  taps: number;
  shaded: number[];
  onTapPart: (idx: number) => void;
  interactive: boolean;
}) => {
  // 280x160, padded
  const cells = taps >= 1
    ? [
        { x: 2, y: 2, w: 138, h: 156 },
        { x: 140, y: 2, w: 138, h: 156 },
      ]
    : [];

  return (
    <>
      <rect x="2" y="2" width="276" height="156" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />

      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x} y={c.y} width={c.w} height={c.h}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{
            cursor: interactive ? "pointer" : "default",
            animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined,
          }}
          onClick={() => interactive && onTapPart(i)}
        />
      ))}

      <line x1="140" y1="2" x2="140" y2="158" stroke={LABEL} strokeWidth="2"
        strokeDasharray="156" strokeDashoffset={taps >= 1 ? 0 : 156}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
    </>
  );
};

/* ──────────────── PRE-SPLIT SQUARE for the "choose" question ──────────────── */
const PreSplitSquare = ({ parts }: { parts: number }) => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <rect x="2" y="2" width="116" height="116" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />
      {parts === 2 && (
        <line x1="60" y1="2" x2="60" y2="118" stroke={LABEL} strokeWidth="2" />
      )}
      {parts === 4 && (
        <>
          <line x1="60" y1="2" x2="60" y2="118" stroke={LABEL} strokeWidth="2" />
          <line x1="2" y1="60" x2="118" y2="60" stroke={LABEL} strokeWidth="2" />
        </>
      )}
    </svg>
  );
};

/* ──────────────── KEYFRAMES ──────────────── */
const Keyframes = () => (
  <style>{`
    @keyframes fadeFill {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `}</style>
);

export default HalvesQuartersEighthsYouDo;
