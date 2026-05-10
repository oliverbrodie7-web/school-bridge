import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLevel3Unlocked, setLevel3Unlocked } from "@/lib/progress";
import CurriculumBadge from "@/components/CurriculumBadge";
import { PractiseHintButton } from "@/components/PractiseHintButton";

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

/* ──────────────── TYPES ──────────────── */
type ShapeKind = "circle" | "square" | "rectangle";

type FractionStr = "1/2" | "1/4" | "1/8" | "2/4" | "2/8" | "3/8" | "4/8";

interface ShadeQ {
  type: "shade";
  shape: ShapeKind;
  taps: number;
  totalParts: number;
  shadeCount: number;
  fraction: FractionStr;
}

interface IdentifyQ {
  type: "identify";
  shape: ShapeKind;
  totalParts: number;
  shadedIndices: number[];
  fraction: FractionStr;
}

interface CompareQ {
  type: "compare";
  target: FractionStr;
  options: { shape: ShapeKind; totalParts: number; shadedIndices: number[]; fraction: FractionStr }[];
  correctIndex: number;
}

type Question = ShadeQ | IdentifyQ | CompareQ;

/* ──────────────── HELPERS ──────────────── */
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ──────────────── GENERATORS ──────────────── */
const generateL1 = (): ShadeQ => ({
  type: "shade",
  shape: pick<ShapeKind>(["square", "circle"]),
  taps: 1,
  totalParts: 2,
  shadeCount: 1,
  fraction: "1/2",
});

const generateL2 = (): ShadeQ => ({
  type: "shade",
  shape: pick<ShapeKind>(["square", "circle", "rectangle"]),
  taps: 2,
  totalParts: 4,
  shadeCount: 1,
  fraction: "1/4",
});

const generateL3 = (): Question => {
  const sub = pick(["eighth", "identify", "compare"] as const);
  if (sub === "eighth") {
    return {
      type: "shade",
      shape: pick<ShapeKind>(["square", "circle"]),
      taps: 3,
      totalParts: 8,
      shadeCount: 1,
      fraction: "1/8",
    };
  }
  if (sub === "identify") {
    const choice = pick([
      { totalParts: 2, shadeCount: 1, fraction: "1/2" as FractionStr },
      { totalParts: 4, shadeCount: 1, fraction: "1/4" as FractionStr },
      { totalParts: 4, shadeCount: 2, fraction: "2/4" as FractionStr },
      { totalParts: 8, shadeCount: 1, fraction: "1/8" as FractionStr },
      { totalParts: 8, shadeCount: 3, fraction: "3/8" as FractionStr },
    ]);
    const idxs = shuffle([...Array(choice.totalParts).keys()]).slice(0, choice.shadeCount);
    return {
      type: "identify",
      shape: pick<ShapeKind>(["square", "circle"]),
      totalParts: choice.totalParts,
      shadedIndices: idxs,
      fraction: choice.fraction,
    };
  }
  // compare
  const target = pick<FractionStr>(["1/2", "1/4", "1/8"]);
  const targetParts = target === "1/2" ? 2 : target === "1/4" ? 4 : 8;
  const distractor = pick(([2, 4, 8] as const).filter((p) => p !== targetParts));
  const correct = {
    shape: pick<ShapeKind>(["square", "circle"]),
    totalParts: targetParts,
    shadedIndices: [0],
    fraction: target,
  };
  const wrong = {
    shape: pick<ShapeKind>(["square", "circle"]),
    totalParts: distractor,
    shadedIndices: [0],
    fraction: (distractor === 2 ? "1/2" : distractor === 4 ? "1/4" : "1/8") as FractionStr,
  };
  const opts = shuffle([correct, wrong]);
  return {
    type: "compare",
    target,
    options: opts,
    correctIndex: opts.findIndex((o) => o.fraction === target),
  };
};

/* ──────────────── LEVEL SELECTOR ──────────────── */
const LevelSelector = ({
  level,
  onChange,
  l3Unlocked,
}: {
  level: number;
  onChange: (l: number) => void;
  l3Unlocked: boolean;
}) => {
  const levels = [
    { n: 1, label: "Level 1", desc: "Halves", locked: false },
    { n: 2, label: "Level 2", desc: "Quarters", locked: false },
    { n: 3, label: "Level 3", desc: "Eighths & mixed", locked: !l3Unlocked },
  ];
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {levels.map((l) => (
        <button
          key={l.n}
          onClick={() => !l.locked && onChange(l.n)}
          disabled={l.locked}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition-colors border-2 ${
            l.locked
              ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
              : level === l.n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          <span className="block">
            {l.label} {l.locked ? "🔒" : ""}
          </span>
          <span className="block text-xs font-normal opacity-70">{l.desc}</span>
        </button>
      ))}
    </div>
  );
};

/* ──────────────── SHAPE RENDERER ──────────────── */
interface ShapeProps {
  shape: ShapeKind;
  totalParts: number;
  taps: number;
  shaded: number[];
  onTapShape?: () => void;
  onTapPart?: (idx: number) => void;
  interactive: boolean;
  size?: "normal" | "small";
}

const ShapeRenderer = ({
  shape,
  totalParts,
  taps,
  shaded,
  onTapShape,
  onTapPart,
  interactive,
  size = "normal",
}: ShapeProps) => {
  const splitDone =
    (totalParts === 2 && taps >= 1) ||
    (totalParts === 4 && taps >= 2) ||
    (totalParts === 8 && taps >= 3);

  const scale = size === "small" ? 0.6 : 1;
  const W = (shape === "rectangle" ? 280 : 220) * scale;
  const H = (shape === "rectangle" ? 160 : 220) * scale;
  const VBW = shape === "rectangle" ? 280 : 220;
  const VBH = shape === "rectangle" ? 160 : 220;

  const wrapClass =
    !splitDone && interactive && onTapShape
      ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
      : "";

  return (
    <button
      type="button"
      onClick={() => !splitDone && interactive && onTapShape?.()}
      disabled={splitDone || !interactive || !onTapShape}
      className={wrapClass}
      style={{ background: "transparent", border: "none", padding: 0 }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${VBW} ${VBH}`}>
        {shape === "circle" && (
          <CircleParts taps={taps} totalParts={totalParts} shaded={shaded} onTapPart={onTapPart} interactive={interactive && splitDone} />
        )}
        {shape === "square" && (
          <SquareParts taps={taps} totalParts={totalParts} shaded={shaded} onTapPart={onTapPart} interactive={interactive && splitDone} />
        )}
        {shape === "rectangle" && (
          <RectangleParts taps={taps} totalParts={totalParts} shaded={shaded} onTapPart={onTapPart} interactive={interactive && splitDone} />
        )}
      </svg>
    </button>
  );
};

const CircleParts = ({ taps, totalParts, shaded, onTapPart, interactive }: {
  taps: number; totalParts: number; shaded: number[]; onTapPart?: (i: number) => void; interactive: boolean;
}) => {
  const cx = 110, cy = 110, r = 95;
  const wedges: { d: string }[] = [];
  if (totalParts === 2 && taps >= 1) {
    wedges.push({ d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx - r} ${cy} Z` });
    wedges.push({ d: `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy} L ${cx - r} ${cy} Z` });
  } else if (totalParts === 4 && taps >= 2) {
    for (let i = 0; i < 4; i++) {
      const a1 = (i * Math.PI) / 2 - Math.PI / 2;
      const a2 = ((i + 1) * Math.PI) / 2 - Math.PI / 2;
      wedges.push({
        d: `M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`,
      });
    }
  } else if (totalParts === 8 && taps >= 3) {
    for (let i = 0; i < 8; i++) {
      const a1 = (i * Math.PI) / 4 - Math.PI / 2;
      const a2 = ((i + 1) * Math.PI) / 4 - Math.PI / 2;
      wedges.push({
        d: `M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`,
      });
    }
  }

  const lines: { x1: number; y1: number; x2: number; y2: number; show: boolean }[] = [];
  if (totalParts === 2) {
    lines.push({ x1: cx - r, y1: cy, x2: cx + r, y2: cy, show: taps >= 1 });
  } else if (totalParts === 4) {
    lines.push({ x1: cx - r, y1: cy, x2: cx + r, y2: cy, show: taps >= 1 });
    lines.push({ x1: cx, y1: cy - r, x2: cx, y2: cy + r, show: taps >= 2 });
  } else if (totalParts === 8) {
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 4;
      const dx = r * Math.cos(ang), dy = r * Math.sin(ang);
      const tapNeeded = i === 0 ? 1 : i === 2 ? 2 : 3;
      lines.push({ x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy, show: taps >= tapNeeded });
    }
  }

  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={GREY} stroke={GREY_BORDER} strokeWidth="1" />
      {wedges.map((w, i) => (
        <path key={i} d={w.d}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{ cursor: interactive ? "pointer" : "default", animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined }}
          onClick={() => interactive && onTapPart?.(i)} />
      ))}
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={LABEL} strokeWidth="2"
          strokeDasharray={r * 2} strokeDashoffset={l.show ? 0 : r * 2}
          style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      ))}
    </>
  );
};

const SquareParts = ({ taps, totalParts, shaded, onTapPart, interactive }: {
  taps: number; totalParts: number; shaded: number[]; onTapPart?: (i: number) => void; interactive: boolean;
}) => {
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  if (totalParts === 2 && taps >= 1) {
    cells.push({ x: 2, y: 2, w: 98, h: 196 });
    cells.push({ x: 100, y: 2, w: 98, h: 196 });
  } else if (totalParts === 4 && taps >= 2) {
    cells.push({ x: 2, y: 2, w: 98, h: 98 });
    cells.push({ x: 100, y: 2, w: 98, h: 98 });
    cells.push({ x: 2, y: 100, w: 98, h: 98 });
    cells.push({ x: 100, y: 100, w: 98, h: 98 });
  } else if (totalParts === 8 && taps >= 3) {
    // 4 cols × 2 rows
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        cells.push({ x: 2 + c * 49, y: 2 + r * 98, w: 49, h: 98 });
      }
    }
  }

  return (
    <>
      <rect x="2" y="2" width="196" height="196" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{ cursor: interactive ? "pointer" : "default", animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined }}
          onClick={() => interactive && onTapPart?.(i)} />
      ))}
      {/* Lines */}
      {totalParts === 2 && (
        <line x1="100" y1="2" x2="100" y2="198" stroke={LABEL} strokeWidth="2"
          strokeDasharray="196" strokeDashoffset={taps >= 1 ? 0 : 196}
          style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      )}
      {totalParts === 4 && (
        <>
          <line x1="100" y1="2" x2="100" y2="198" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 1 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
          <line x1="2" y1="100" x2="198" y2="100" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 2 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
        </>
      )}
      {totalParts === 8 && (
        <>
          <line x1="100" y1="2" x2="100" y2="198" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 1 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
          <line x1="2" y1="100" x2="198" y2="100" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 2 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
          <line x1="51" y1="2" x2="51" y2="198" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 3 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
          <line x1="149" y1="2" x2="149" y2="198" stroke={LABEL} strokeWidth="2"
            strokeDasharray="196" strokeDashoffset={taps >= 3 ? 0 : 196}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
        </>
      )}
    </>
  );
};

const RectangleParts = ({ taps, totalParts, shaded, onTapPart, interactive }: {
  taps: number; totalParts: number; shaded: number[]; onTapPart?: (i: number) => void; interactive: boolean;
}) => {
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  if (totalParts === 2 && taps >= 1) {
    cells.push({ x: 2, y: 2, w: 138, h: 156 });
    cells.push({ x: 140, y: 2, w: 138, h: 156 });
  } else if (totalParts === 4 && taps >= 2) {
    // 2 cols × 2 rows
    cells.push({ x: 2, y: 2, w: 138, h: 78 });
    cells.push({ x: 140, y: 2, w: 138, h: 78 });
    cells.push({ x: 2, y: 80, w: 138, h: 78 });
    cells.push({ x: 140, y: 80, w: 138, h: 78 });
  }
  return (
    <>
      <rect x="2" y="2" width="276" height="156" fill={GREY} stroke={GREY_BORDER} strokeWidth="1" rx="6" />
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h}
          fill={shaded.includes(i) ? TEAL_FILL : "transparent"}
          style={{ cursor: interactive ? "pointer" : "default", animation: shaded.includes(i) ? "fadeFill 200ms ease-in" : undefined }}
          onClick={() => interactive && onTapPart?.(i)} />
      ))}
      <line x1="140" y1="2" x2="140" y2="158" stroke={LABEL} strokeWidth="2"
        strokeDasharray="156" strokeDashoffset={taps >= 1 ? 0 : 156}
        style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      {totalParts === 4 && (
        <line x1="2" y1="80" x2="278" y2="80" stroke={LABEL} strokeWidth="2"
          strokeDasharray="276" strokeDashoffset={taps >= 2 ? 0 : 276}
          style={{ transition: "stroke-dashoffset 500ms ease-out" }} />
      )}
    </>
  );
};

/* ──────────────── CHIP ROWS ──────────────── */
const ChipRow = <T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          onClick={() => onChange(o)}
          className="rounded-xl border px-5 py-2.5 text-base font-semibold transition-all hover:bg-[#F5FBF8]"
          style={{
            backgroundColor: value === o ? "#E1F5EE" : "#FFFFFF",
            borderColor: value === o ? TEAL : GREY_BORDER,
            borderWidth: value === o ? 2 : 1,
            color: LABEL,
            minHeight: 44,
            minWidth: 56,
          }}
        >
          {String(o)}
        </button>
      ))}
    </div>
  </div>
);

/* ──────────────── SHADE CARD (L1, L2, L3-eighth) ──────────────── */
const ShadeCard = ({
  q,
  level,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: ShadeQ;
  level: 1 | 2 | 3;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [taps, setTaps] = useState(0);
  const [shaded, setShaded] = useState<number[]>([]);
  const [shadeChip, setShadeChip] = useState<number | null>(null);
  const [partsChip, setPartsChip] = useState<number | null>(null);
  const [fractionChip, setFractionChip] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const splitDone = taps >= q.taps;
  const shadeDone = shaded.length >= q.shadeCount;

  const partsOptions = [2, 4, 8];
  const shadeOptions = [1, 2, 3, 4];
  const fractionOptions = useMemo(
    () => shuffle(["1/2", "1/4", "1/8", q.fraction].filter((v, i, a) => a.indexOf(v) === i)),
    [q]
  );

  const handleTapShape = () => {
    if (taps < q.taps) setTaps((n) => n + 1);
  };
  const handleTapPart = (i: number) => {
    if (!splitDone || shadeDone || shaded.includes(i)) return;
    setShaded((s) => [...s, i]);
  };

  const check = () => {
    const ok =
      shadeChip === q.shadeCount &&
      partsChip === q.totalParts &&
      fractionChip === q.fraction;
    if (ok) {
      setDone(true);
      setHint("");
      return;
    }
    setHadWrong(true);
    if (shadeChip !== q.shadeCount) {
      setHint("Almost — count just the shaded parts.");
    } else if (partsChip !== q.totalParts) {
      setHint("Almost — count all the equal parts altogether.");
    } else {
      setHint(`Not quite — ${q.shadeCount} out of ${q.totalParts} equal parts.`);
    }
  };

  const tryAgain = () => {
    setHint("");
    setShadeChip(null);
    setPartsChip(null);
    setFractionChip(null);
  };

  const correctMessage =
    level === 1
      ? "Perfect — 2 equal parts makes halves."
      : level === 2
        ? "Great — 4 equal parts makes quarters."
        : "Excellent — you're thinking in equal parts like a mathematician.";

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {level !== 1 && (
        <PractiseHintButton
          strategy="halvesQuartersEighths"
          level={level as 2 | 3}
          consecutiveCorrect={consecutiveCorrect}
          consecutiveWrong={consecutiveWrong}
          hintKey={hintKey}
        />
      )}

      <div className="mt-6 flex justify-center">
        <ShapeRenderer
          shape={q.shape}
          totalParts={q.totalParts}
          taps={taps}
          shaded={shaded}
          onTapShape={!done ? handleTapShape : undefined}
          onTapPart={!done ? handleTapPart : undefined}
          interactive={!done}
        />
      </div>

      {!splitDone && (
        <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
          Tap to split into {q.totalParts} equal parts.
          {q.taps > 1 && (
            <span className="block text-sm mt-1">({taps} / {q.taps} taps)</span>
          )}
        </p>
      )}

      {splitDone && !shadeDone && (
        <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
          Now tap a part to shade it.
        </p>
      )}

      {shadeDone && !done && (
        <div className="mt-6 space-y-5 animate-fade-in">
          <p className="text-center text-base text-foreground">
            I shaded ___ out of ___ parts = ___
          </p>
          <ChipRow<number> label="Shaded parts" options={shadeOptions} value={shadeChip} onChange={setShadeChip} />
          <ChipRow<number> label="Equal parts" options={partsOptions} value={partsChip} onChange={setPartsChip} />
          <ChipRow<string> label="Fraction" options={fractionOptions} value={fractionChip} onChange={setFractionChip} />

          {hint && (
            <p className="text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>
          )}

          <div className="flex justify-center">
            {hint ? (
              <button
                onClick={tryAgain}
                className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Try again
              </button>
            ) : (
              <button
                onClick={check}
                disabled={shadeChip === null || partsChip === null || fractionChip === null}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            )}
          </div>
        </div>
      )}

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            {correctMessage}
          </div>
          <button
            onClick={() => onCorrect(hadWrong)}
            className="w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────── IDENTIFY CARD (L3) ──────────────── */
const IdentifyCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: IdentifyQ;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [pick, setPick] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const options = useMemo(
    () => shuffle(["1/2", "1/4", "1/8", "2/4", "3/8", q.fraction].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
    [q]
  );

  const tapsForFull = q.totalParts === 2 ? 1 : q.totalParts === 4 ? 2 : 3;

  const check = () => {
    if (pick === q.fraction) {
      setDone(true);
      setHint("");
    } else {
      setHadWrong(true);
      setHint(`Not quite — count the shaded parts and the total parts.`);
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={3}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-center text-base font-medium text-foreground">
        What fraction is shaded?
      </p>

      <div className="mt-4 flex justify-center">
        <ShapeRenderer
          shape={q.shape}
          totalParts={q.totalParts}
          taps={tapsForFull}
          shaded={q.shadedIndices}
          interactive={false}
        />
      </div>

      {!done && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <ChipRow label="Fraction" options={options} value={pick} onChange={setPick} />

          {hint && (
            <p className="text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>
          )}

          <div className="flex justify-center">
            {hint ? (
              <button
                onClick={() => { setHint(""); setPick(null); }}
                className="rounded-xl border-2 border-primary px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Try again
              </button>
            ) : (
              <button
                onClick={check}
                disabled={pick === null}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            )}
          </div>
        </div>
      )}

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            Excellent — you're thinking in equal parts like a mathematician.
          </div>
          <button
            onClick={() => onCorrect(hadWrong)}
            className="w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────── COMPARE CARD (L3) ──────────────── */
const CompareCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: CompareQ;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [hint, setHint] = useState("");
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const handlePick = (i: number) => {
    if (done) return;
    setPicked(i);
    if (i === q.correctIndex) {
      setDone(true);
      setHint("");
    } else {
      setHadWrong(true);
      setHint("Count the parts in each shape — which one matches?");
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={3}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-center text-lg font-semibold text-foreground">
        Which shape shows {q.target}?
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {q.options.map((opt, i) => {
          const isCorrect = done && i === q.correctIndex;
          const isWrong = !done && picked === i && i !== q.correctIndex;
          const tapsForFull = opt.totalParts === 2 ? 1 : opt.totalParts === 4 ? 2 : 3;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handlePick(i)}
              disabled={done}
              className="rounded-2xl border-2 p-3 transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: isCorrect ? TEAL : isWrong ? "hsl(var(--destructive))" : GREY_BORDER,
                backgroundColor: isCorrect ? "#E1F5EE" : "#FFFFFF",
              }}
            >
              <ShapeRenderer
                shape={opt.shape}
                totalParts={opt.totalParts}
                taps={tapsForFull}
                shaded={opt.shadedIndices}
                interactive={false}
                size="small"
              />
            </button>
          );
        })}
      </div>

      {hint && !done && (
        <p className="mt-5 text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>
      )}

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            Excellent — you're thinking in equal parts like a mathematician.
          </div>
          <button
            onClick={() => onCorrect(hadWrong)}
            className="w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────── MAIN PAGE ──────────────── */
const HalvesQuartersEighthsPractise = () => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [question, setQuestion] = useState<Question>(() => generateL1());
  const [questionNum, setQuestionNum] = useState(1);
  const [l2Streak, setL2Streak] = useState(0);
  const [l3Unlocked, setL3Unlocked] = useState(false);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  useEffect(() => {
    (async () => {
      const unlocked = await getLevel3Unlocked("halvesQuartersEighths");
      if (unlocked) setL3Unlocked(true);
    })();
  }, []);

  const genFor = useCallback((lvl: 1 | 2 | 3): Question => {
    if (lvl === 1) return generateL1();
    if (lvl === 2) return generateL2();
    return generateL3();
  }, []);

  const handleLevelChange = (l: number) => {
    const lvl = l as 1 | 2 | 3;
    setLevel(lvl);
    setQuestion(genFor(lvl));
    setQuestionNum(1);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
  };

  const handleCorrect = (hadWrong: boolean) => {
    if (hadWrong) {
      setConsecutiveWrong((w) => w + 1);
      setConsecutiveCorrect(0);
    } else {
      setConsecutiveCorrect((c) => c + 1);
      setConsecutiveWrong(0);
    }

    if (level === 2 && !hadWrong) {
      const newStreak = l2Streak + 1;
      setL2Streak(newStreak);
      if (newStreak >= 10 && !l3Unlocked) {
        setL3Unlocked(true);
        setShowUnlockBanner(true);
        void setLevel3Unlocked("halvesQuartersEighths");
      }
    } else if (level === 2 && hadWrong) {
      setL2Streak(0);
    }

    const nextNum = questionNum + 1;
    setQuestionNum(nextNum);
    setQuestion(genFor(level));
  };

  const switchToL3 = () => {
    setShowUnlockBanner(false);
    handleLevelChange(3);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/halves-quarters-eighths"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge {...AC9M2N03_PROPS} pageName="Halves, Quarters & Eighths Practise" />
          </div>
          <h1
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Halves, Quarters &amp; Eighths — Practise
          </h1>
          <p className="mt-2 mb-6 text-center text-muted-foreground">
            Choose your level.
          </p>
        </div>

        <LevelSelector level={level} onChange={handleLevelChange} l3Unlocked={l3Unlocked} />

        {showUnlockBanner && (
          <div className="mt-4 rounded-xl border-2 border-primary bg-secondary p-4 text-center animate-fade-in">
            <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Great work — Level 3 unlocked! 🎉
            </p>
            <p className="mt-1 text-muted-foreground">Ready for a bigger challenge?</p>
            <div className="mt-3 flex gap-3 justify-center">
              <button
                onClick={switchToL3}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try Level 3
              </button>
              <button
                onClick={() => setShowUnlockBanner(false)}
                className="rounded-xl border-2 border-border px-6 py-3 text-base font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Keep going
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Question {questionNum}
        </p>

        {question.type === "shade" && (
          <ShadeCard
            key={`${level}-${questionNum}`}
            q={question}
            level={level}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
        {question.type === "identify" && (
          <IdentifyCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
        {question.type === "compare" && (
          <CompareCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
      </div>
      <Keyframes />
    </div>
  );
};

const Keyframes = () => (
  <style>{`
    @keyframes fadeFill { from { opacity: 0; } to { opacity: 1; } }
  `}</style>
);

export default HalvesQuartersEighthsPractise;
