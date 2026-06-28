import { cn } from "@/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-turf-400 text-blueprint-950 hover:bg-[#ffc83d]",
  secondary: "border border-white/10 bg-white/[0.045] text-blueprint-50 hover:bg-white/10",
  ghost: "text-blueprint-200 hover:bg-white/[0.055] hover:text-white"
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-turf-400/60 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
