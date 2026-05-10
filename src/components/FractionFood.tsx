/**
 * Pizza and chocolate bar visuals for Year 2 → Halves, Quarters & Eighths.
 * Used in landing, learn (I/We/You Do), practise.
 */

const CRUST = "#D97706";
const PIZZA_BASE = "#FDE68A";
const PIZZA_RED = "#EF4444";
const PEP = "#DC2626";

const CHOC_OUTER = "#92400E";
const CHOC_BORDER = "#78350F";
const CHOC_SHADED = "#B45309";
const CHOC_PALE = "#FDE68A";

type PizzaProps = {
  size?: number;
  /** Number of equal slices to draw (1 = no cuts, 2,4,8 supported). */
  slices: number;
  /** Indices of slices that are shaded (0-based, starting at top, clockwise). */
  shaded?: number[];
  /** Animate cut lines drawing outward. */
  cutsDrawn?: boolean;
  /** Animate red fill in shaded slices. */
  filled?: boolean;
};

export const Pizza = ({
  size = 220,
  slices,
  shaded = [],
  cutsDrawn = true,
  filled = true,
}: PizzaProps) => {
  const cx = 100;
  const cy = 100;
  const r = 92;

  // Slice paths (start at top, clockwise)
  const slicePath = (i: number) => {
    if (slices < 2) return "";
    const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  // Cut line endpoints (each cut goes through centre, so n/2 lines for even n)
  const cutLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  if (slices >= 2) {
    const n = slices / 2;
    for (let i = 0; i < n; i++) {
      const a = (i / slices) * Math.PI * 2 - Math.PI / 2;
      cutLines.push({
        x1: cx - r * Math.cos(a),
        y1: cy - r * Math.sin(a),
        x2: cx + r * Math.cos(a),
        y2: cy + r * Math.sin(a),
      });
    }
  }

  // Pepperoni positions inside a slice (deterministic per index).
  const pepsForSlice = (i: number) => {
    const mid = ((i + 0.5) / slices) * Math.PI * 2 - Math.PI / 2;
    const dots = [0.45, 0.65, 0.55].map((rr, k) => {
      const offset = (k - 1) * 0.25;
      const a = mid + offset / slices;
      return {
        x: cx + r * rr * Math.cos(a),
        y: cy + r * rr * Math.sin(a),
        rr: 2 + (k % 2),
      };
    });
    return dots;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {/* Pale base */}
      <circle cx={cx} cy={cy} r={r} fill={PIZZA_BASE} fillOpacity={0.6} />
      {/* Shaded slices */}
      {slices >= 2 &&
        shaded.map((i) => (
          <g key={`sh-${i}`}>
            <path
              d={slicePath(i)}
              fill={PIZZA_RED}
              fillOpacity={filled ? 0.85 : 0}
              style={{ transition: "fill-opacity 220ms ease-out" }}
            />
            {filled &&
              pepsForSlice(i).map((p, k) => (
                <circle
                  key={k}
                  cx={p.x}
                  cy={p.y}
                  r={p.rr}
                  fill={PEP}
                  fillOpacity={0.55}
                />
              ))}
          </g>
        ))}
      {/* Cut lines */}
      {cutLines.map((l, idx) => {
        const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
        return (
          <line
            key={idx}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={CRUST}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={cutsDrawn ? 0 : len}
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
        );
      })}
      {/* Crust */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={CRUST}
        strokeWidth={3}
      />
    </svg>
  );
};

type ChocProps = {
  width?: number;
  height?: number;
  /** Number of equal segments (1, 2, 4, 8...). */
  segments: number;
  shaded?: number[];
  /** Animate break lines drawing top→bottom. */
  breaksDrawn?: boolean;
  /** Animate dark fill in shaded segments. */
  filled?: boolean;
};

export const ChocolateBar = ({
  width = 260,
  height = 110,
  segments,
  shaded = [],
  breaksDrawn = true,
  filled = true,
}: ChocProps) => {
  const pad = 4;
  const segW = (width - pad * 2) / segments;
  const segH = height - pad * 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Outer chocolate body */}
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        rx={8}
        fill={CHOC_OUTER}
        stroke={CHOC_BORDER}
        strokeWidth={2}
      />
      {/* Pale milk segments */}
      {Array.from({ length: segments }, (_, i) => {
        const isShaded = shaded.includes(i);
        return (
          <g key={i}>
            <rect
              x={pad + i * segW + 1.5}
              y={pad + 1.5}
              width={segW - 3}
              height={segH - 3}
              rx={4}
              fill={CHOC_PALE}
              fillOpacity={0.58}
            />
            {/* Shaded fill (left→right reveal via clip width) */}
            <rect
              x={pad + i * segW + 1.5}
              y={pad + 1.5}
              width={filled && isShaded ? segW - 3 : 0}
              height={segH - 3}
              rx={4}
              fill={CHOC_SHADED}
              style={{ transition: "width 220ms ease-out" }}
            />
            {/* Inner highlight for depth */}
            <rect
              x={pad + i * segW + 4}
              y={pad + 4}
              width={Math.max(0, segW - 8)}
              height={6}
              rx={2}
              fill="#fff"
              fillOpacity={isShaded && filled ? 0.08 : 0.15}
            />
          </g>
        );
      })}
      {/* Break lines top→bottom */}
      {Array.from({ length: segments - 1 }, (_, i) => {
        const x = pad + (i + 1) * segW;
        const len = segH;
        return (
          <line
            key={`br-${i}`}
            x1={x}
            y1={pad}
            x2={x}
            y2={pad + segH}
            stroke={CHOC_BORDER}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={breaksDrawn ? 0 : len}
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
        );
      })}
    </svg>
  );
};
