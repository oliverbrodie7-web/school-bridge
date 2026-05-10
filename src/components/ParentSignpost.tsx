import { Link } from "react-router-dom";

interface ParentSignpostProps {
  strategy: "split" | "plus10" | "halvesQuartersEighths";
}

const ParentSignpost = ({ strategy }: ParentSignpostProps) => (
  <div className="mt-12 mb-2 w-full text-center">
    <Link
      to={`/parent?strategy=${strategy}`}
      className="inline-block hover:underline"
      style={{
        fontSize: 12,
        color: "var(--color-text-tertiary, hsl(var(--muted-foreground)))",
      }}
    >
      Parent? See the guide for this topic →
    </Link>
  </div>
);

export default ParentSignpost;
