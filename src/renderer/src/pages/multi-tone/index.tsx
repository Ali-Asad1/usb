import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { Input } from "@renderer/components/ui/input";
import { calculateDecimal, decimalToBinaryArray } from "@renderer/helper/decimal";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const MultiTonePage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi Tone signals</CardTitle>
        <CardDescription>change multi tone frequencies</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-5">
      {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
             Freq (Hz)
          </label> */}
        <Input
          type="number"
          placeholder="frequency-0 (Hz) "
          min={-28000000}
          max={28000000}
          value={data.MULTON.FREQCY0}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, FREQCY0: e.target.value } });
          }}
        />
        {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Attenuation
          </label> */}
        <Input
          type="number"
          placeholder="Attenuation-0"
          min={0}
          max={255}
          value={data.MULTON.ATTENV0}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, ATTENV0: e.target.value } });
          }}
        />
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={!!decimalToBinaryArray(data.MULTON.MSELECT)[0]}
            onCheckedChange={(checked) => {
              const newData = [...decimalToBinaryArray(data.MULTON.MSELECT)];
              newData[0] = checked ? 1 : 0;
              onChange({ ...data, MULTON: { ...data.MULTON, MSELECT: calculateDecimal(newData) } });
            }}
          />
          Select
        </div>
        <Input
          type="number"
          placeholder="frequency-1 (Hz) "
          min={-28000000}
          max={28000000}
          value={data.MULTON.FREQCY1}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, FREQCY1: e.target.value } });
          }}
        />
        <Input
          type="number"
          placeholder="Attenuation-1"
          min={0}
          max={255}
          value={data.MULTON.ATTENV1}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, ATTENV1: e.target.value } });
          }}
        />
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={!!decimalToBinaryArray(data.MULTON.MSELECT)[1]}
            onCheckedChange={(checked) => {
              const newData = [...decimalToBinaryArray(data.MULTON.MSELECT)];
              newData[1] = checked ? 1 : 0;
              onChange({ ...data, MULTON: { ...data.MULTON, MSELECT: calculateDecimal(newData) } });
            }}
          />
          Select
        </div>
        <Input
          type="number"
          placeholder="frequency-2 (Hz) "
          min={-28000000}
          max={28000000}
          value={data.MULTON.FREQCY2}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, FREQCY2: e.target.value } });
          }}
        />
        <Input
          type="number"
          placeholder="Attenuation-2"
          min={0}
          max={255}
          value={data.MULTON.ATTENV2}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, ATTENV2: e.target.value } });
          }}
        />
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={!!decimalToBinaryArray(data.MULTON.MSELECT)[2]}
            onCheckedChange={(checked) => {
              const newData = [...decimalToBinaryArray(data.MULTON.MSELECT)];
              newData[2] = checked ? 1 : 0;
              onChange({ ...data, MULTON: { ...data.MULTON, MSELECT: calculateDecimal(newData) } });
            }}
          />
          Select
        </div>
        <Input
          type="number"
          placeholder="frequency-3 (Hz) "
          min={-28000000}
          max={28000000}
          value={data.MULTON.FREQCY3}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, FREQCY3: e.target.value } });
          }}
        />
        <Input
          type="number"
          placeholder="Attenuation-3"
          min={0}
          max={255}
          value={data.MULTON.ATTENV3}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, ATTENV3: e.target.value } });
          }}
        />
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={!!decimalToBinaryArray(data.MULTON.MSELECT)[3]}
            onCheckedChange={(checked) => {
              const newData = [...decimalToBinaryArray(data.MULTON.MSELECT)];
              newData[3] = checked ? 1 : 0;
              onChange({ ...data, MULTON: { ...data.MULTON, MSELECT: calculateDecimal(newData) } });
            }}
          />
          Select
        </div>
        <Input
          type="number"
          placeholder="frequency-4 (Hz) "
          min={-28000000}
          max={28000000}
          value={data.MULTON.FREQCY4}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, FREQCY4: e.target.value } });
          }}
        />
        <Input
          type="number"
          placeholder="Attenuation-4"
          min={0}
          max={255}
          value={data.MULTON.ATTENV4}
          onChange={(e) => {
            onChange({ ...data, MULTON: { ...data.MULTON, ATTENV4: e.target.value } });
          }}
        />
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={!!decimalToBinaryArray(data.MULTON.MSELECT)[4]}
            onCheckedChange={(checked) => {
              const newData = [...decimalToBinaryArray(data.MULTON.MSELECT)];
              newData[4] = checked ? 1 : 0;
              onChange({ ...data, MULTON: { ...data.MULTON, MSELECT: calculateDecimal(newData) } });
            }}
          />
          Select
        </div>
      </CardContent>
      <CardFooter>
        <ActionButtons values={data.MULTON} type="MULTON" />
      </CardFooter>
    </Card>
  );
};
export default MultiTonePage;
