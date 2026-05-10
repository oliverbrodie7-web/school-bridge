import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { getLevel3Unlocked, setLevel3Unlocked } from "@/lib/progress";
import CurriculumBadge from "@/components/CurriculumBadge";
import { PractiseHintButton } from "@/components/PractiseHintButton";
import { Pizza, ChocolateBar } from "@/components/FractionFood";
import ProgressIndicator from "@/components/ProgressIndicator";

const TEAL = "#1D9E75";
const TEAL_FILL = "#1D9E75";
const TEAL_LIGHT = "#E1F5EE";
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
type ShapeKind = "pizza" | "bar";
type PlainKind = "circle" | "rectangle";
type AnyShape = ShapeKind | PlainKind;

type FractionStr =
  | "1/2" | "1/4" | "1/8"
  | "2/4" | "2/8" | "3/8" | "4/8" | "3/4";

interface ShadeQ {
  type: "shade";
  shape: ShapeKind;
  taps: number;
  totalParts: number;
  shadeCount: number;
  fraction: FractionStr;
}

interface L2IdentifyQ {
  type: "l2_identify";
  fraction: FractionStr;
  options: { shape: ShapeKind; totalParts: number; shadedIndices: number[] }[];
  correctIndex: number;
}

interface L2MatchQ {
  type: "l2_match";
  items: { id: string; shape: AnyShape; totalParts: number; shadedIndices: number[]; fraction: FractionStr }[];
  labels: FractionStr[];
}

interface L2FillQ {
  type: "l2_fill";
  shape: PlainKind;
  totalParts: number;
  shadeCount: number;
  fraction: FractionStr;
}

interface L3WordQ {
  type: "l3_word";
  text: string;
  inputMode: "fraction" | "whole";
  /** Accepted answers as canonical strings, e.g. "1/2", "1". */
  acceptable: string[];
  /** For correct-feedback message routing. */
  fractionType: "halves" | "quarters" | "eighths";
  /** Stable signature for "no repeats" tracking. */
  signature: string;
}

type Question = ShadeQ | L2IdentifyQ | L2MatchQ | L2FillQ | L3WordQ;

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

/* ──────────────── L1 GENERATOR (unchanged) ──────────────── */
const generateL1 = (): ShadeQ => ({
  type: "shade",
  shape: "bar",
  taps: 1,
  totalParts: 2,
  shadeCount: 1,
  fraction: "1/2",
});

/* ──────────────── L2 GENERATORS ──────────────── */
type IdentifyChoice = { fraction: FractionStr; totalParts: number };
const IDENTIFY_FRACTIONS: IdentifyChoice[] = [
  { fraction: "1/2", totalParts: 2 },
  { fraction: "1/4", totalParts: 4 },
  { fraction: "1/8", totalParts: 8 },
];

const generateL2Identify = (avoid: Set<string>): L2IdentifyQ => {
  for (let attempt = 0; attempt < 30; attempt++) {
    const target = pick(IDENTIFY_FRACTIONS);
    const distractors = shuffle(IDENTIFY_FRACTIONS.filter((c) => c.fraction !== target.fraction));
    const numDistract = randInt(1, 2);
    const shape: ShapeKind = pick(["pizza", "bar"]);
    const correct = { shape, totalParts: target.totalParts, shadedIndices: [0] };
    const wrongs = distractors.slice(0, numDistract).map((d) => ({
      shape,
      totalParts: d.totalParts,
      shadedIndices: [0],
    }));
    const opts = shuffle([correct, ...wrongs]);
    const correctIndex = opts.findIndex(
      (o) => o.totalParts === target.totalParts && o === correct,
    );
    const sig = `id:${target.fraction}:${shape}:${opts.map((o) => o.totalParts).join("-")}`;
    if (!avoid.has(sig)) {
      avoid.add(sig);
      return { type: "l2_identify", fraction: target.fraction, options: opts, correctIndex };
    }
  }
  // Fallback even if duplicate.
  const target = pick(IDENTIFY_FRACTIONS);
  const shape: ShapeKind = pick(["pizza", "bar"]);
  const opts = [{ shape, totalParts: target.totalParts, shadedIndices: [0] }];
  return { type: "l2_identify", fraction: target.fraction, options: opts, correctIndex: 0 };
};

const generateL2Match = (avoid: Set<string>): L2MatchQ => {
  const fractions: { fraction: FractionStr; totalParts: number }[] = [
    { fraction: "1/2", totalParts: 2 },
    { fraction: "1/4", totalParts: 4 },
    { fraction: "1/8", totalParts: 8 },
  ];
  const shapeChoices: AnyShape[] = ["pizza", "bar", "circle", "rectangle"];
  for (let attempt = 0; attempt < 20; attempt++) {
    const items = fractions.map((f, i) => ({
      id: `m${i}`,
      shape: pick(shapeChoices),
      totalParts: f.totalParts,
      shadedIndices: [0],
      fraction: f.fraction,
    }));
    const labels = shuffle(fractions.map((f) => f.fraction));
    const sig = `match:${items.map((i) => `${i.shape}-${i.fraction}`).join("|")}:${labels.join(",")}`;
    if (!avoid.has(sig)) {
      avoid.add(sig);
      return { type: "l2_match", items, labels };
    }
  }
  const items = fractions.map((f, i) => ({
    id: `m${i}`,
    shape: "circle" as AnyShape,
    totalParts: f.totalParts,
    shadedIndices: [0],
    fraction: f.fraction,
  }));
  return { type: "l2_match", items, labels: shuffle(fractions.map((f) => f.fraction)) };
};

type FillChoice = { totalParts: number; shadeCount: number; fraction: FractionStr };
const FILL_CHOICES: FillChoice[] = [
  { totalParts: 2, shadeCount: 1, fraction: "1/2" },
  { totalParts: 4, shadeCount: 1, fraction: "1/4" },
  { totalParts: 4, shadeCount: 2, fraction: "2/4" },
  { totalParts: 4, shadeCount: 3, fraction: "3/4" },
  { totalParts: 8, shadeCount: 1, fraction: "1/8" },
  { totalParts: 8, shadeCount: 2, fraction: "2/8" },
  { totalParts: 8, shadeCount: 3, fraction: "3/8" },
];

const generateL2Fill = (avoid: Set<string>): L2FillQ => {
  for (let attempt = 0; attempt < 30; attempt++) {
    const c = pick(FILL_CHOICES);
    const shape: PlainKind = pick(["circle", "rectangle"]);
    const sig = `fill:${shape}:${c.fraction}`;
    if (!avoid.has(sig)) {
      avoid.add(sig);
      return { type: "l2_fill", shape, totalParts: c.totalParts, shadeCount: c.shadeCount, fraction: c.fraction };
    }
  }
  const c = pick(FILL_CHOICES);
  return { type: "l2_fill", shape: "circle", totalParts: c.totalParts, shadeCount: c.shadeCount, fraction: c.fraction };
};

const generateL2 = (subPos: number, avoid: Set<string>): Question => {
  // subPos is 1..10
  if (subPos <= 3) return generateL2Identify(avoid);
  if (subPos <= 6) return generateL2Match(avoid);
  return generateL2Fill(avoid);
};

/* ──────────────── L3 GENERATORS ──────────────── */
const NAMES = ["Mia", "Liam", "Zara", "Jack", "Chloe", "Noah", "Aisha", "Ethan", "Ruby", "Finn"] as const;
const OBJECTS = ["pizza", "sandwich", "chocolate bar", "ribbon", "piece of paper", "cake", "piece of toast", "orange"] as const;

type L3Template = {
  fractionType: "halves" | "quarters" | "eighths";
  build: (name: string, object: string) => { text: string; inputMode: "fraction" | "whole"; acceptable: string[]; key: string };
};

const HALVES_TEMPLATES: L3Template[] = [
  {
    fractionType: "halves",
    build: (n, o) => ({
      text: `${n} cut a ${o} into 2 equal pieces and ate one piece. What fraction did ${n} eat?`,
      inputMode: "fraction",
      acceptable: ["1/2"],
      key: `halves-eat-one`,
    }),
  },
  {
    fractionType: "halves",
    build: (n, o) => ({
      text: `${n} had a ${o}. ${n} shared it equally with a friend. What fraction did each person get?`,
      inputMode: "fraction",
      acceptable: ["1/2"],
      key: `halves-share-friend`,
    }),
  },
];

const QUARTERS_TEMPLATES: L3Template[] = [
  {
    fractionType: "quarters",
    build: (n) => ({
      text: `${n} cut a pizza into 4 equal slices and ate one slice. What fraction of the pizza did ${n} eat?`,
      inputMode: "fraction",
      acceptable: ["1/4"],
      key: `quarters-pizza-one`,
    }),
  },
  {
    fractionType: "quarters",
    build: () => ({
      text: `4 friends shared a chocolate bar equally. What fraction did each friend get?`,
      inputMode: "fraction",
      acceptable: ["1/4"],
      key: `quarters-friends-share`,
    }),
  },
  {
    fractionType: "quarters",
    build: (n) => ({
      text: `${n} ate 2 slices of a pizza that was cut into 4 equal slices. What fraction did ${n} eat?`,
      inputMode: "fraction",
      acceptable: ["2/4", "1/2"],
      key: `quarters-pizza-two`,
    }),
  },
  {
    fractionType: "quarters",
    build: (n) => ({
      text: `${n} had a ribbon. ${n} cut it into 4 equal pieces and used 3 pieces for a project. What fraction did ${n} use?`,
      inputMode: "fraction",
      acceptable: ["3/4"],
      key: `quarters-ribbon-three`,
    }),
  },
];

const EIGHTHS_TEMPLATES: L3Template[] = [
  {
    fractionType: "eighths",
    build: (n) => ({
      text: `${n} cut a sandwich into 8 equal pieces and ate one piece. What fraction did ${n} eat?`,
      inputMode: "fraction",
      acceptable: ["1/8"],
      key: `eighths-sandwich-one`,
    }),
  },
  {
    fractionType: "eighths",
    build: (n) => ({
      text: `A chocolate bar was broken into 8 equal pieces. ${n} took 2 pieces. What fraction did ${n} take?`,
      inputMode: "fraction",
      acceptable: ["2/8", "1/4"],
      key: `eighths-bar-two`,
    }),
  },
  {
    fractionType: "eighths",
    build: (n) => ({
      text: `${n} folded a piece of paper in half, then in half again, then in half again. What fraction is each part?`,
      inputMode: "fraction",
      acceptable: ["1/8"],
      key: `eighths-fold-three`,
    }),
  },
];

const generateL3 = (avoid: Set<string>): L3WordQ => {
  for (let attempt = 0; attempt < 40; attempt++) {
    const useEighths = Math.random() < 0.3;
    const bucket = useEighths
      ? EIGHTHS_TEMPLATES
      : Math.random() < 0.5
        ? HALVES_TEMPLATES
        : QUARTERS_TEMPLATES;
    const tmpl = pick(bucket);
    const name = pick(NAMES);
    const object = pick(OBJECTS);
    const built = tmpl.build(name, object);
    const sig = `l3:${built.key}:${name}:${object}`;
    if (!avoid.has(sig)) {
      avoid.add(sig);
      return {
        type: "l3_word",
        text: built.text,
        inputMode: built.inputMode,
        acceptable: built.acceptable,
        fractionType: tmpl.fractionType,
        signature: sig,
      };
    }
  }
  // Fallback
  const tmpl = pick(HALVES_TEMPLATES);
  const built = tmpl.build(pick(NAMES), pick(OBJECTS));
  return {
    type: "l3_word",
    text: built.text,
    inputMode: built.inputMode,
    acceptable: built.acceptable,
    fractionType: tmpl.fractionType,
    signature: `fallback-${Math.random()}`,
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
    { n: 1, label: "Level 1", desc: "Halves 🍫", locked: false },
    { n: 2, label: "Level 2", desc: "Identify, match, fill", locked: false },
    { n: 3, label: "Level 3", desc: "Worded problems", locked: !l3Unlocked },
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

/* ──────────────── FOOD RENDERER (L1 + L2 identify/match) ──────────────── */
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

const displayedParts = (totalParts: number, taps: number): number => {
  if (totalParts === 2) return taps >= 1 ? 2 : 1;
  if (totalParts === 4) return taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
  if (totalParts === 8) return taps >= 3 ? 8 : taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
  return 1;
};

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
  const splitDone = taps >= (totalParts === 2 ? 1 : totalParts === 4 ? 2 : 3);
  const shown = displayedParts(totalParts, taps);
  const canTapShape = !splitDone && interactive && !!onTapShape;

  const wrapClass = canTapShape
    ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
    : "";

  return (
    <div
      role={canTapShape ? "button" : undefined}
      onClick={() => canTapShape && onTapShape?.()}
      className={wrapClass}
      style={{ background: "transparent", border: "none", padding: 0, display: "inline-block" }}
    >
      {shape === "pizza" ? (
        <Pizza
          size={size === "small" ? 116 : 220}
          slices={shown}
          shaded={splitDone ? shaded : []}
          onSliceTap={interactive && splitDone ? onTapPart : undefined}
        />
      ) : (
        <ChocolateBar
          width={size === "small" ? 148 : 280}
          height={size === "small" ? 64 : 120}
          segments={shown}
          shaded={splitDone ? shaded : []}
          onSegmentTap={interactive && splitDone ? onTapPart : undefined}
        />
      )}
    </div>
  );
};

/* ──────────────── PLAIN GEOMETRIC SHAPE (L2 fill + match) ──────────────── */
const PlainShape = ({
  kind,
  totalParts,
  shaded,
  onTapPart,
  interactive,
  size = "normal",
}: {
  kind: PlainKind;
  totalParts: number;
  shaded: number[];
  onTapPart?: (i: number) => void;
  interactive: boolean;
  size?: "normal" | "small";
}) => {
  const isSmall = size === "small";
  if (kind === "rectangle") {
    const w = isSmall ? 160 : 280;
    const h = isSmall ? 64 : 110;
    const segW = w / totalParts;
    return (
      <svg width={w} height={h}>
        {Array.from({ length: totalParts }, (_, i) => (
          <rect
            key={i}
            x={i * segW + 1}
            y={1}
            width={segW - 2}
            height={h - 2}
            fill={shaded.includes(i) ? TEAL_FILL : "#FFFFFF"}
            stroke={GREY_BORDER}
            strokeWidth={1.5}
            rx={4}
            style={{
              cursor: interactive ? "pointer" : "default",
              transition: "fill 200ms ease",
            }}
            onClick={() => interactive && onTapPart?.(i)}
          />
        ))}
      </svg>
    );
  }
  // circle
  const D = isSmall ? 116 : 200;
  const r = D / 2;
  const inner = r - 2;
  return (
    <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`}>
      {totalParts === 1 ? (
        <circle
          cx={r}
          cy={r}
          r={inner}
          fill={shaded.includes(0) ? TEAL_FILL : "#FFFFFF"}
          stroke={GREY_BORDER}
          strokeWidth={1.5}
          style={{ cursor: interactive ? "pointer" : "default", transition: "fill 200ms ease" }}
          onClick={() => interactive && onTapPart?.(0)}
        />
      ) : (
        Array.from({ length: totalParts }, (_, i) => {
          const a1 = (i / totalParts) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / totalParts) * Math.PI * 2 - Math.PI / 2;
          const x1 = r + inner * Math.cos(a1);
          const y1 = r + inner * Math.sin(a1);
          const x2 = r + inner * Math.cos(a2);
          const y2 = r + inner * Math.sin(a2);
          const large = a2 - a1 > Math.PI ? 1 : 0;
          const d = `M ${r} ${r} L ${x1} ${y1} A ${inner} ${inner} 0 ${large} 1 ${x2} ${y2} Z`;
          return (
            <path
              key={i}
              d={d}
              fill={shaded.includes(i) ? TEAL_FILL : "#FFFFFF"}
              stroke={GREY_BORDER}
              strokeWidth={1.5}
              style={{ cursor: interactive ? "pointer" : "default", transition: "fill 200ms ease" }}
              onClick={() => interactive && onTapPart?.(i)}
            />
          );
        })
      )}
    </svg>
  );
};

const AnyShapeRenderer = ({
  shape,
  totalParts,
  shaded,
  onTapPart,
  interactive,
  size = "normal",
}: {
  shape: AnyShape;
  totalParts: number;
  shaded: number[];
  onTapPart?: (i: number) => void;
  interactive: boolean;
  size?: "normal" | "small";
}) => {
  if (shape === "pizza" || shape === "bar") {
    const tapsForFull = totalParts === 2 ? 1 : totalParts === 4 ? 2 : 3;
    return (
      <ShapeRenderer
        shape={shape}
        totalParts={totalParts}
        taps={tapsForFull}
        shaded={shaded}
        onTapPart={onTapPart}
        interactive={interactive}
        size={size}
      />
    );
  }
  return (
    <PlainShape
      kind={shape}
      totalParts={totalParts}
      shaded={shaded}
      onTapPart={onTapPart}
      interactive={interactive}
      size={size}
    />
  );
};

/* ──────────────── CHIP ROWS (L1) ──────────────── */
const ChipRow = <T extends string | number>({
  options,
  value,
  onChange,
  label,
  active = false,
  pulse = false,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
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
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          onClick={() => onChange(o)}
          className="rounded-xl border shadow-sm px-5 py-2.5 text-base font-semibold transition-all hover:bg-[#F5FBF8] hover:border-[#1D9E75]/40 active:scale-95"
          style={{
            backgroundColor: value === o ? TEAL_LIGHT : "#FFFFFF",
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

/* ──────────────── L1 SHADE CARD (unchanged) ──────────────── */
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

  const isPizza = q.shape === "pizza";
  const unitWord = isPizza ? "slices" : "pieces";
  const verbWord = isPizza ? "slice" : "break";
  const objectWord = isPizza ? "pizza" : "bar";

  const splitPrompt = `Tap the ${objectWord} to ${verbWord} it into ${q.totalParts} equal ${unitWord}.`;
  const takePrompt = isPizza
    ? "Now tap a slice to take it."
    : "Now tap a piece to take it.";

  const correctMessage =
    level === 1
      ? "Equal pieces — perfect sharing!"
      : level === 2
        ? "Four equal pieces — that's quarters!"
        : "You're thinking in equal parts like a mathematician.";

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
          {splitPrompt}
          {q.taps > 1 && (
            <span className="block text-sm mt-1">({taps} / {q.taps} taps)</span>
          )}
        </p>
      )}

      {splitDone && !shadeDone && (
        <p className="mt-6 text-center text-base font-medium text-muted-foreground animate-fade-in">
          {takePrompt}
        </p>
      )}

      {shadeDone && !done && (
        <div className="mt-6 space-y-5 animate-fade-in">
          <p className="text-center text-base text-foreground">
            I took ___ out of ___ equal {unitWord} = ___
          </p>
          <ChipRow<number>
            label={`How many did you take?`}
            options={shadeOptions}
            value={shadeChip}
            onChange={setShadeChip}
            active={shadeChip === null}
            pulse={shadeChip === null}
          />
          <ChipRow<number>
            label={`How many equal ${unitWord} are there?`}
            options={partsOptions}
            value={partsChip}
            onChange={setPartsChip}
            active={shadeChip !== null && partsChip === null}
          />
          <ChipRow<string>
            label="Which fraction is it?"
            options={fractionOptions}
            value={fractionChip}
            onChange={setFractionChip}
            active={partsChip !== null && fractionChip === null}
          />

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

/* ──────────────── L2 IDENTIFY CARD ──────────────── */
const L2IdentifyCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: L2IdentifyQ;
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
      setHint("Look carefully — are all the parts equal? How many parts are there?");
    }
  };

  const noun = q.options[0]?.shape === "pizza" ? "pizza" : "chocolate bar";

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={2}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-center text-lg font-semibold text-foreground" style={{ paddingRight: 80 }}>
        Which {noun} shows {q.fraction}?
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {q.options.map((opt, i) => {
          const isCorrect = done && i === q.correctIndex;
          const isWrong = picked === i && i !== q.correctIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handlePick(i)}
              disabled={done}
              className="rounded-2xl border-2 p-3 transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: isCorrect ? TEAL : isWrong ? "hsl(var(--destructive))" : GREY_BORDER,
                backgroundColor: isCorrect ? TEAL_LIGHT : "#FFFFFF",
              }}
            >
              <ShapeRenderer
                shape={opt.shape}
                totalParts={opt.totalParts}
                taps={opt.totalParts === 2 ? 1 : opt.totalParts === 4 ? 2 : 3}
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
            Yes — that one shows {q.fraction}.
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

/* ──────────────── L2 MATCH CARD ──────────────── */
const L2MatchCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: L2MatchQ;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, FractionStr>>({});
  const [shake, setShake] = useState<{ shapeId: string; label: FractionStr } | null>(null);
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const matchedLabels = Object.values(matched);
  const allDone = Object.keys(matched).length === q.items.length;

  useEffect(() => {
    if (allDone && !done) {
      setDone(true);
    }
  }, [allDone, done]);

  const handleShapeTap = (id: string) => {
    if (done || matched[id]) return;
    setSelectedShape(id === selectedShape ? null : id);
  };

  const handleLabelTap = (label: FractionStr) => {
    if (done || !selectedShape || matchedLabels.includes(label)) return;
    const item = q.items.find((it) => it.id === selectedShape);
    if (!item) return;
    if (item.fraction === label) {
      setMatched((m) => ({ ...m, [selectedShape]: label }));
      setSelectedShape(null);
    } else {
      setHadWrong(true);
      setShake({ shapeId: selectedShape, label });
      setTimeout(() => setShake(null), 400);
      setSelectedShape(null);
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={2}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-center text-lg font-semibold text-foreground" style={{ paddingRight: 80 }}>
        Match each shape to its fraction.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col gap-3">
          {q.items.map((it) => {
            const isMatched = !!matched[it.id];
            const isSelected = selectedShape === it.id;
            const isShake = shake?.shapeId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => handleShapeTap(it.id)}
                disabled={done || isMatched}
                className="rounded-xl border-2 p-2 transition-all flex justify-center"
                style={{
                  borderColor: isMatched ? TEAL : isSelected ? TEAL : GREY_BORDER,
                  backgroundColor: isMatched || isSelected ? TEAL_LIGHT : "#FFFFFF",
                  animation: isShake ? "matchShake 0.4s ease" : undefined,
                  opacity: isMatched ? 0.85 : 1,
                  cursor: isMatched ? "default" : "pointer",
                }}
              >
                <AnyShapeRenderer
                  shape={it.shape}
                  totalParts={it.totalParts}
                  shaded={it.shadedIndices}
                  interactive={false}
                  size="small"
                />
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {q.labels.map((label) => {
            const isUsed = matchedLabels.includes(label);
            const isShake = shake?.label === label;
            return (
              <button
                key={label}
                onClick={() => handleLabelTap(label)}
                disabled={done || isUsed || !selectedShape}
                className="rounded-xl border-2 px-4 py-4 text-2xl font-bold transition-all"
                style={{
                  borderColor: isUsed ? TEAL : GREY_BORDER,
                  backgroundColor: isUsed ? TEAL_LIGHT : "#FFFFFF",
                  color: LABEL,
                  animation: isShake ? "matchShake 0.4s ease" : undefined,
                  opacity: isUsed ? 0.6 : selectedShape ? 1 : 0.7,
                  cursor: isUsed || !selectedShape ? "default" : "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            Perfect matching!
          </div>
          <button
            onClick={() => onCorrect(hadWrong)}
            className="w-full rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next Question
          </button>
        </div>
      )}

      <style>{`
        @keyframes matchShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
        }
      `}</style>
    </div>
  );
};

/* ──────────────── L2 FILL CARD ──────────────── */
const L2FillCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: L2FillQ;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [shaded, setShaded] = useState<number[]>([]);
  const [hint, setHint] = useState("");
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const shapeWord = q.shape;

  const togglePart = (i: number) => {
    if (done) return;
    setHint("");
    setShaded((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  };

  const check = () => {
    if (shaded.length === q.shadeCount) {
      setDone(true);
      setHint("");
    } else {
      setHadWrong(true);
      setHint("Count the equal parts first — how many do you need to shade?");
    }
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={2}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-center text-lg font-semibold text-foreground" style={{ paddingRight: 80 }}>
        Shade {q.fraction} of this {shapeWord}.
      </p>

      <div className="mt-6 flex justify-center">
        <PlainShape
          kind={q.shape}
          totalParts={q.totalParts}
          shaded={shaded}
          onTapPart={togglePart}
          interactive={!done}
        />
      </div>

      {hint && !done && (
        <p className="mt-5 text-center text-base font-medium text-destructive animate-fade-in">{hint}</p>
      )}

      {!done && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={check}
            disabled={shaded.length === 0}
            className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        </div>
      )}

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            Yes! You shaded {q.fraction} of the {shapeWord}.
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

/* ──────────────── L3 WORD CARD ──────────────── */
const normaliseAnswer = (s: string): string => {
  return s.trim().replace(/\s+/g, "").toLowerCase();
};

const L3WordCard = ({
  q,
  consecutiveCorrect,
  consecutiveWrong,
  onCorrect,
  hintKey,
}: {
  q: L3WordQ;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  onCorrect: (hadWrong: boolean) => void;
  hintKey: number;
}) => {
  const [num, setNum] = useState("");
  const [den, setDen] = useState("");
  const [whole, setWhole] = useState("");
  const [hint, setHint] = useState("");
  const [done, setDone] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);

  const check = () => {
    let candidate = "";
    if (num && den) candidate = `${num.trim()}/${den.trim()}`;
    else if (whole) candidate = whole.trim();
    else if (num && !den) candidate = num.trim();

    const normalised = normaliseAnswer(candidate);
    const ok = q.acceptable.some((a) => normaliseAnswer(a) === normalised);
    if (ok) {
      setDone(true);
      setHint("");
    } else {
      setHadWrong(true);
      setHint(
        "Read the problem again carefully. How many equal parts are there altogether? That's your bottom number.",
      );
    }
  };

  const correctMsg =
    q.fractionType === "halves"
      ? "That's right — equal sharing means each person gets one half."
      : q.fractionType === "quarters"
        ? "Correct! When something is cut into 4 equal pieces, each piece is one quarter."
        : "Great thinking! Folding or cutting three times makes eighths.";

  return (
    <div className="relative mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <PractiseHintButton
        strategy="halvesQuartersEighths"
        level={3}
        consecutiveCorrect={consecutiveCorrect}
        consecutiveWrong={consecutiveWrong}
        hintKey={hintKey}
      />

      <p className="mt-6 text-base sm:text-lg leading-relaxed text-foreground" style={{ paddingRight: 80 }}>
        {q.text}
      </p>

      {!done && (
        <div className="mt-6 flex flex-col items-center gap-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">Type your answer as a fraction:</p>
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="w-20 rounded-md border-2 px-3 py-2 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: GREY_BORDER, color: LABEL }}
              placeholder=""
              aria-label="Numerator"
            />
            <div style={{ width: 88, height: 2, backgroundColor: LABEL, margin: "6px 0" }} />
            <input
              type="text"
              inputMode="numeric"
              value={den}
              onChange={(e) => setDen(e.target.value)}
              className="w-20 rounded-md border-2 px-3 py-2 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: GREY_BORDER, color: LABEL }}
              placeholder=""
              aria-label="Denominator"
            />
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Or, if the answer is a whole:
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={whole}
            onChange={(e) => setWhole(e.target.value)}
            className="w-24 rounded-md border-2 px-3 py-2 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ borderColor: GREY_BORDER, color: LABEL }}
            placeholder="whole"
            aria-label="Whole number answer"
          />

          {hint && (
            <p className="text-center text-base font-medium text-destructive animate-fade-in">
              {hint}
            </p>
          )}

          <button
            onClick={check}
            disabled={!num && !whole}
            className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        </div>
      )}

      {done && (
        <div className="mt-6 space-y-4 text-center animate-fade-in">
          <div className="rounded-xl bg-secondary p-4 font-medium text-secondary-foreground">
            {correctMsg}
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
  const [questionNum, setQuestionNum] = useState(1);
  const [l1Streak, setL1Streak] = useState(0);
  const [l2Streak, setL2Streak] = useState(0);
  const [l3Unlocked, setL3Unlocked] = useState(false);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [showL2PromoBanner, setShowL2PromoBanner] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  // Per-level "no repeats this session" memory.
  const seenL2 = useRef<Set<string>>(new Set());
  const seenL3 = useRef<Set<string>>(new Set());

  const genFor = useCallback((lvl: 1 | 2 | 3, qNum: number): Question => {
    if (lvl === 1) return generateL1();
    if (lvl === 2) {
      const subPos = ((qNum - 1) % 10) + 1;
      return generateL2(subPos, seenL2.current);
    }
    return generateL3(seenL3.current);
  }, []);

  const [question, setQuestion] = useState<Question>(() => genFor(1, 1));

  useEffect(() => {
    (async () => {
      const unlocked = await getLevel3Unlocked("halvesQuartersEighths");
      if (unlocked) setL3Unlocked(true);
    })();
  }, []);

  const handleLevelChange = (l: number) => {
    const lvl = l as 1 | 2 | 3;
    setLevel(lvl);
    setQuestionNum(1);
    setQuestion(genFor(lvl, 1));
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
    if (lvl !== 1) setL1Streak(0);
    if (lvl !== 2) setL2Streak(0);
    setShowL2PromoBanner(false);
  };

  const handleCorrect = (hadWrong: boolean) => {
    if (hadWrong) {
      setConsecutiveWrong((w) => w + 1);
      setConsecutiveCorrect(0);
    } else {
      setConsecutiveCorrect((c) => c + 1);
      setConsecutiveWrong(0);
    }

    if (level === 1) {
      if (!hadWrong) {
        const newStreak = l1Streak + 1;
        setL1Streak(newStreak);
        if (newStreak >= 5) {
          setL1Streak(0);
          setShowL2PromoBanner(true);
          setLevel(2);
          setQuestionNum(1);
          setQuestion(genFor(2, 1));
          setConsecutiveCorrect(0);
          setConsecutiveWrong(0);
          return;
        }
      } else {
        setL1Streak(0);
      }
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
    setQuestion(genFor(level, nextNum));
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

        {showL2PromoBanner && (
          <div className="mt-4 rounded-xl border-2 border-primary bg-secondary p-4 text-center animate-fade-in">
            <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Nice work — 5 in a row! 🎉
            </p>
            <p className="mt-1 text-muted-foreground">
              You're ready for Level 2.
            </p>
            <div className="mt-3">
              <button
                onClick={() => setShowL2PromoBanner(false)}
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Let's go
              </button>
            </div>
          </div>
        )}

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

        {/* ProgressIndicator: Practise mode, 10-question batches, resets when level changes */}
        <ProgressIndicator
          mode="practise"
          level={level}
          current={((questionNum - 1) % 10) + 1}
          total={10}
        />
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
        {question.type === "l2_identify" && (
          <L2IdentifyCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
        {question.type === "l2_match" && (
          <L2MatchCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
        {question.type === "l2_fill" && (
          <L2FillCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
        {question.type === "l3_word" && (
          <L3WordCard
            key={`${level}-${questionNum}`}
            q={question}
            consecutiveCorrect={consecutiveCorrect}
            consecutiveWrong={consecutiveWrong}
            onCorrect={handleCorrect}
            hintKey={questionNum}
          />
        )}
      </div>
      <ParentSignpost strategy="halvesQuartersEighths" />
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
