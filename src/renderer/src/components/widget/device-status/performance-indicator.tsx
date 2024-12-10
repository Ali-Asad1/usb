import { cn } from "@renderer/lib/utils";

interface Props extends React.ComponentProps<"div"> {
  value: number;
}

const PerformanceIndicator: React.FC<Props> = ({ value = 0, className, ...props }): JSX.Element => {
  return (
    <div
      className={cn("relative flex h-36 w-24 overflow-hidden rounded-lg border-4 border-slate-700", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute bottom-0 w-full transition-all duration-300",
          value > 60 ? "bg-green-600" : value > 30 ? "bg-yellow-500" : "bg-red-600",
        )}
        style={{ height: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold",
          value > 60 ? "text-accent" : value > 30 ? "text-accent-foreground" : "text-accent-foreground",
        )}
      >
        {value}%
      </span>
    </div>
  );
};
export default PerformanceIndicator;
