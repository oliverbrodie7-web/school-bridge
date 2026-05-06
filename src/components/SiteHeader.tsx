import { Link } from "react-router-dom";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: "hsl(var(--primary))" }}
        >
          [Site Name]
        </Link>
        <Link
          to="/parent"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Parent Guide
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
