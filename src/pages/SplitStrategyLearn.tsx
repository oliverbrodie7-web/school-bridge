import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import ParentSignpost from "@/components/ParentSignpost";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import CurriculumBadge, { AC9M2N04_PROPS } from "@/components/CurriculumBadge";
import { Coach, CoachExpression } from "@/components/Coach";

const TEAL = "#1D9E75";
const TEAL_DARK = "#0F6E56";
const BLUE = "#3B82F6";
const ORANGE = "#F97316";

const EXAMPLES = [
  { a: 34, b: 12 },
  { a: 53, b: 25 },
];

const STEP_MS = 900;
const FLY_MS = 620;

const tensOf = (n: number) => Math.floor(n / 10) * 10;
const onesOf = (n: number) => n % 10;
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rodVisual: React.CSSProperties = {
  borderRadius: 3,
  background: BLUE,
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0 5.2px, rgba(255,255,255,0.5) 5.2px 6px)",
  boxShadow: "0 2px 4px rgba(59,130,246,0.35)",
};
const cubeVisual: React.CSSProperties = {
  borderRadius: 3,
  background: ORANGE,
  boxShadow: "0 2px 4px rgba(245,158,11,0.35)",
};

type Phase =
  | "breakA" | "countingA"
  | "breakB" | "countingB"
  | "combineTens" | "combiningT"
  | "combineOnes" | "combiningO"
  | "done";

interface Flyer {
  id: string;
  kind: "rod" | "cube";
  left: number;
  top: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
}

const SplitStrategyLearn = () => {
  const [exIndex, setExIndex] = useState(0);
  const isLast = exIndex === EXAMPLES.length - 1;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl">
        <Link
          to="/split-strategy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="relative mt-6">
          <div className="flex justify-end mb-3 -mr-4 sm:-mr-10">
            <CurriculumBadge {...AC9M2N04_PROPS} pageName="Split Strategy Learn" />
          </div>
          <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
            Split Strategy — I Do
          </h1>
          <p className="mt-2 text-center text-muted-foreground">Watch how the split strategy works.</p>
        </div>

        <ProgressIndicator mode="learn" phase="ido" current={exIndex + 1} total={EXAMPLES.length} />

        <ExampleCard
          key={exIndex}
          example={EXAMPLES[exIndex]}
          isLast={isLast}
          onNext={() => setExIndex((i) => i + 1)}
        />
      </div>
      <ParentSignpost strategy="split" />
    </div>
  );
};

const Rod = ({ dim }: { dim?: boolean }) => (
  <div style={{ width: 13, height: 60, ...rodVisual, opacity: dim ? 0.38 : 1, transition: "opacity 0.2s" }} />
);
const Cube = ({ dim }: { dim?: boolean }) => (
  <div style={{ width: 14, height: 14, ...cubeVisual, opacity: dim ? 0.38 : 1, transition: "opacity 0.2s" }} />
);

const Pile = ({
  count,
  kind,
  litCount,
  pileRef,
  hidden,
}: {
  count: number;
  kind: "rod" | "cube";
  litCount: number;
  pileRef?: React.Ref<HTMLDivElement>;
  hidden?: boolean;
}) => (
  <div
    ref={pileRef}
    style={{
      flex: 1,
      display: "flex",
      flexWrap: "wrap",
      gap: 5,
      alignContent: "flex-start",
      justifyContent: "center",
      opacity: hidden ? 0 : 1,
    }}
  >
    {Array.from({ length: count }).map((_, i) =>
      kind === "rod" ? (
        <Rod key={i} dim={litCount > 0 && i >= litCount} />
      ) : (
        <Cube key={i} dim={litCount > 0 && i >= litCount} />
      )
    )}
  </div>
);

const Chip = ({ value, kind }: { value: number; kind: "t" | "o" }) => (
  <div
    style={{
      fontWeight: 900,
      fontSize: 15,
      color: "#fff",
      borderRadius: 8,
      padding: "2px 11px",
      background: kind === "t" ? BLUE : ORANGE,
    }}
  >
    {value}
  </div>
);

const NumTile = ({
  value,
  full,
  cue,
  onTap,
}: {
  value: number;
  full?: boolean;
  cue?: boolean;
  onTap?: () => void;
}) => (
  <button
    onClick={onTap}
    disabled={!onTap}
    style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      position: "relative",
      overflow: "hidden",
      display: "grid",
      placeItems: "center",
      border: "none",
      cursor: onTap ? "pointer" : "default",
      boxShadow: "0 5px 12px rgba(40,40,60,0.14)",
      background: full
        ? `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)`
        : "linear-gradient(to right, #93C5FD 50%, #FDBA8C 50%)",
      animation: cue ? "coachpulse 1.4s ease-out infinite" : undefined,
    }}
  >
    <span
      style={{
        position: "relative",
        zIndex: 1,
        color: "#fff",
        fontWeight: 900,
        fontSize: 20,
        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      {value}
    </span>
  </button>
);

const ExampleCard = ({
  example,
  isLast,
  onNext,
}: {
  example: { a: number; b: number };
  isLast: boolean;
  onNext: () => void;
}) => {
  const a = Math.max(example.a, example.b);
  const b = Math.min(example.a, example.b);
  const tA = tensOf(a), oA = onesOf(a), tB = tensOf(b), oB = onesOf(b);
  const tSum = tA + tB, oSum = oA + oB, total = a + b;

  const [phase, setPhase] = useState<Phase>("breakA");
  const [aBroken, setABroken] = useState(false);
  const [bBroken, setBBroken] = useState(false);
  const [aTensLit, setATensLit] = useState(0);
  const [aOnesLit, setAOnesLit] = useState(0);
  const [bTensLit, setBTensLit] = useState(0);
  const [bOnesLit, setBOnesLit] = useState(0);
  const [aChips, setAChips] = useState(false);
  const [bChips, setBChips] = useState(false);

  const [tSourceHidden, setTSourceHidden] = useState(false);
  const [oSourceHidden, setOSourceHidden] = useState(false);
  const [tCombined, setTCombined] = useState(false);
  const [tLit, setTLit] = useState(0);
  const [tChip, setTChip] = useState(false);
  const [oCombined, setOCombined] = useState(false);
  const [oLit, setOLit] = useState(0);
  const [oChip, setOChip] = useState(false);

  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [flyGo, setFlyGo] = useState(false);

  const [coachExpr, setCoachExpr] = useState<CoachExpression>("neutral");
  const [coachMsg, setCoachMsg] = useState(`Let's add ${a} and ${b}! Tap ${a} to start.`);

  const cardRef = useRef<HTMLDivElement>(null);
  const aTensRef = useRef<HTMLDivElement>(null);
  const bTensRef = useRef<HTMLDivElement>(null);
  const aOnesRef = useRef<HTMLDivElement>(null);
  const bOnesRef = useRef<HTMLDivElement>(null);
  const tTensCellRef = useRef<HTMLDivElement>(null);
  const tOnesCellRef = useRef<HTMLDivElement>(null);

  const timers = useRef<number[]>([]);
  const addT = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
  }, []);

  const countSeq = useCallback(
    (n: number, setLit: (v: number) => void, after: () => void) => {
      if (prefersReduced()) {
        setLit(n);
        after();
        return;
      }
      let i = 0;
      const tick = () => {
        i += 1;
        setLit(i);
        if (i < n) addT(tick, STEP_MS);
        else addT(after, STEP_MS);
      };
      addT(tick, STEP_MS);
    },
    [addT]
  );

  const tapA = () => {
    if (phase !== "breakA") return;
    setPhase("countingA");
    setABroken(true);
    setCoachExpr("pleased");
    setCoachMsg("Count the tens with me…");
    countSeq(tA / 10, setATensLit, () => {
      setCoachMsg("…and the ones.");
      countSeq(oA, setAOnesLit, () => {
        setAChips(true);
        setCoachExpr("neutral");
        setCoachMsg(`Good! Now tap ${b}.`);
        setPhase("breakB");
      });
    });
  };

  const tapB = () => {
    if (phase !== "breakB") return;
    setPhase("countingB");
    setBBroken(true);
    setCoachExpr("pleased");
    setCoachMsg("Count the tens…");
    countSeq(tB / 10, setBTensLit, () => {
      setCoachMsg("…and the ones.");
      countSeq(oB, setBOnesLit, () => {
        setBChips(true);
        setCoachExpr("neutral");
        setCoachMsg("Now put ALL the tens together!");
        setPhase("combineTens");
      });
    });
  };

  // Measure source blocks + a target cell, build flyers that converge into the cell.
  const buildFlyers = (
    idPrefix: string,
    kind: "rod" | "cube",
    srcPiles: (HTMLDivElement | null)[],
    targetCell: HTMLDivElement | null
  ): Flyer[] | null => {
    const cont = cardRef.current;
    if (!cont || !targetCell) return null;
    const els: HTMLElement[] = [];
    srcPiles.forEach((p) => {
      if (p) els.push(...(Array.from(p.children) as HTMLElement[]));
    });
    if (els.length === 0) return null;
    const cr = cont.getBoundingClientRect();
    const tcr = targetCell.getBoundingClientRect();
    const targetCX = tcr.left - cr.left + tcr.width / 2;
    const targetCY = tcr.top - cr.top + tcr.height / 2;
    const n = els.length;
    return els.map((el, i) => {
      const r = el.getBoundingClientRect();
      const left = r.left - cr.left;
      const top = r.top - cr.top;
      return {
        id: idPrefix + i,
        kind,
        left,
        top,
        w: r.width,
        h: r.height,
        dx: targetCX - r.width / 2 - left + (i - (n - 1) / 2) * 7,
        dy: targetCY - r.height / 2 - top,
      };
    });
  };

  const afterTens = () => {
    setTChip(true);
    setCoachExpr("pleased");
    setCoachMsg(`${tA / 10} tens and ${tB / 10} tens — that's ${tSum}!`);
    addT(() => {
      setCoachExpr("neutral");
      setCoachMsg("Now put all the ones together.");
      setPhase("combineOnes");
    }, 1100);
  };

  const afterOnes = () => {
    setOChip(true);
    setCoachExpr("pleased");
    setCoachMsg(`${tSum} and ${oSum}… that's ${total}!`);
    setPhase("done");
  };

  const combineTens = () => {
    if (phase !== "combineTens") return;
    setPhase("combiningT");
    const fl = prefersReduced()
      ? null
      : buildFlyers("t", "rod", [aTensRef.current, bTensRef.current], tTensCellRef.current);
    setTSourceHidden(true);
    if (!fl) {
      setTCombined(true);
      setCoachMsg("Count all the tens together…");
      countSeq(tSum / 10, setTLit, afterTens);
      return;
    }
    setFlyers(fl);
    setFlyGo(false);
    setCoachMsg("Watch the tens come together…");
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyGo(true)));
    addT(() => {
      setFlyers([]);
      setFlyGo(false);
      setTCombined(true);
      setCoachMsg("Count all the tens together…");
      countSeq(tSum / 10, setTLit, afterTens);
    }, FLY_MS + 100);
  };

  const combineOnes = () => {
    if (phase !== "combineOnes") return;
    setPhase("combiningO");
    const fl = prefersReduced()
      ? null
      : buildFlyers("o", "cube", [aOnesRef.current, bOnesRef.current], tOnesCellRef.current);
    setOSourceHidden(true);
    if (!fl) {
      setOCombined(true);
      setCoachMsg("Count the ones together…");
      countSeq(oSum, setOLit, afterOnes);
      return;
    }
    setFlyers(fl);
    setFlyGo(false);
    setCoachMsg("Watch the ones come together…");
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyGo(true)));
    addT(() => {
      setFlyers([]);
      setFlyGo(false);
      setOCombined(true);
      setCoachMsg("Count the ones together…");
      countSeq(oSum, setOLit, afterOnes);
    }, FLY_MS + 100);
  };

  const cell = (children: React.ReactNode, glow: boolean, cref?: React.Ref<HTMLDivElement>) => (
    <div
      ref={cref}
      style={{
        background: "#FCFAF4",
        border: `1.5px ${glow ? "solid" : "dashed"} ${glow ? TEAL : "#E8E0D4"}`,
        borderRadius: 11,
        padding: 8,
        minHeight: 92,
        display: "flex",
        flexDirection: "column",
        boxShadow: glow ? "0 0 0 3px #E1F5EE" : "none",
        transition: "box-shadow .3s, border-color .3s",
      }}
    >
      {children}
    </div>
  );

  const chipSlot = (show: boolean, value: number, kind: "t" | "o") => (
    <div style={{ minHeight: 26, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 4 }}>
      {show && <Chip value={value} kind={kind} />}
    </div>
  );

  const tGlow = phase === "combiningT";
  const oGlow = phase === "combiningO";

  return (
    <div ref={cardRef} className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8" style={{ position: "relative" }}>
      <style>{`
        @keyframes coachpulse {0%{box-shadow:0 0 0 0 rgba(46,157,142,.5)}70%{box-shadow:0 0 0 13px rgba(46,157,142,0)}100%{box-shadow:0 0 0 0 rgba(46,157,142,0)}}
      `}</style>

      <p
        style={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: 25,
          color: "#1A2E1A",
          marginBottom: 18,
          fontFamily: "var(--font-heading)",
        }}
      >
        Let's add <b>{a}</b> + <b>{b}</b>
      </p>

      {/* place-value grid */}
      <div style={{ display: "grid", gridTemplateColumns: "78px 1fr 1fr", gap: "8px 10px", alignItems: "stretch" }}>
        <div />
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".5px", textAlign: "center", color: "#1D4ED8" }}>
          Tens
        </div>
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".5px", textAlign: "center", color: "#B45309" }}>
          Ones
        </div>

        {/* number A */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NumTile value={a} full cue={phase === "breakA"} onTap={phase === "breakA" ? tapA : undefined} />
        </div>
        {cell(
          <>
            {chipSlot(aChips, tA, "t")}
            {aBroken && <Pile count={tA / 10} kind="rod" litCount={aTensLit} pileRef={aTensRef} hidden={tSourceHidden} />}
          </>,
          false
        )}
        {cell(
          <>
            {chipSlot(aChips, oA, "o")}
            {aBroken && <Pile count={oA} kind="cube" litCount={aOnesLit} pileRef={aOnesRef} hidden={oSourceHidden} />}
          </>,
          false
        )}

        {/* plus, centred between the two numbers */}
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 28, color: "#3A4250", lineHeight: 1 }}>+</div>
        <div />
        <div />

        {/* number B */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NumTile value={b} cue={phase === "breakB"} onTap={phase === "breakB" ? tapB : undefined} />
        </div>
        {cell(
          <>
            {chipSlot(bChips, tB, "t")}
            {bBroken && <Pile count={tB / 10} kind="rod" litCount={bTensLit} pileRef={bTensRef} hidden={tSourceHidden} />}
          </>,
          false
        )}
        {cell(
          <>
            {chipSlot(bChips, oB, "o")}
            {bBroken && <Pile count={oB} kind="cube" litCount={bOnesLit} pileRef={bOnesRef} hidden={oSourceHidden} />}
          </>,
          false
        )}

        {/* divider */}
        <div style={{ gridColumn: "1 / -1", height: 3, background: "#1A2E1A", opacity: 0.13, borderRadius: 3, margin: "3px 0" }} />

        {/* total */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 27, color: "#3A4250" }}>=</div>
        {cell(
          <>
            {chipSlot(tChip, tSum, "t")}
            {tCombined && <Pile count={tSum / 10} kind="rod" litCount={tLit} />}
          </>,
          tGlow,
          tTensCellRef
        )}
        {cell(
          <>
            {chipSlot(oChip, oSum, "o")}
            {oCombined && <Pile count={oSum} kind="cube" litCount={oLit} />}
          </>,
          oGlow,
          tOnesCellRef
        )}
      </div>

      {/* flying blocks (tens, then ones) */}
      {flyers.map((f) => (
        <div
          key={f.id}
          aria-hidden
          style={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: f.w,
            height: f.h,
            ...(f.kind === "rod" ? rodVisual : cubeVisual),
            transform: flyGo ? `translate(${f.dx}px, ${f.dy}px)` : "translate(0px, 0px)",
            transition: `transform ${FLY_MS}ms cubic-bezier(.3,.85,.3,1)`,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* final line */}
      {phase === "done" && (
        <p style={{ textAlign: "center", fontSize: 24, fontWeight: 900, marginTop: 16, fontFamily: "var(--font-heading)" }}>
          {tSum} + {oSum} = <span style={{ color: TEAL_DARK }}>{total}</span>
        </p>
      )}

      {/* combine buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        {phase === "combineTens" && (
          <button onClick={combineTens} style={btn()}>
            Put all the tens together
          </button>
        )}
        {phase === "combineOnes" && (
          <button onClick={combineOnes} style={btn()}>
            Now all the ones together
          </button>
        )}
      </div>

      {/* Mia */}
      <div style={{ marginTop: 16 }}>
        <Coach name="mia" expression={coachExpr} message={coachMsg} />
      </div>

      {/* advance */}
      {phase === "done" && (
        <div className="mt-4 text-center animate-fade-in">
          {isLast ? (
            <Link
              to="/learn/split-strategy/we-do"
              className="inline-block rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
              style={{ background: TEAL }}
            >
              Let's try one together
            </Link>
          ) : (
            <button
              onClick={onNext}
              className="rounded-xl px-6 py-3 text-base font-medium text-white transition-colors"
              style={{ background: TEAL }}
            >
              Next Example
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const btn = (): React.CSSProperties => ({
  appearance: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 800,
  fontSize: 15,
  color: "#fff",
  background: TEAL,
  padding: "11px 22px",
  borderRadius: 999,
  boxShadow: "0 6px 14px rgba(46,157,142,0.28)",
});

export default SplitStrategyLearn;
