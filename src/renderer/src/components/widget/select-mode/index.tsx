import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
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
                <div className="space-y-1">
                  <label>Deterministic On</label>
                  <Input
                    type="number"
                    min={0}
                    max={69900000}
                    value={data.NOISES.ONDETER}
                    placeholder="On Deterministic"
                    onChange={(e) => {
                      onChange({ ...data, NOISES: { ...data.NOISES, ONDETER: e.target.value } });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label>Deterministic Of</label>
                  <Input
                    type="number"
                    min={0}
                    max={69900000}
                    value={data.NOISES.OFFDETR}
                    placeholder="Off Deterministic"
                    onChange={(e) => {
                      onChange({ ...data, NOISES: { ...data.NOISES, OFFDETR: e.target.value } });
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="px-0 data-[state=on]:bg-primary data-[state=on]:text-accent">
            <Popover>
              <PopoverTrigger className="size-full px-3">R.Pulses</PopoverTrigger>
              <PopoverContent className="flex w-fit items-center gap-x-5">
                <div className="space-y-1">
                  <label>Stochastic On</label>
                  <Input
                    type="number"
                    min={0}
                    max={69900000}
                    value={data.NOISES.ONSTOCH}
                    placeholder="On Stochastic"
                    onChange={(e) => {
                      onChange({ ...data, NOISES: { ...data.NOISES, ONSTOCH: e.target.value } });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label>Stochastic Of</label>
                  <Input
                    type="number"
                    min={0}
                    max={69900000}
                    value={data.NOISES.OFFSTOC}
                    placeholder="Off Stochastic"
                    onChange={(e) => {
                      onChange({ ...data, NOISES: { ...data.NOISES, OFFSTOC: e.target.value } });
                    }}
                  />
                </div>
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
