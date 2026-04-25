export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <span className={`font-display font-extrabold tracking-tight ${text} leading-none`}>
      <span className="text-primary">ERAS</span>
      <span className="bg-gradient-to-br from-accent to-coral bg-clip-text text-transparent">M</span>
      <span className="text-primary">use</span>
    </span>
  );
}
