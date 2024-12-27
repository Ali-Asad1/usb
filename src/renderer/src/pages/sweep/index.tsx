import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Switch } from "@renderer/components/ui/swtich";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const SweepPage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  const calculateRange = (minFreq: number, maxFreq: number, freqStep: number) => {
    const constant = (Math.pow(2, 16) - 1) / (61.44 * Math.pow(10, 6));

    const calculatedValue = ((maxFreq - minFreq) / freqStep) * constant;

    return calculatedValue;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sweep signal</CardTitle>
        <CardDescription>Change Sweep signals</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Min Freq (Hz)
          </label>
          <Input
            type="number"
            placeholder="Min frequency (Hz)"
            min={-28000000}
            max={28000000}
            value={data.SWEEPF.MINFREQ}
            onChange={(e) => {
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, MINFREQ: e.target.value } });
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Max Freq (Hz)
          </label>
          <Input
            type="number"
            placeholder="Max frequency (Hz)"
            min={-28000000}
            max={28000000}
            value={data.SWEEPF.MAXFREQ}
            onChange={(e) => {
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, MAXFREQ: e.target.value } });
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Step
          </label>
          <Input
            type="number"
            placeholder="Step"
            min={0}
            max={28000000}
            value={data.SWEEPF.STPFREQ}
            onChange={(e) => {
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, STPFREQ: e.target.value } });
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attenuation
          </label>
          <Input
            type="number"
            placeholder="Attenuation"
            min={0}
            max={255}
            value={data.SWEEPF.ATTENVL}
            onChange={(e) => {
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, ATTENVL: e.target.value } });
            }}
          />
        </div>

        <div className="flex items-center gap-x-2">
          <Switch
            checked={data.SWEEPF.REVERSE === 1 ? true : false}
            onCheckedChange={(checked) => {
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, REVERSE: checked ? 1 : 0 } });
            }}
          />
          Reverse
        </div>
        <div className="">Time: {calculateRange(data.SWEEPF.MINFREQ, data.SWEEPF.MAXFREQ, data.SWEEPF.STPFREQ)}S</div>
      </CardContent>
      <CardFooter>
        <ActionButtons values={data.SWEEPF} type="SWEEPF" />
      </CardFooter>
    </Card>
  );
};
export default SweepPage;
