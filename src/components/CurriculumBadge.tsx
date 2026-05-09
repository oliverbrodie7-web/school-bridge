import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface CurriculumBadgeProps {
  code: string;
  title: string;
  description: string;
  year: string;
  strand: string;
}

// Track currently open badge so only one can be open at a time
let activeCloser: (() => void) | null = null;

const CurriculumBadge = ({ code, title, description, year, strand }: CurriculumBadgeProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 transition-colors"
        style={{
          backgroundColor: "#E1F5EE",
          border: "0.5px solid #5DCAA5",
          color: "#0F6E56",
          fontSize: "11px",
          padding: "3px 8px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D2EFE3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E1F5EE")}
        aria-expanded={open}
        aria-label={`Curriculum reference ${code}`}
      >
        <span>{code}</span>
        <ChevronDown
          size={12}
          style={{
            transition: "transform 150ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
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
            backgroundColor: "hsl(var(--background))",
            border: "0.5px solid #5DCAA5",
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.15)",
            animation: "curriculumFadeIn 150ms ease-out",
          }}
        >
          <div className="flex items-start justify-between">
            <span style={{ color: "#0F6E56", fontWeight: 500, fontSize: "13px" }}>{code}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
              style={{ lineHeight: 1, fontSize: "16px" }}
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
              color: "#0F6E56",
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "0.5px solid #9FE1CB",
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
