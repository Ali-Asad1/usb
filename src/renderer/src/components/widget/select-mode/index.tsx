import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Switch } from "@renderer/components/ui/swtich";
import { ToggleGroup, ToggleGroupItem } from "@renderer/components/ui/toggle-group";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const SelectMode = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();
  const { data: mode, onChange: onModeChange } = useDeviceMode();

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
            if (value) {
              onChange({ ...data, NOISES: { ...data.NOISES, PSGMODE: value ? value : data.NOISES.PSGMODE } });
              onModeChange({ ...mode, mode: value });
            }
          }}
        >
          <ToggleGroupItem value="0" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            None
          </ToggleGroupItem>
          <ToggleGroupItem value="1" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            CT
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="px-0 data-[state=on]:bg-primary data-[state=on]:text-accent">
            <Popover>
              <PopoverTrigger className="size-full px-3">Pulses</PopoverTrigger>
              <PopoverContent className="flex w-fit items-center gap-x-5">
                Deterministic
                <Switch
                  checked={mode.deterministic}
                  onCheckedChange={(checked) => {
                    onModeChange({ ...mode, deterministic: checked });
                  }}
                />
              </PopoverContent>
            </Popover>
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="px-0 data-[state=on]:bg-primary data-[state=on]:text-accent">
            <Popover>
              <PopoverTrigger className="size-full px-3">R.Pulses</PopoverTrigger>
              <PopoverContent className="flex w-fit items-center gap-x-5">
                Stochastic
                <Switch
                  checked={mode.stochastic}
                  onCheckedChange={(checked) => {
                    onModeChange({ ...mode, stochastic: checked });
                  }}
                />
              </PopoverContent>
            </Popover>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
export default SelectMode;
