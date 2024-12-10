import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@renderer/components/ui/toggle-group";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const SelectMode = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mode</CardTitle>
        <CardDescription>change device mode</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          variant="outline"
          type="single"
          value={data.NOISES.PSGMODE}
          onValueChange={(value) => {
            onChange({ ...data, NOISES: { ...data.NOISES, PSGMODE: value } });
          }}
        >
          <ToggleGroupItem value="0" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            None
          </ToggleGroupItem>
          <ToggleGroupItem value="1" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            CT
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            Pulses
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            R.Pulse
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
export default SelectMode;
