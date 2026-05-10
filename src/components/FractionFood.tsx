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
  /** When set, slices become clickable (transparent overlay) and call this with the slice index. */
  onSliceTap?: (index: number) => void;
};

export const Pizza = ({
  size = 220,
  slices,
  shaded = [],
  cutsDrawn = true,
  filled = true,
  onSliceTap,
}: PizzaProps) => {
  const cx = 100;
  const cy = 100;
  const rOuter = 96; // crust outer
  const rInner = 84; // cheese disc
  const detail = size >= 160 ? "rich" : size >= 100 ? "med" : "small";
  const pepCount = detail === "rich" ? 5 : detail === "med" ? 3 : 2;
  const pepR = detail === "rich" ? 4.5 : detail === "med" ? 3.2 : 2.4;

  // Slice paths (start at top, clockwise) over inner cheese radius
  const slicePath = (i: number, radius = rInner) => {
    if (slices < 2) return "";
    const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const x2 = cx + radius * Math.cos(a2);
    const y2 = cy + radius * Math.sin(a2);
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  // Cut lines (within cheese disc only — knife cuts, not over crust)
  const cutLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  if (slices >= 2) {
    const cutR = rInner - 2;
    const n = slices / 2;
    for (let i = 0; i < n; i++) {
      const a = (i / slices) * Math.PI * 2 - Math.PI / 2;
      cutLines.push({
        x1: cx - cutR * Math.cos(a),
        y1: cy - cutR * Math.sin(a),
        x2: cx + cutR * Math.cos(a),
        y2: cy + cutR * Math.sin(a),
      });
    }
  }

  // Deterministic pseudo-random based on slice index + dot index
  const seeded = (i: number, k: number, salt = 1) => {
    const v = Math.sin((i + 1) * 12.9898 + (k + 1) * 78.233 + salt * 37.719) * 43758.5453;
    return v - Math.floor(v); // 0..1
  };

  const pepsForSlice = (i: number) => {
    const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
    const out: Array<{ x: number; y: number; r: number }> = [];
    for (let k = 0; k < pepCount; k++) {
      // Jittered placement in polar coords, kept inside slice
      const ta = 0.18 + seeded(i, k, 1) * 0.64; // 0.18..0.82 along the slice angle
      const tr = 0.32 + seeded(i, k, 2) * 0.5; // 0.32..0.82 along radius
      const a = a1 + (a2 - a1) * ta;
      const rad = (rInner - 6) * tr;
      out.push({
        x: cx + rad * Math.cos(a),
        y: cy + rad * Math.sin(a),
        r: pepR * (0.85 + seeded(i, k, 3) * 0.3),
      });
    }
    return out;
  };

  // Cheese melt blobs (organic light highlights on the cheese)
  const cheeseBlobs = [
    { x: 70, y: 70, r: 14 },
    { x: 130, y: 78, r: 11 },
    { x: 92, y: 130, r: 13 },
    { x: 128, y: 128, r: 9 },
  ];

  // Crust speckles (baked bubbles around the rim)
  const speckles = Array.from({ length: detail === "small" ? 8 : 18 }, (_, k) => {
    const a = (k / (detail === "small" ? 8 : 18)) * Math.PI * 2;
    const rr = (rOuter + rInner) / 2 + (seeded(k, 0, 5) - 0.5) * 4;
    return {
      x: cx + rr * Math.cos(a),
      y: cy + rr * Math.sin(a),
      r: 0.8 + seeded(k, 0, 6) * 1.2,
      light: seeded(k, 0, 7) > 0.5,
    };
  });

  const clipId = `pizza-clip-${slices}-${size}`;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <radialGradient id={`crust-grad-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={rInner} />
        </clipPath>
      </defs>

      {/* Crust ring with darker outer rim */}
      <circle cx={cx} cy={cy} r={rOuter} fill={`url(#crust-grad-${size})`} />

      {/* Tomato sauce layer (inside crust) */}
      <circle cx={cx} cy={cy} r={rInner} fill="#F87171" />

      {/* Melted cheese on top of sauce — leaves sauce peeking via blobs */}
      <g clipPath={`url(#${clipId})`}>
        <circle cx={cx} cy={cy} r={rInner} fill="#FDE68A" fillOpacity={0.92} />
        {cheeseBlobs.map((b, k) => (
          <circle key={k} cx={b.x} cy={b.y} r={b.r} fill="#F87171" fillOpacity={0.35} />
        ))}
        {/* Cheese highlight */}
        <ellipse cx={cx - 22} cy={cy - 28} rx={26} ry={10} fill="#FFFFFF" fillOpacity={0.18} />
      </g>

      {/* Shaded ("taken") slices — extra sauce + toppings */}
      {slices >= 2 &&
        shaded.map((i) => (
          <g key={`sh-${i}`} clipPath={`url(#${clipId})`}>
            <path
              d={slicePath(i)}
              fill={PIZZA_RED}
              fillOpacity={filled ? 0.85 : 0}
              style={{ transition: "fill-opacity 220ms ease-out" }}
            />
            {filled &&
              pepsForSlice(i).map((p, k) => (
                <g key={k}>
                  <circle cx={p.x} cy={p.y} r={p.r} fill="#7F1D1D" fillOpacity={0.9} />
                  <circle cx={p.x} cy={p.y} r={p.r - 0.8} fill="#DC2626" />
                  <circle
                    cx={p.x - p.r * 0.3}
                    cy={p.y - p.r * 0.3}
                    r={p.r * 0.25}
                    fill="#FCA5A5"
                    fillOpacity={0.7}
                  />
                </g>
              ))}
            {/* Tiny basil specks */}
            {filled && detail !== "small" &&
              [0, 1].map((k) => {
                const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2;
                const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
                const ta = 0.3 + seeded(i, k, 9) * 0.4;
                const tr = 0.45 + seeded(i, k, 10) * 0.3;
                const a = a1 + (a2 - a1) * ta;
                const rad = (rInner - 8) * tr;
                return (
                  <circle
                    key={`b-${k}`}
                    cx={cx + rad * Math.cos(a)}
                    cy={cy + rad * Math.sin(a)}
                    r={1.2}
                    fill="#16A34A"
                    fillOpacity={0.85}
                  />
                );
              })}
          </g>
        ))}

      {/* Knife cut lines (clipped to cheese disc, dark crust colour) */}
      <g clipPath={`url(#${clipId})`}>
        {cutLines.map((l, idx) => {
          const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
          return (
            <line
              key={idx}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#78350F"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={cutsDrawn ? 0 : len}
              style={{ transition: "stroke-dashoffset 600ms ease-out" }}
            />
          );
        })}
      </g>

      {/* Crust speckles (baked bubbles) on the rim */}
      {speckles.map((s, k) => (
        <circle
          key={k}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={s.light ? "#FEF3C7" : "#92400E"}
          fillOpacity={s.light ? 0.7 : 0.5}
        />
      ))}

      {/* Outer rim shadow for depth */}
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="#78350F"
        strokeWidth={1.5}
        strokeOpacity={0.7}
      />
      {/* Inner crust edge */}
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="#92400E"
        strokeWidth={1}
        strokeOpacity={0.5}
      />

      {/* Click overlay — transparent slice paths for tap-to-shade */}
      {onSliceTap && slices >= 2 &&
        Array.from({ length: slices }, (_, i) => (
          <path
            key={`tap-${i}`}
            d={slicePath(i)}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={() => onSliceTap(i)}
          />
        ))}
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
  /** When set, segments become clickable (transparent overlay). */
  onSegmentTap?: (index: number) => void;
};

export const ChocolateBar = ({
  width = 260,
  height = 110,
  segments,
  shaded = [],
  breaksDrawn = true,
  filled = true,
}: ChocProps) => {
  const pad = 5;
  const groove = Math.max(2, Math.min(4, width / segments / 10));
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const segW = innerW / segments;
  const detail = width >= 200 ? "rich" : width >= 100 ? "med" : "small";

  // Palette
  const BODY = "#1A0E06";
  const MILK_TOP = "#7A4422";
  const MILK_BOT = "#4A2510";
  const DARK_TOP = "#3A1F0E";
  const DARK_BOT = "#1F1006";
  const HILITE = "#A56A3E";

  const gradMilk = `choc-milk-${segments}-${width}`;
  const gradDark = `choc-dark-${segments}-${width}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradMilk} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={MILK_TOP} />
          <stop offset="100%" stopColor={MILK_BOT} />
        </linearGradient>
        <linearGradient id={gradDark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DARK_TOP} />
          <stop offset="100%" stopColor={DARK_BOT} />
        </linearGradient>
      </defs>

      {/* Outer body / wrapper edge */}
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        rx={8}
        fill={BODY}
        stroke={BODY}
        strokeWidth={2}
      />
      {/* Subtle inner foil hint */}
      <rect
        x={2}
        y={2}
        width={width - 4}
        height={height - 4}
        rx={7}
        fill="none"
        stroke={HILITE}
        strokeOpacity={0.25}
        strokeWidth={1}
      />

      {/* Segments */}
      {Array.from({ length: segments }, (_, i) => {
        const isShaded = shaded.includes(i);
        const x0 = pad + i * segW + groove / 2;
        const y0 = pad + groove / 2;
        const w = segW - groove;
        const h = innerH - groove;
        const fill = `url(#${isShaded ? gradDark : gradMilk})`;
        const showPip = detail === "rich" && w >= 28;

        return (
          <g key={i}>
            {/* Base tile (full width when not shaded; revealed left→right when shaded fills in) */}
            <rect x={x0} y={y0} width={w} height={h} rx={4} fill={`url(#${gradMilk})`} />
            {/* Shaded dark fill, animated left→right */}
            {isShaded && (
              <rect
                x={x0}
                y={y0}
                width={filled ? w : 0}
                height={h}
                rx={4}
                fill={`url(#${gradDark})`}
                style={{ transition: "width 240ms ease-out" }}
              />
            )}

            {/* Bevels — drawn on top so they always read */}
            {/* Top highlight */}
            <line
              x1={x0 + 2}
              y1={y0 + 1}
              x2={x0 + w - 2}
              y2={y0 + 1}
              stroke={HILITE}
              strokeOpacity={isShaded && filled ? 0.35 : 0.6}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Left highlight */}
            <line
              x1={x0 + 1}
              y1={y0 + 2}
              x2={x0 + 1}
              y2={y0 + h - 2}
              stroke={HILITE}
              strokeOpacity={isShaded && filled ? 0.25 : 0.4}
              strokeWidth={1}
              strokeLinecap="round"
            />
            {/* Bottom shadow */}
            <line
              x1={x0 + 2}
              y1={y0 + h - 1}
              x2={x0 + w - 2}
              y2={y0 + h - 1}
              stroke={BODY}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Right shadow */}
            <line
              x1={x0 + w - 1}
              y1={y0 + 2}
              x2={x0 + w - 1}
              y2={y0 + h - 2}
              stroke={BODY}
              strokeOpacity={0.55}
              strokeWidth={1}
              strokeLinecap="round"
            />

            {/* Gloss highlight (top-left) */}
            {detail !== "small" && (
              <ellipse
                cx={x0 + w * 0.35}
                cy={y0 + h * 0.28}
                rx={w * 0.28}
                ry={h * 0.12}
                fill="#FFFFFF"
                fillOpacity={isShaded && filled ? 0.05 : 0.1}
              />
            )}

            {/* Centre embossed pip (only when wide enough) */}
            {showPip && (
              <rect
                x={x0 + w / 2 - w * 0.16}
                y={y0 + h / 2 - h * 0.16}
                width={w * 0.32}
                height={h * 0.32}
                rx={2}
                fill="none"
                stroke={isShaded && filled ? HILITE : BODY}
                strokeOpacity={isShaded && filled ? 0.35 : 0.45}
                strokeWidth={1}
              />
            )}
          </g>
        );
      })}

      {/* Deep grooves between segments (animated reveal as the bar "snaps") */}
      {Array.from({ length: segments - 1 }, (_, i) => {
        const gx = pad + (i + 1) * segW - groove / 2;
        return (
          <rect
            key={`gr-${i}`}
            x={gx}
            y={pad}
            width={groove}
            height={innerH}
            fill={BODY}
            opacity={breaksDrawn ? 1 : 0}
            style={{ transition: "opacity 500ms ease-out" }}
          />
        );
      })}
    </svg>
  );
};
