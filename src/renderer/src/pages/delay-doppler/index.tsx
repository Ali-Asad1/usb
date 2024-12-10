import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Switch } from "@renderer/components/ui/swtich";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const DelayDopplerPage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delay/Doppler signal</CardTitle>
        <CardDescription>Change Delay/Doppler frequencies</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5">
        <div className="flex items-center gap-x-2">
          <Switch
            checked={data.DELDOP.DELAYEN === 1 ? true : false}
            onCheckedChange={(checked) => {
              onChange({ ...data, DELDOP: { ...data.DELDOP, DELAYEN: checked ? 1 : 0 } });
            }}
          />
          Enable Delay
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            checked={data.DELDOP.DOPLREN === 1 ? true : false}
            onCheckedChange={(checked) => {
              onChange({ ...data, DELDOP: { ...data.DELDOP, DOPLREN: checked ? 1 : 0 } });
            }}
          />
          Enable Doppler shift
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Shift Noise (Hz)
          </label>
          <select
            defaultValue={data.DELDOP.DLYVALU / 100}
            onChange={(e) => {
              onChange({ ...data, DELDOP: { ...data.DELDOP, DLYVALU: +e.target.value * 100 } });
            }}
            className="block w-full rounded-md border px-3 py-2 ring ring-transparent focus-within:outline-none focus-within:ring-primary"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
            <option value={14}>14</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Shift Noise (Hz)
          </label>
          <Input
            type="number"
            placeholder="Doppler Shift (Hz)"
            min={-28000000}
            max={28000000}
            value={data.DELDOP.DOPFREQ}
            onChange={(e) => {
              onChange({ ...data, DELDOP: { ...data.DELDOP, DOPFREQ: e.target.value } });
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <ActionButtons />
      </CardFooter>
    </Card>
  );
};
export default DelayDopplerPage;
