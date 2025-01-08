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
        <CardTitle>RF Settings</CardTitle>
        {/* <CardDescription>Power Level</CardDescription> */}
      </CardHeader>
      <CardContent>
      <CardDescription>Power Level</CardDescription>
        <div className="mb-4 flex items-center justify-between">
          <span>max</span>
          <span>min</span>
        </div>
        <Slider
          value={[data.LOFATT.TXATTEN]}
          onValueChange={(values) => {
            onChange({ ...data, LOFATT: { ...data.LOFATT, TXATTEN: values[0] } });
          }}
          min={10}
          max={55}
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
           Frequency (Hz)
          </label>
          <Input
            type="number"
            placeholder="frequency (Hz)"
            min={150000000}
            max={5500000000}
            value={data.LOFATT.LOFRQCY}
            onChange={(e) => {
              let value = Number(e.target.value);

              // Validate the input value for the new range
              if (value < 150000000) {
                value = 150000000;
              } else if (value > 5500000000) {
                value = 5500000000;
              }

              onChange({ ...data, LOFATT: { ...data.LOFATT, LOFRQCY: value } });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default Frequency;
