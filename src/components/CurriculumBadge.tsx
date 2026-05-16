import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface CurriculumBadgeProps {
  code: string;
  title: string;
  description: string;
  year: string;
  strand: string;
  pageName?: string;
}

// Track currently open badge so only one can be open at a time
let activeCloser: (() => void) | null = null;

const CurriculumBadge = ({
  code,
  title,
  description,
  year,
  strand,
  pageName = "unknown page",
}: CurriculumBadgeProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Runtime validation: hide badge if any required prop is missing or empty
  const isMissing =
    !code ||
    !code.trim() ||
    !title ||
    !title.trim() ||
    !description ||
    !description.trim() ||
    !year ||
    !year.trim() ||
    !strand ||
    !strand.trim();

  if (isMissing) {
    // eslint-disable-next-line no-console
    console.warn(
      `CurriculumBadge: missing props on ${pageName} — badge hidden until props are supplied`
    );
  }

  useEffect(() => {
    if (!open) return;
    // Close any other open badge
    if (activeCloser && activeCloser !== close) activeCloser();
    activeCloser = close;

    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      if (activeCloser === close) activeCloser = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div
      ref={wrapRef}
      className="relative inline-block"
      style={{ visibility: isMissing ? "hidden" : "visible" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 transition-colors"
        style={{
          backgroundColor: "#F5F0E8",
          border: "1px solid #D4C9B8",
          color: "#888888",
          padding: "5px 10px",
          borderRadius: "var(--border-radius-md)",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EDE8E0")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
        aria-expanded={open}
        aria-label={`Curriculum reference ${code}`}
      >
        <div className="flex flex-col">
          <span style={{ fontSize: "10px", fontWeight: 400, lineHeight: 1.3 }}>
            Australian Curriculum Outcome
          </span>
          <span style={{ fontSize: "11px", fontWeight: 500, lineHeight: 1.3, color: "#1A1A1A" }}>
            {code}
          </span>
        </div>
        <ChevronDown
          size={12}
          style={{
            transition: "transform 150ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && !isMissing && (
        <div
          role="dialog"
          className="curriculum-badge-card"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 50,
            width: "320px",
            maxWidth: "calc(100vw - 32px)",
            backgroundColor: "#ffffff",
            border: "1px solid #E8E0D4",
            borderRadius: "var(--border-radius-md)",
            padding: "14px 16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            animation: "curriculumFadeIn 150ms ease-out",
          }}
        >
          <div className="flex items-start justify-between">
            <span style={{ color: "#0F6E56", fontWeight: 500, fontSize: "13px" }}>{code}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="transition-colors"
              aria-label="Close"
              style={{ lineHeight: 1, fontSize: "16px", color: "#888888" }}
            >
              <X size={14} />
            </button>
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "hsl(var(--foreground))",
              marginTop: "6px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "hsl(var(--muted-foreground))",
              lineHeight: 1.6,
              marginTop: "6px",
            }}
          >
            {description}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#888888",
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "0.5px solid #E8E0D4",
            }}
          >
            {year} · {strand} · Australian Curriculum v9.0
          </div>
        </div>
      )}

      <style>{`
        @keyframes curriculumFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export const AC9M2N04_PROPS = {
  code: "AC9M2N04",
  title: "Addition & subtraction strategies",
  description:
    "Add and subtract 1- and 2-digit numbers using number sentences and a variety of calculation strategies, including the split strategy and jump strategy.",
  year: "Year 2",
  strand: "Number",
};

export default CurriculumBadge;
