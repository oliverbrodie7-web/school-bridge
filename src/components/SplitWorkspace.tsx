import { useState, useEffect, useRef, useCallback } from "react";
import { Coach, CoachName, CoachExpression } from "@/components/Coach";

/* ============================================================
   SplitWorkspace — the shared Split Strategy engine.
   Place-value columns + rods/cubes + count-along + flying-combine.
   One machine; each page configures it via props ("switches").
   ============================================================ */

const TEAL = "#1D9E75";
const TEAL_DARK = "#0F6E56";
const BLUE = "#3B82F6";
const ORANGE = "#F97316";

const DEFAULT_PACE = 900;
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

export type StepMode = "demo" | "input";

export interface CoachLines {
  splitAPrompt: string;
  splitBPrompt: string;
  combineTensPrompt: string;
  combineOnesPrompt: string;
  done: string;
  retrySplit: string;
  retryTens: string;
  retryOnes: string;
}

export interface SplitWorkspaceProps {
  a: number;
  b: number;
  coach: CoachName;
  splitA?: StepMode;
  splitB?: StepMode;
  combine?: StepMode;
  pace?: number;
  lines?: Partial<CoachLines>;
  showFinalLine?: boolean;
  onComplete?: () => void;
}

type Step = "splitA" | "splitB" | "combineTens" | "combineOnes" | "done";

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

/* ── primitives ── */
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
  variant,
  cue,
  spent,
  onTap,
}: {
  value: number;
  variant: "full" | "lite";
  cue?: boolean;
  spent?: boolean;
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
      opacity: spent ? 0.92 : 1,
      background:
        variant === "full"
          ? `linear-gradient(to right, ${BLUE} 50%, ${ORANGE} 50%)`
          : "linear-gradient(to right, #93C5FD 50%, #FDBA8C 50%)",
      animation: cue ? "swpulse 1.4s ease-out infinite" : undefined,
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

const SplitBox = ({
  value,
  onChange,
  kind,
  flash,
}: {
  value: string;
  onChange: (v: string) => void;
  kind: "t" | "o";
  flash?: boolean;
}) => (
  <input
    type="number"
    inputMode="numeric"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="?"
    style={{
      width: 46,
      height: 46,
      borderRadius: 11,
      border: `2.5px solid ${flash ? "#E24B4A" : kind === "t" ? BLUE : ORANGE}`,
      textAlign: "center",
      fontSize: 20,
      fontWeight: 900,
      color: kind === "t" ? BLUE : ORANGE,
      background: "#fff",
      outline: "none",
    }}
  />
);

const SumInput = ({
  value,
  onChange,
  flash,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  flash?: boolean;
  onEnter?: () => void;
}) => (
  <input
    type="number"
    inputMode="numeric"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && value && onEnter && onEnter()}
    autoFocus
    placeholder="?"
    style={{
      width: 64,
      height: 46,
      borderRadius: 11,
      border: `2.5px solid ${flash ? "#E24B4A" : TEAL}`,
      textAlign: "center",
      fontSize: 20,
      fontWeight: 900,
      color: TEAL_DARK,
      background: "#fff",
      outline: "none",
    }}
  />
);

const heading = (txt: "Tens" | "Ones") => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: ".5px",
      textAlign: "center",
      color: txt === "Tens" ? "#1D4ED8" : "#B45309",
    }}
  >
    {txt}
  </div>
);

const chipSlotStyle: React.CSSProperties = {
  minHeight: 26,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 4,
};

const cellStyle = (glow: boolean): React.CSSProperties => ({
  background: "#FCFAF4",
  border: `1.5px ${glow ? "solid" : "dashed"} ${glow ? TEAL : "#E8E0D4"}`,
  borderRadius: 11,
  padding: 8,
  minHeight: 92,
  display: "flex",
  flexDirection: "column",
  boxShadow: glow ? "0 0 0 3px #E1F5EE" : "none",
  transition: "box-shadow .3s, border-color .3s",
});

const opCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: 27,
  color: "#3A4250",
};

const btnStyle: React.CSSProperties = {
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
};

const ghostBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: "#fff",
  color: TEAL_DARK,
  border: `1.5px solid ${TEAL}`,
  boxShadow: "none",
};

export const SplitWorkspace = ({
  a,
  b,
  coach,
  splitA = "demo",
  splitB = "demo",
  combine = "demo",
  pace = DEFAULT_PACE,
  lines,
  showFinalLine = true,
  onComplete,
}: SplitWorkspaceProps) => {
  const tA = tensOf(a), oA = onesOf(a), tB = tensOf(b), oB = onesOf(b);
  const tSum = tA + tB, oSum = oA + oB, total = a + b;

  const L: CoachLines = {
    splitAPrompt: splitA === "demo" ? `Tap ${a} to break it into tens and ones.` : `How many tens and ones are in ${a}?`,
    splitBPrompt: splitB === "demo" ? `Now tap ${b} the same way.` : `Now split ${b} — how many tens and ones?`,
    combineTensPrompt: combine === "demo" ? "Now put ALL the tens together!" : `Add the tens: ${tA} + ${tB}.`,
    combineOnesPrompt: combine === "demo" ? "Now all the ones together." : `Add the ones: ${oA} + ${oB}.`,
    done: `${tSum} and ${oSum}… that's ${total}!`,
    retrySplit: "Not yet — count the tens, then the ones.",
    retryTens: `Let's count just the tens: ${tA} and ${tB}.`,
    retryOnes: `Let's count just the ones: ${oA} and ${oB}.`,
    ...lines,
  };

  const [step, setStep] = useState<Step>("splitA");
  const [busy, setBusy] = useState(false);

  // number A visual
  const [aBroken, setABroken] = useState(false);
  const [aTensLit, setATensLit] = useState(0);
  const [aOnesLit, setAOnesLit] = useState(0);
  const [aChips, setAChips] = useState(false);
  const [aTensIn, setATensIn] = useState("");
  const [aOnesIn, setAOnesIn] = useState("");
  const [aFlash, setAFlash] = useState(false);

  // number B visual
  const [bBroken, setBBroken] = useState(false);
  const [bTensLit, setBTensLit] = useState(0);
  const [bOnesLit, setBOnesLit] = useState(0);
  const [bChips, setBChips] = useState(false);
  const [bTensIn, setBTensIn] = useState("");
  const [bOnesIn, setBOnesIn] = useState("");
  const [bFlash, setBFlash] = useState(false);

  // combine
  const [tSourceHidden, setTSourceHidden] = useState(false);
  const [oSourceHidden, setOSourceHidden] = useState(false);
  const [tCombined, setTCombined] = useState(false);
  const [tLit, setTLit] = useState(0);
  const [tChip, setTChip] = useState(false);
  const [oCombined, setOCombined] = useState(false);
  const [oLit, setOLit] = useState(0);
  const [oChip, setOChip] = useState(false);
  const [tSumIn, setTSumIn] = useState("");
  const [tFlash, setTFlash] = useState(false);
  const [oSumIn, setOSumIn] = useState("");
  const [oFlash, setOFlash] = useState(false);

  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [flyGo, setFlyGo] = useState(false);

  const [coachExpr, setCoachExpr] = useState<CoachExpression>("neutral");
  const [coachMsg, setCoachMsg] = useState(
    splitA === "demo" ? `Let's add ${a} and ${b}! Tap ${a} to start.` : `Let's add ${a} and ${b}! How many tens and ones in ${a}?`
  );

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
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const countSeq = useCallback(
    (n: number, setLit: (v: number) => void, after: () => void) => {
      if (prefersReduced()) { setLit(n); after(); return; }
      let i = 0;
      const tick = () => {
        i += 1;
        setLit(i);
        if (i < n) addT(tick, pace);
        else addT(after, pace);
      };
      addT(tick, pace);
    },
    [addT, pace]
  );

  const buildFlyers = (
    idPrefix: string,
    kind: "rod" | "cube",
    srcPiles: (HTMLDivElement | null)[],
    targetCell: HTMLDivElement | null
  ): Flyer[] | null => {
    const cont = cardRef.current;
    if (!cont || !targetCell) return null;
    const els: HTMLElement[] = [];
    srcPiles.forEach((p) => { if (p) els.push(...(Array.from(p.children) as HTMLElement[])); });
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

  /* ── step transitions ── */
  const goSplitB = () => {
    setBusy(false);
    setStep("splitB");
    setCoachExpr("neutral");
    setCoachMsg(L.splitBPrompt);
  };
  const goCombineTens = () => {
    setBusy(false);
    setStep("combineTens");
    setCoachExpr("neutral");
    setCoachMsg(L.combineTensPrompt);
  };
  const goCombineOnes = () => {
    setBusy(false);
    setStep("combineOnes");
    setCoachExpr("neutral");
    setCoachMsg(L.combineOnesPrompt);
  };
  const finish = () => {
    setStep("done");
    setCoachExpr("pleased");
    setCoachMsg(L.done);
    onComplete && onComplete();
  };

  /* ── split (demo): tap number → break + count ── */
  const breakDemo = (side: "A" | "B") => {
    if (busy) return;
    setBusy(true);
    setCoachExpr("pleased");
    setCoachMsg("Count the tens with me…");
    if (side === "A") {
      setABroken(true);
      countSeq(tA / 10, setATensLit, () => {
        setCoachMsg("…and the ones.");
        countSeq(oA, setAOnesLit, () => { setAChips(true); goSplitB(); });
      });
    } else {
      setBBroken(true);
      countSeq(tB / 10, setBTensLit, () => {
        setCoachMsg("…and the ones.");
        countSeq(oB, setBOnesLit, () => { setBChips(true); goCombineTens(); });
      });
    }
  };

  /* ── split (input): child types tens & ones ── */
  const submitSplit = (side: "A" | "B") => {
    if (busy) return;
    const tIn = side === "A" ? aTensIn : bTensIn;
    const oIn = side === "A" ? aOnesIn : bOnesIn;
    const tVal = side === "A" ? tA : tB;
    const oVal = side === "A" ? oA : oB;
    const ok = Number(tIn) === tVal && Number(oIn) === oVal;
    if (!ok) {
      if (side === "A") { setAFlash(true); } else { setBFlash(true); }
      setCoachExpr("gentle");
      setCoachMsg(L.retrySplit);
      addT(() => {
        if (side === "A") { setAFlash(false); setATensIn(""); setAOnesIn(""); }
        else { setBFlash(false); setBTensIn(""); setBOnesIn(""); }
      }, 600);
      return;
    }
    setCoachExpr("pleased");
    if (side === "A") {
      setABroken(true); setATensLit(tA / 10); setAOnesLit(oA); setAChips(true);
      goSplitB();
    } else {
      setBBroken(true); setBTensLit(tB / 10); setBOnesLit(oB); setBChips(true);
      goCombineTens();
    }
  };

  /* ── combine: fly source blocks into total cell, then count ── */
  const flyCombine = (place: "tens" | "ones", afterDone: () => void) => {
    setBusy(true);
    const kind = place === "tens" ? "rod" : "cube";
    const srcPiles =
      place === "tens" ? [aTensRef.current, bTensRef.current] : [aOnesRef.current, bOnesRef.current];
    const targetCell = place === "tens" ? tTensCellRef.current : tOnesCellRef.current;
    const fl = prefersReduced() ? null : buildFlyers(place, kind, srcPiles, targetCell);

    if (place === "tens") setTSourceHidden(true);
    else setOSourceHidden(true);

    const reveal = () => {
      if (place === "tens") {
        setTCombined(true);
        setCoachMsg("Count all the tens together…");
        countSeq(tSum / 10, setTLit, () => { setTChip(true); afterDone(); });
      } else {
        setOCombined(true);
        setCoachMsg("And count the ones…");
        countSeq(oSum, setOLit, () => { setOChip(true); afterDone(); });
      }
    };

    if (!fl) { reveal(); return; }
    setFlyers(fl);
    setFlyGo(false);
    setCoachMsg(place === "tens" ? "Watch the tens come together…" : "Watch the ones come together…");
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyGo(true)));
    addT(() => { setFlyers([]); setFlyGo(false); reveal(); }, FLY_MS + 100);
  };

  const afterTens = () => {
    setCoachExpr("pleased");
    setCoachMsg(`${tA / 10} tens and ${tB / 10} tens — that's ${tSum}!`);
    addT(() => goCombineOnes(), 1100);
  };
  const afterOnes = () => { finish(); };

  const combineTensAction = () => {
    if (busy) return;
    if (combine === "input") {
      if (Number(tSumIn) !== tSum) {
        setTFlash(true); setCoachExpr("gentle"); setCoachMsg(L.retryTens);
        addT(() => { setTFlash(false); setTSumIn(""); }, 600);
        return;
      }
    }
    flyCombine("tens", afterTens);
  };

  const combineOnesAction = () => {
    if (busy) return;
    if (combine === "input") {
      if (Number(oSumIn) !== oSum) {
        setOFlash(true); setCoachExpr("gentle"); setCoachMsg(L.retryOnes);
        addT(() => { setOFlash(false); setOSumIn(""); }, 600);
        return;
      }
    }
    flyCombine("ones", afterOnes);
  };

  /* ── render helpers ── */
  const aActive = step === "splitA";
  const bActive = step === "splitB";
  const aInputOpen = splitA === "input" && aActive && !aBroken;
  const bInputOpen = splitB === "input" && bActive && !bBroken;
  const tGlow = step === "combineTens" && busy;
  const oGlow = step === "combineOnes" && busy;

  const numberRow = (
    side: "A" | "B",
    value: number,
    tVal: number,
    oVal: number,
    variant: "full" | "lite"
  ) => {
    const broken = side === "A" ? aBroken : bBroken;
    const tensLit = side === "A" ? aTensLit : bTensLit;
    const onesLit = side === "A" ? aOnesLit : bOnesLit;
    const chips = side === "A" ? aChips : bChips;
    const inputOpen = side === "A" ? aInputOpen : bInputOpen;
    const tIn = side === "A" ? aTensIn : bTensIn;
    const oIn = side === "A" ? aOnesIn : bOnesIn;
    const flash = side === "A" ? aFlash : bFlash;
    const mode = side === "A" ? splitA : splitB;
    const active = side === "A" ? aActive : bActive;
    const tensRef = side === "A" ? aTensRef : bTensRef;
    const onesRef = side === "A" ? aOnesRef : bOnesRef;
    const srcTensHidden = tSourceHidden;
    const srcOnesHidden = oSourceHidden;
    const onTens = side === "A" ? setATensIn : setBTensIn;
    const onOnes = side === "A" ? setAOnesIn : setBOnesIn;

    const cue = mode === "demo" && active && !broken && !busy;
    const onTap = cue ? () => breakDemo(side) : undefined;

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NumTile value={value} variant={variant} cue={cue} spent={broken} onTap={onTap} />
        </div>
        <div style={cellStyle(false)}>
          <div style={chipSlotStyle}>{chips && <Chip value={tVal} kind="t" />}</div>
          {broken ? (
            <Pile count={tVal / 10} kind="rod" litCount={tensLit} pileRef={tensRef} hidden={srcTensHidden} />
          ) : inputOpen ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SplitBox value={tIn} onChange={onTens} kind="t" flash={flash} />
            </div>
          ) : null}
        </div>
        <div style={cellStyle(false)}>
          <div style={chipSlotStyle}>{chips && <Chip value={oVal} kind="o" />}</div>
          {broken ? (
            <Pile count={oVal} kind="cube" litCount={onesLit} pileRef={onesRef} hidden={srcOnesHidden} />
          ) : inputOpen ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SplitBox value={oIn} onChange={onOnes} kind="o" flash={flash} />
            </div>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <div ref={cardRef} style={{ position: "relative" }}>
      <style>{`
        @keyframes swpulse {0%{box-shadow:0 0 0 0 rgba(46,157,142,.5)}70%{box-shadow:0 0 0 13px rgba(46,157,142,0)}100%{box-shadow:0 0 0 0 rgba(46,157,142,0)}}
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

      <div style={{ display: "grid", gridTemplateColumns: "78px 1fr 1fr", gap: "8px 10px", alignItems: "stretch" }}>
        <div />
        {heading("Tens")}
        {heading("Ones")}

        {numberRow("A", a, tA, oA, "full")}

        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 28, color: "#3A4250", lineHeight: 1 }}>+</div>
        <div />
        <div />

        {numberRow("B", b, tB, oB, "lite")}

        <div style={{ gridColumn: "1 / -1", height: 3, background: "#1A2E1A", opacity: 0.13, borderRadius: 3, margin: "3px 0" }} />

        <div style={opCellStyle}>=</div>
        <div ref={tTensCellRef} style={cellStyle(tGlow)}>
          <div style={chipSlotStyle}>{tChip && <Chip value={tSum} kind="t" />}</div>
          {tCombined && <Pile count={tSum / 10} kind="rod" litCount={tLit} />}
        </div>
        <div ref={tOnesCellRef} style={cellStyle(oGlow)}>
          <div style={chipSlotStyle}>{oChip && <Chip value={oSum} kind="o" />}</div>
          {oCombined && <Pile count={oSum} kind="cube" litCount={oLit} />}
        </div>
      </div>

      {/* flying blocks */}
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
      {step === "done" && showFinalLine && (
        <p style={{ textAlign: "center", fontSize: 24, fontWeight: 900, marginTop: 16, fontFamily: "var(--font-heading)" }}>
          {tSum} + {oSum} = <span style={{ color: TEAL_DARK }}>{total}</span>
        </p>
      )}

      {/* controls (below grid) */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        {/* split A input check */}
        {step === "splitA" && splitA === "input" && !aBroken && (
          <button
            onClick={() => submitSplit("A")}
            disabled={!aTensIn || !aOnesIn}
            style={{ ...btnStyle, opacity: !aTensIn || !aOnesIn ? 0.4 : 1, cursor: !aTensIn || !aOnesIn ? "not-allowed" : "pointer" }}
          >
            Check
          </button>
        )}

        {/* split B input check */}
        {step === "splitB" && splitB === "input" && !bBroken && (
          <button
            onClick={() => submitSplit("B")}
            disabled={!bTensIn || !bOnesIn}
            style={{ ...btnStyle, opacity: !bTensIn || !bOnesIn ? 0.4 : 1, cursor: !bTensIn || !bOnesIn ? "not-allowed" : "pointer" }}
          >
            Check
          </button>
        )}

        {/* combine tens — demo button */}
        {step === "combineTens" && combine === "demo" && !busy && (
          <button onClick={combineTensAction} style={btnStyle}>Put all the tens together</button>
        )}

        {/* combine tens — input */}
        {step === "combineTens" && combine === "input" && !busy && (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 20, color: "#1A2E1A" }}>
              <span style={{ color: "#1D4ED8" }}>{tA}</span>
              <span>+</span>
              <span style={{ color: "#1D4ED8" }}>{tB}</span>
              <span>=</span>
              <SumInput value={tSumIn} onChange={setTSumIn} flash={tFlash} onEnter={combineTensAction} />
            </div>
            <button
              onClick={combineTensAction}
              disabled={!tSumIn}
              style={{ ...btnStyle, opacity: !tSumIn ? 0.4 : 1, cursor: !tSumIn ? "not-allowed" : "pointer" }}
            >
              Check
            </button>
          </div>
        )}

        {/* combine ones — demo button */}
        {step === "combineOnes" && combine === "demo" && !busy && (
          <button onClick={combineOnesAction} style={btnStyle}>Now all the ones together</button>
        )}

        {/* combine ones — input */}
        {step === "combineOnes" && combine === "input" && !busy && (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 20, color: "#1A2E1A" }}>
              <span style={{ color: "#B45309" }}>{oA}</span>
              <span>+</span>
              <span style={{ color: "#B45309" }}>{oB}</span>
              <span>=</span>
              <SumInput value={oSumIn} onChange={setOSumIn} flash={oFlash} onEnter={combineOnesAction} />
            </div>
            <button
              onClick={combineOnesAction}
              disabled={!oSumIn}
              style={{ ...btnStyle, opacity: !oSumIn ? 0.4 : 1, cursor: !oSumIn ? "not-allowed" : "pointer" }}
            >
              Check
            </button>
          </div>
        )}
      </div>

      {/* coach */}
      <div style={{ marginTop: 16 }}>
        <Coach name={coach} expression={coachExpr} message={coachMsg} />
      </div>
    </div>
  );
};

export default SplitWorkspace;
