import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
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
        <Slider
          value={[data.LOFATT.TXATTEN]}
          onValueChange={(values) => {
            onChange({ ...data, LOFATT: { ...data.LOFATT, TXATTEN: values[0] } });
          }}
          min={0}
          max={70}
          step={1}
        />
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            "w-full rounded-md bg-primary px-5 py-1 font-semibold text-accent transition-colors",
            data.LOFATT.TXATTEN >= 50
              ? "bg-red-500"
              : data.LOFATT.TXATTEN >= 30
                ? "bg-yellow-500"
                : data.LOFATT.TXATTEN >= 0 && "bg-primary",
          )}
        >
          {data.LOFATT.TXATTEN} dBm
        </div>
      </CardFooter>
    </Card>
  );
};
export default Frequency;
