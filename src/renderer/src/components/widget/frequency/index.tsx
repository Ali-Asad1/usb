import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Slider } from "@renderer/components/ui/slider";
import { createPacket } from "@renderer/helper/packet";
import { cn } from "@renderer/lib/utils";
import { Check, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Frequency = (): JSX.Element => {
  const [freqValue, setFreqValue] = useState<number[]>([0]);

  const handleChange = async (value: number[]) => {
    setFreqValue(value);
    const packet = createPacket("SET", "SWEEP", "FREQ", value[0]);

    try {
      window.context.serialPort.write(packet);
      toast(`FREQ changed : ${value[0]}`, {
        icon: <Check className="text-green-600" />,
      });
    } catch {
      toast("FREQ change failed", {
        icon: <XIcon className="text-red-600" />,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency</CardTitle>
        <CardDescription>change device frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <Slider defaultValue={freqValue} onValueChange={handleChange} min={0} max={100} step={1} />
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            "w-full rounded-md bg-primary px-5 py-1 font-semibold text-accent transition-colors",
            freqValue[0] >= 60
              ? "bg-red-500"
              : freqValue[0] >= 30
                ? "bg-yellow-500"
                : freqValue[0] >= 0 && "bg-primary",
          )}
        >
          {freqValue[0]} dBm
        </div>
      </CardFooter>
    </Card>
  );
};
export default Frequency;
