import { Link, useLocation } from "react-router-dom";

const SiteHeader = () => {
  const { pathname } = useLocation();

  // Route-aware: pick the correct strategy based on the current route.
  // If we're not on a known strategy route, hide the link entirely.
  let strategy: "split" | "plus10" | "halvesQuartersEighths" | null = null;
  const lower = pathname.toLowerCase();
  if (lower.includes("split-strategy") || lower.includes("splitstrategy")) {
    strategy = "split";
  } else if (lower.includes("plus10") || lower.includes("plusten")) {
    strategy = "plus10";
  } else if (lower.includes("halves") || lower.includes("halvesquarterseighths")) {
    strategy = "halvesQuartersEighths";
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white" style={{ borderBottom: '1px solid #E1F5EE' }}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: "#1D9E75" }}
        >
          [Site Name]
        </Link>
        {strategy && (
          <Link
            to={`/parent?strategy=${strategy}`}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Parent Guide
          </Link>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
