import { createPacket } from "@renderer/helper/packet";
import { cn } from "@renderer/lib/utils";
import { useEffect } from "react";

interface Props extends React.ComponentProps<"div"> {
  value: number;
}

const PerformanceIndicator: React.FC<Props> = ({ value, className, ...props }): JSX.Element => {
  const updatePower = async () => {
    const portInfo = await window.context.serialPort.portInfo();

    if (portInfo) {
      window.context.serialPort.write(createPacket("GET", "DPOWER", "TXPOWER", ""));
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePower();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative mb-10 flex h-36 w-24 shrink-0 overflow-hidden rounded-lg border-4 border-slate-700",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute bottom-0 w-full transition-all duration-300",
          value > -10 ? "bg-green-600" : value > -50 ? "bg-yellow-500" : "bg-red-600",
        )}
        style={{ height: `${Math.floor(((value + 90) / 110) * 100)}%` }}
      />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold",
          value > 70 ? "text-accent" : value > 50 ? "text-accent-foreground" : "text-accent-foreground",
        )}
      >
        {value}%
      </span>
    </div>
  );
};
export default PerformanceIndicator;
