import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Slider } from "@renderer/components/ui/slider";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { cn } from "@renderer/lib/utils";

const Frequency = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency</CardTitle>
        <CardDescription>change device frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <span>max</span>
          <span>min</span>
        </div>
        <Slider
          value={[data.LOFATT.TXATTEN]}
          onValueChange={(values) => {
            onChange({ ...data, LOFATT: { ...data.LOFATT, TXATTEN: values[0] } });
          }}
          min={0}
          max={70}
          step={1}
        />
        {/* <div
          className={cn(
            "mt-5 w-full rounded-md bg-primary px-5 py-1 font-semibold text-accent transition-colors",
            data.LOFATT.TXATTEN >= 50
              ? "bg-red-500"
              : data.LOFATT.TXATTEN >= 30
                ? "bg-yellow-500"
                : data.LOFATT.TXATTEN >= 0 && "bg-primary",
          )}
        >
          {data.LOFATT.TXATTEN} dBm
        </div> */}
        <div className="mt-5">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Local Oscillator frequency (Hz)
          </label>
          <Input
            type="number"
            placeholder="Local Oscillator (LO) frequency (Hz)"
            min={70}
            max={6000000000}
            value={data.LOFATT.LOFRQCY}
            onChange={(e) => {
              onChange({ ...data, LOFATT: { ...data.LOFATT, LOFRQCY: e.target.value } });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default Frequency;
