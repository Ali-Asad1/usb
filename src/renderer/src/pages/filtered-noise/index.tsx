import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Switch } from "@renderer/components/ui/swtich";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const FilteredNoisePage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtered Noise</CardTitle>
        <CardDescription>Change filtered noise</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
             Freq 
          </label>
        <select
          defaultValue={data.FNOISE.NOISEBW}
          onChange={(e) => {
            onChange({ ...data, FNOISE: { ...data.FNOISE, NOISEBW: +e.target.value } });
          }}
          className="rounded-md border px-3 py-2 ring ring-transparent focus-within:outline-none focus-within:ring-primary"
        >
          <option value={56000000}>56000000</option>
          <option value={20000000}>20000000</option>
          <option value={8000000}>8000000</option>
          <option value={5000000}>5000000</option>
          <option value={2000000}>2000000</option>
          <option value={1000000}>1000000</option>
        </select>
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Shift Noise (Hz)
          </label>
          <Input
            type="number"
            placeholder="Shift noise (Hz)"
            min={-27500000}
            max={27500000}
            value={data.FNOISE.SHFFREQ}
            onChange={(e) => {
              onChange({ ...data, FNOISE: { ...data.FNOISE, SHFFREQ: e.target.value } });
            }}
          />
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            checked={data.FNOISE.SHFENBL === 1 ? true : false}
            onCheckedChange={(checked) => {
              onChange({ ...data, FNOISE: { ...data.FNOISE, SHFENBL: checked ? 1 : 0 } });
            }}
          />
          Enable Shift
        </div>
      </CardContent>
      <CardFooter>
        <ActionButtons />
      </CardFooter>
    </Card>
  );
};
export default FilteredNoisePage;
