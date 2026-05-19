import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
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

type FoodKind = "halfBar" | "quarterPizza" | "eighthBar";

interface QSpec {
  kind: FoodKind;
  totalParts: number;
  partName: string;
  acceptedFraction: string;
  taps: number;
  unit: "piece" | "slice";
  setupMessage: string;
  computerMessage: string;
  promptMessage: string;
  successMessage: string;
  wrongHint: string;
}

const NOAH_WRONG_HINT =
  "Count the pieces carefully — how many equal parts did Noah end up with?";

const QUESTIONS: QSpec[] = [
  {
    kind: "halfBar",
    totalParts: 2,
    partName: "one half",
    acceptedFraction: "1/2",
    taps: 1,
    unit: "piece",
    setupMessage:
      "Noah had a chocolate bar. He broke it into equal pieces to share with his sister.",
    computerMessage:
      "I broke Noah's bar into 2 equal pieces. Each piece is one half.",
    promptMessage: "Tap the bar to break it.",
    successMessage:
      "That's right — Noah and his sister each get one half!",
    wrongHint: NOAH_WRONG_HINT,
  },
  {
    kind: "quarterPizza",
    totalParts: 4,
    partName: "one quarter",
    acceptedFraction: "1/4",
    taps: 2,
    unit: "slice",
    setupMessage:
      "Noah had a pizza. He sliced it equally for himself and 3 classmates.",
    computerMessage:
      "I sliced Noah's pizza in half, then in half again — 4 equal slices. Each slice is one quarter.",
    promptMessage: "Tap the pizza twice to slice into quarters.",
    successMessage:
      "Yes! Noah and his 3 classmates each get one quarter of the pizza.",
    wrongHint: NOAH_WRONG_HINT,
  },
  {
    kind: "eighthBar",
    totalParts: 8,
    partName: "one eighth",
    acceptedFraction: "1/8",
    taps: 3,
    unit: "piece",
    setupMessage:
      "Noah had a big chocolate bar. He wanted to share it equally with 7 friends — 8 people in total.",
    computerMessage:
      "I broke Noah's bar into 8 equal pieces. Each piece is one eighth.",
    promptMessage: "Tap the bar three times to break into eighths.",
    successMessage:
      "Perfect — 8 equal pieces means each person gets one eighth!",
    wrongHint: NOAH_WRONG_HINT,
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

        {!finished && (
          <>
            {/* ProgressIndicator inserted directly — move into shared QuestionCard wrapper when refactor occurs. */}
            <ProgressIndicator mode="learn" phase="wedo" current={qIndex + 1} total={QUESTIONS.length} />
          </>
        )}

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
      <ParentSignpost strategy="halvesQuartersEighths" />
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
  const [computerTaps, setComputerTaps] = useState(0);
  const [computerFilled, setComputerFilled] = useState(false);
  const [computerDone, setComputerDone] = useState(false);

  const [childTaps, setChildTaps] = useState(0);
  const [partsChoice, setPartsChoice] = useState<number | null>(null);
  const [nameChoice, setNameChoice] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [childCorrect, setChildCorrect] = useState(false);

  const partsOptions = [2, 4, 8];
  const nameOptions = [
    { name: "one half", fraction: "1/2" },
    { name: "one quarter", fraction: "1/4" },
    { name: "one eighth", fraction: "1/8" },
  ];

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
    const partsOk = partsChoice === spec.totalParts;
    const nameOk = nameChoice === spec.partName;
    if (partsOk && nameOk) {
      setChildCorrect(true);
      setHint("");
    } else {
      setHint(spec.wrongHint);
    }
  };

  const chipStyle = (selected: boolean): React.CSSProperties => ({
    backgroundColor: selected ? "#E1F5EE" : "#FFFFFF",
    borderColor: selected ? TEAL : GREY_BORDER,
    borderWidth: selected ? 2 : 1,
    color: LABEL,
    minHeight: 44,
  });

  const unitPlural = spec.unit === "slice" ? "slices" : "pieces";
  const aria =
    spec.kind === "quarterPizza" ? "Tap the pizza to slice it" : "Tap the bar to break it";

  return (
    <div className="mt-8 space-y-6">
      {/* Computer card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-center text-lg font-semibold text-foreground">
          <span className="text-muted-foreground">Question {qNum}: </span>
          My turn
        </p>
        <div className="mt-6 flex justify-center">
          <FoodSVG kind={spec.kind} taps={computerTaps} filled={computerFilled} />
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
              aria-label={aria}
              className={
                childTaps < spec.taps
                  ? "cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  : "cursor-default"
              }
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <FoodSVG kind={spec.kind} taps={childTaps} filled={childCorrect} />
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
            <div className="mt-6 space-y-5 animate-fade-in">
              <div className="flex flex-col items-center gap-2">
                <p className="text-base text-foreground">
                  There are ___ equal {unitPlural}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {partsOptions.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPartsChoice(n)}
                      className="rounded-xl border px-5 py-2.5 text-lg font-bold transition-all hover:bg-[#F5FBF8]"
                      style={chipStyle(partsChoice === n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-base text-foreground">
                  Each {spec.unit} is called ___
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {nameOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setNameChoice(opt.name)}
                      className="rounded-xl border px-5 py-2.5 text-base font-semibold transition-all hover:bg-[#F5FBF8]"
                      style={chipStyle(nameChoice === opt.name)}
                    >
                      {opt.name} ({opt.fraction})
                    </button>
                  ))}
                </div>
              </div>

              {hint && (
                <p className="text-center text-base font-medium text-destructive animate-fade-in">
                  {hint}
                </p>
              )}

              <div className="text-center">
                <button
                  onClick={handleCheck}
                  disabled={partsChoice === null || nameChoice === null}
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

/* ──────────────── FOOD RENDERER ──────────────── */
const FoodSVG = ({
  kind,
  taps,
  filled,
}: {
  kind: FoodKind;
  taps: number;
  filled: boolean;
}) => {
  if (kind === "halfBar") {
    return (
      <ChocolateBar
        width={280}
        height={120}
        segments={2}
        shaded={[0]}
        breaksDrawn={taps >= 1}
        filled={filled}
      />
    );
  }

  if (kind === "quarterPizza") {
    // 1 tap → halves, 2 taps → quarters
    const slices = taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
    return (
      <Pizza
        size={240}
        slices={slices}
        shaded={filled ? [0] : []}
        cutsDrawn={true}
        filled={filled}
      />
    );
  }

  // eighthBar: 1 tap → 2, 2 taps → 4, 3 taps → 8
  const segments = taps >= 3 ? 8 : taps >= 2 ? 4 : taps >= 1 ? 2 : 1;
  return (
    <ChocolateBar
      width={320}
      height={110}
      segments={segments}
      shaded={[0]}
      breaksDrawn={true}
      filled={filled}
    />
  );
};

export default HalvesQuartersEighthsWeDo;
