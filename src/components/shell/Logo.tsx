export function Logo({ size = "md", showIcon = true }: { size?: "sm" | "md" | "lg"; showIcon?: boolean }) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  const iconSize = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-6 w-6" : "h-8 w-8";
  
  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <img 
          src="/images/erasmuse-icon.jpg" 
          alt="ERASMuse" 
          className={`${iconSize} rounded-lg object-cover`}
        />
      )}
      <span className={`font-display font-extrabold tracking-tight ${text} leading-none`}>
        <span className="text-primary dark:text-slate-50">ERAS</span>
        <span className="bg-gradient-to-br from-accent to-coral bg-clip-text text-transparent">M</span>
        <span className="text-primary dark:text-slate-50">use</span>
      </span>
    </div>
  );
}
