import { useId } from "react";

export type CoachName = "mia" | "noah" | "zara";

export type CoachExpression = "neutral" | "pleased" | "gentle";

interface CharDef {

  accent: string;

  tint: string;

  hair: string;

  skin: string;

  hairType: "bob" | "curly" | "buns";

  glasses: boolean;

  label: string;

}

const CHAR: Record<CoachName, CharDef> = {

  mia:  { accent: "#EC7A6E", tint: "#FBE4E1", hair: "#4E3629", skin: "#F0C8A0", hairType: "bob",   glasses: false, label: "Mia" },

  noah: { accent: "#7B73D4", tint: "#E7E5F8", hair: "#2B2723", skin: "#B07A52", hairType: "curly", glasses: true,  label: "Noah" },

  zara: { accent: "#D7669C", tint: "#F8E2EE", hair: "#3A2A22", skin: "#E6AE80", hairType: "buns",  glasses: false, label: "Zara" },

};

const Hair = ({ c }: { c: CharDef }) => {

  if (c.hairType === "bob")

    return (

      <>

        <path d="M26 44 C26 22 74 22 74 44 C74 32 64 31 50 31 C36 31 26 32 26 44 Z" fill={c.hair} />

        <ellipse cx="27" cy="45" rx="5" ry="11" fill={c.hair} />

        <ellipse cx="73" cy="45" rx="5" ry="11" fill={c.hair} />

      </>

    );

  if (c.hairType === "curly")

    return (

      <>

        <circle cx="35" cy="29" r="9" fill={c.hair} />

        <circle cx="50" cy="24" r="11" fill={c.hair} />

        <circle cx="65" cy="29" r="9" fill={c.hair} />

        <circle cx="28" cy="39" r="7" fill={c.hair} />

        <circle cx="72" cy="39" r="7" fill={c.hair} />

      </>

    );

  return (

    <>

      <path d="M27 44 C27 23 73 23 73 44 C73 32 64 31 50 31 C36 31 27 32 27 44 Z" fill={c.hair} />

      <circle cx="29" cy="24" r="8" fill={c.hair} />

      <circle cx="71" cy="24" r="8" fill={c.hair} />

    </>

  );

};

const Face = ({ expr }: { expr: CoachExpression }) => {

  const m = "#6B4A3A";

  if (expr === "pleased")

    return (

      <>

        <path d="M38 43 Q42 39.5 46 43" stroke={m} strokeWidth="2.4" fill="none" strokeLinecap="round" />

        <path d="M54 43 Q58 39.5 62 43" stroke={m} strokeWidth="2.4" fill="none" strokeLinecap="round" />

        <path d="M41 51 Q50 61 59 51" stroke={m} strokeWidth="2.6" fill="none" strokeLinecap="round" />

      </>

    );

  if (expr === "gentle")

    return (

      <>

        <path d="M38.5 39.5 Q42 37.5 45.5 39.5" stroke={m} strokeWidth="1.7" fill="none" strokeLinecap="round" />

        <path d="M54.5 39.5 Q58 37.5 61.5 39.5" stroke={m} strokeWidth="1.7" fill="none" strokeLinecap="round" />

        <circle cx="42" cy="44" r="2.4" fill={m} />

        <circle cx="58" cy="44" r="2.4" fill={m} />

        <path d="M44 53 Q50 56 56 53" stroke={m} strokeWidth="2.3" fill="none" strokeLinecap="round" />

      </>

    );

  return (

    <>

      <circle cx="42" cy="44" r="2.7" fill={m} />

      <circle cx="58" cy="44" r="2.7" fill={m} />

      <path d="M43 52 Q50 57 57 52" stroke={m} strokeWidth="2.4" fill="none" strokeLinecap="round" />

    </>

  );

};

const CoachAvatar = ({ name, expression }: { name: CoachName; expression: CoachExpression }) => {

  const c = CHAR[name];

  const rawId = useId();

  const clipId = "coachclip" + rawId.replace(/:/g, "");

  return (

    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }}>

      <defs>

        <clipPath id={clipId}>

          <circle cx="50" cy="50" r="49" />

        </clipPath>

      </defs>

      <circle cx="50" cy="50" r="49" fill={c.tint} />

      <g clipPath={`url(#${clipId})`}>

        <path d="M16 99 C16 76 32 69 50 69 C68 69 84 76 84 99 Z" fill={c.accent} />

        <rect x="44.5" y="58" width="11" height="14" rx="5" fill={c.skin} />

        <circle cx="50" cy="44" r="22" fill={c.skin} />

        <Hair c={c} />

        {expression === "pleased" && (

          <>

            <ellipse cx="35" cy="50" rx="3.6" ry="2.5" fill={c.accent} opacity="0.32" />

            <ellipse cx="65" cy="50" rx="3.6" ry="2.5" fill={c.accent} opacity="0.32" />

          </>

        )}

        <Face expr={expression} />

        {c.glasses && (

          <>

            <circle cx="42" cy="44" r="7" fill="#fff" fillOpacity="0.25" stroke="#2B2723" strokeWidth="1.6" />

            <circle cx="58" cy="44" r="7" fill="#fff" fillOpacity="0.25" stroke="#2B2723" strokeWidth="1.6" />

            <path d="M49 44h2" stroke="#2B2723" strokeWidth="1.6" />

          </>

        )}

      </g>

      <circle cx="50" cy="50" r="48" fill="none" stroke={c.accent} strokeWidth="1.5" opacity="0.35" />

    </svg>

  );

};

export interface CoachProps {

  name: CoachName;

  expression?: CoachExpression;

  message?: string;

  size?: number;

}

export const Coach = ({ name, expression = "neutral", message, size = 72 }: CoachProps) => {

  const c = CHAR[name];

  return (

    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>

      <div style={{ flex: "none", width: size, height: size }}>

        <CoachAvatar name={name} expression={expression} />

      </div>

      {message && (

        <div

          style={{

            background: "#fff",

            border: `2px solid ${c.accent}`,

            borderRadius: 16,

            borderBottomLeftRadius: 5,

            padding: "11px 15px",

            boxShadow: "0 4px 12px rgba(40,40,60,0.08)",

            minHeight: 48,

          }}

        >

          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.3px", marginBottom: 2, color: c.accent }}>

            {c.label.toUpperCase()}

          </div>

          <div style={{ fontWeight: 700, fontSize: 14, color: "#2A3140" }}>{message}</div>

        </div>

      )}

    </div>

  );

};

export default Coach;
