// MenuCard — shared interactive card for all menu/navigation screens.
// Do NOT use in Learn phases, Practise sections, Parent Guides, or entry points.
// Home screen profile cards also excluded (portrait variant with overlay —
// refactor separately when ready).

import { ReactNode, CSSProperties } from "react";
import { Link } from "react-router-dom";

interface MenuCardProps {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const MenuCard = ({
  to,
  onClick,
  active = true,
  delayMs = 0,
  className = "",
  style,
  children,
}: MenuCardProps) => {
  const baseStyle: CSSProperties = active
    ? {
        background: "var(--colour-card-bg)",
        border: "1.5px solid var(--colour-card-border)",
        borderRadius: "var(--border-radius-card)",
        boxShadow: "var(--shadow-card)",
        padding: "var(--card-padding)",
        cursor: "pointer",
        animation: "var(--animation-bounce-in)",
        animationDelay: `${delayMs}ms`,
        ...style,
      }
    : {
        background: "#F5F0E8",
        border: "1.5px solid var(--colour-card-border)",
        borderRadius: "var(--border-radius-card)",
        padding: "var(--card-padding)",
        opacity: 0.65,
        cursor: "default",
        ...style,
      };

  const classes = `menu-card ${
    active ? "menu-card-active" : "menu-card-inactive"
  } ${className}`.trim();

  if (active && to) {
    return (
      <Link to={to} className={classes} style={baseStyle} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} style={baseStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default MenuCard;
