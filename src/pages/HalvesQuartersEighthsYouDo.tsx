import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { setLearnComplete } from "@/lib/progress";
import CurriculumBadge from "@/components/CurriculumBadge";
import { Pizza, ChocolateBar } from "@/components/FractionFood";

const TEAL = "#1D9E75";
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
type FoodKind = "pizza" | "chocolate";

interface ShadeQuestion {
  type: "shade";
  id: string;
  food: FoodKind;
  taps: number; // splits required
  totalParts: number;
  shadeCount: number;
  fraction: string;
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

const unitFor = (food: FoodKind, plural = true) =>
  food === "pizza" ? (plural ? "slices" : "slice") : (plural ? "pieces" : "piece");

const QUESTIONS: Question[] = [
  {
    type: "shade",
    id: "q1",
    food: "pizza",
    taps: 1,
    totalParts: 2,
    shadeCount: 1,
    fraction: "1/2",
    acceptedFractions: ["1/2"],
    prompt: "Tap the pizza to slice it into 2 equal pieces. Take one slice.",
    successMessage: "Perfect — you shared it equally!",
  },
  {
    type: "shade",
    id: "q2",
    food: "chocolate",
    taps: 2,
    totalParts: 4,
    shadeCount: 1,
    fraction: "1/4",
    acceptedFractions: ["1/4"],
    prompt: "Tap the bar to break it into 4 equal pieces. Take one piece.",
    successMessage: "Perfect — you shared it equally!",
  },
  {
    type: "shade",
    id: "q3",
    food: "chocolate",
    taps: 1,
    totalParts: 2,
    shadeCount: 2,
    fraction: "2/2",
    acceptedFractions: ["2/2", "1", "1/1"],
    prompt: "Tap the bar to break it into 2 equal pieces. Take both pieces.",
    successMessage: "Perfect — you shared it equally! 2 out of 2 makes the whole bar.",
  },
  {
    type: "shade",
    id: "q4",
    food: "pizza",
    taps: 3,
    totalParts: 8,
    shadeCount: 1,
    fraction: "1/8",
    acceptedFractions: ["1/8"],
    prompt: "Tap the pizza three times to slice it into 8 equal pieces. Take one slice.",
    successMessage: "Perfect — you shared it equally!",
  },
  {
    type: "choose",
    id: "q5",
    prompt: "Which pizza shows quarters?",
    options: [
      { label: "A", parts: 2 },
      { label: "B", parts: 4 },
    ],
    correctParts: 4,
    successMessage: "Yes! 4 equal slices = quarters.",
    wrongHint: "Count the slices on each pizza — which one has 4?",
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
        ) : (
          <>
            {/* ProgressIndicator: Learn / You Do phase, wired to qIndex / queue.length */}
            <ProgressIndicator mode="learn" phase="youDo" current={qIndex + 1} total={queue.length} />
            {queue[qIndex].type === "shade" ? (
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
          </>
        )}
      </div>
      <ParentSignpost strategy="halvesQuartersEighths" />
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
  const unitS = unitFor(spec.food, true);
  const unit1 = unitFor(spec.food, false);

  const handleTapWhole = () => {
    if (!splitDone) setTaps((n) => n + 1);
  };

  const handleTapPart = (idx: number) => {
    if (!splitDone || shadeDone || correct) return;
    if (shaded.includes(idx)) return;
    setShaded((s) => [...s, idx]);
  };

  const fractionOptions = useMemo(() => {
    const all = ["1/2", "1/4", "1/8", "2/2"];
    return shuffle(Array.from(new Set([spec.fraction, ...all])).slice(0, 4));
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
      setHint(`Almost — count just the ${unitS} you took.`);
    } else if (!partsOk) {
      setHint(`Almost — count all the equal ${unitS} altogether.`);
    } else {
      setHint(
        `Not quite — ${spec.shadeCount} out of ${spec.totalParts} equal ${unitS}.`
      );
    }
  };

  const tryAgain = () => {
    setHint("");
    setShadeInput(null);
    setPartsInput(null);
    setFractionInput(null);
  };

  // Progressive split rendering
  const currentParts = (() => {
    if (spec.food === "pizza") {
      if (spec.totalParts === 2) return taps >= 1 ? 2 : 1;
      if (spec.totalParts === 8) return taps >= 3 ? 8 : taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
      return spec.totalParts;
    }
    // chocolate
    if (spec.totalParts === 2) return taps >= 1 ? 2 : 1;
    if (spec.totalParts === 4) return taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
    if (spec.totalParts === 8) return taps >= 3 ? 8 : taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
    return spec.totalParts;
  })();

  const tapPrompt =
    spec.food === "pizza" ? "Tap the pizza to slice it" : "Tap the bar to break it";

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Question {qNum} of {total}
      </p>

      <div className="mt-6 flex justify-center">
        <FoodCanvas
          food={spec.food}
          parts={currentParts}
          shaded={shaded}
          interactive={!correct}
          splitDone={splitDone}
          onTapWhole={handleTapWhole}
          onTapPart={handleTapPart}
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
            ? `Now tap a ${unit1} to take it.`
            : `Now tap ${spec.shadeCount} ${unitS} to take them. (${shaded.length} / ${spec.shadeCount})`}
        </p>
      )}

      {shadeDone && !correct && (
        <div className="mt-6 space-y-5 animate-fade-in">
          <p className="text-center text-base text-foreground">
            I took ___ out of ___ equal {unitS} = ___
          </p>

          <ChipRow
            label={`How many ${unitS} did you take?`}
            options={[1, 2, 3, 4]}
            value={shadeInput}
            onChange={setShadeInput}
            active={shadeInput === null}
            pulse={shadeInput === null}
          />

          <ChipRow
            label={`How many equal ${unitS} are there?`}
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

      {/* Hidden tap-prompt anchor for screen readers */}
      <span className="sr-only">{tapPrompt}</span>
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
              <Pizza size={140} slices={opt.parts} shaded={[]} cutsDrawn={true} filled={false} />
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
    style={{ boxShadow: active ? `0 0 0 2px ${TEAL}40` : "none" }}
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
    style={{ boxShadow: active ? `0 0 0 2px ${TEAL}40` : "none" }}
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

/* ──────────────── FOOD CANVAS ──────────────── */
const FoodCanvas = ({
  food,
  parts,
  shaded,
  interactive,
  splitDone,
  onTapWhole,
  onTapPart,
}: {
  food: FoodKind;
  parts: number;
  shaded: number[];
  interactive: boolean;
  splitDone: boolean;
  onTapWhole: () => void;
  onTapPart: (idx: number) => void;
}) => {
  // Before split: wrap in a tap-anywhere button.
  if (!splitDone) {
    return (
      <button
        type="button"
        onClick={onTapWhole}
        disabled={!interactive}
        aria-label={food === "pizza" ? "Tap the pizza to slice it" : "Tap the bar to break it"}
        className={interactive ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : "cursor-default"}
        style={{ background: "transparent", border: "none", padding: 0 }}
      >
        {food === "pizza" ? (
          <Pizza size={240} slices={parts} shaded={[]} cutsDrawn={true} filled={false} />
        ) : (
          <ChocolateBar width={320} height={120} segments={parts} shaded={[]} breaksDrawn={true} filled={false} />
        )}
      </button>
    );
  }

  // After split: enable per-piece tap-to-shade.
  return food === "pizza" ? (
    <Pizza
      size={240}
      slices={parts}
      shaded={shaded}
      cutsDrawn={true}
      filled={true}
      onSliceTap={interactive ? onTapPart : undefined}
    />
  ) : (
    <ChocolateBar
      width={320}
      height={120}
      segments={parts}
      shaded={shaded}
      breaksDrawn={true}
      filled={true}
      onSegmentTap={interactive ? onTapPart : undefined}
    />
  );
};

export default HalvesQuartersEighthsYouDo;
