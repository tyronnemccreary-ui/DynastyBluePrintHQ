import { cn } from "@/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-blueprint-900/70 shadow-command backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
