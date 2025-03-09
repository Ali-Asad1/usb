import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Switch } from "@renderer/components/ui/swtich";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { useEffect } from "react";

const SweepPage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();

  const calculateRange = (minFreq: number, maxFreq: number, freqStep: number) => {
    if (freqStep === 0) return 0; // جلوگیری از تقسیم بر صفر
    const constant = (Math.pow(2, 16) - 1) / (61.44 * Math.pow(10, 6));
    let calculatedValue = ((maxFreq - minFreq) / freqStep) * constant;

    calculatedValue = Number(calculatedValue.toString().slice(0, 8));

    return calculatedValue;
  };

  const processPacket = (packet: string) => {
    if (packet.includes("SWEEPF *REVERSE$$1")) {
      useDeviceSettings.getState().onChange({
        ...useDeviceSettings.getState().data,
        SWEEPF: { ...useDeviceSettings.getState().data.SWEEPF, REVERSE: 1 },
      });
      console.log("Packet processed: REVERSE set to 1");
    } else if (packet.includes("SWEEPF *REVERSE$$0")) {
      useDeviceSettings.getState().onChange({
        ...useDeviceSettings.getState().data,
        SWEEPF: { ...useDeviceSettings.getState().data.SWEEPF, REVERSE: 0 },
      });
      console.log("Packet processed: REVERSE set to 0");
    }
  };

  useEffect(() => {
    if (data.SWEEPF) {
      processPacket(`SWEEPF *REVERSE$$${data.SWEEPF.REVERSE}`);
    }
  }, [data.SWEEPF.REVERSE]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sweep </CardTitle>
        {/* <CardDescription>Change Sweep signals</CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            F<sub>min</sub> (Hz)
          </label>
          <Input
            type="number"
            placeholder="Min frequency (Hz)"
            min={-28000000}
            max={28000000}
            value={data.SWEEPF.MINFREQ}
            onChange={(e) => {
              let value = Number(e.target.value);

              // اطمینان از اینکه مقدار از -28000000 تا 28000000 است
              if (value < -28000000) {
                value = -28000000;
              } else if (value > 28000000) {
                value = 28000000;
              } else if (value > data.SWEEPF.MAXFREQ) {
                value = data.SWEEPF.MAXFREQ; // جلوگیری از بزرگ‌تر شدن از Fmax
              }

              onChange({ ...data, SWEEPF: { ...data.SWEEPF, MINFREQ: value } });
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            F<sub>max</sub> (Hz)
          </label>
          <Input
            type="number"
            placeholder="Max frequency (Hz)"
            min={-28000000}
            max={28000000}
            value={data.SWEEPF.MAXFREQ}
            onChange={(e) => {
              let value = Number(e.target.value);

              // محدودیت‌ها: Fmax نباید کوچکتر از Fmin شود
              if (value > 28000000) {
                value = 28000000;
              } else if (value < data.SWEEPF.MINFREQ) {
                value = data.SWEEPF.MINFREQ; // جلوگیری از کوچک‌تر شدن از Fmin
              }

              onChange({ ...data, SWEEPF: { ...data.SWEEPF, MAXFREQ: value } });
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Step (Hz)
          </label>
          <Input
            type="number"
            placeholder="Step"
            min={0}
            max={28000000}
            value={data.SWEEPF.STPFREQ}
            onChange={(e) => {
              let value = Number(e.target.value);

              // Validate the input value
              if (value < 0) {
                value = 0;
              } else if (value > 28000000) {
                value = 28000000;
              }

              onChange({ ...data, SWEEPF: { ...data.SWEEPF, STPFREQ: value } });
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Level (0-255)
          </label>
          <Input
            type="number"
            placeholder="Attenuation"
            min={0}
            max={255}
            value={data.SWEEPF.ATTENVL}
            onChange={(e) => {
              let value = Number(e.target.value);

              // Validate the input value
              if (value < 0) {
                value = 0;
              } else if (value > 255) {
                value = 255;
              }

              onChange({ ...data, SWEEPF: { ...data.SWEEPF, ATTENVL: value } });
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
          Reverse Sweep
        </div>
        {/* <div className="">Time: {calculateRange(data.SWEEPF.MINFREQ, data.SWEEPF.MAXFREQ, data.SWEEPF.STPFREQ)}S</div> */}
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Sweep Time (ms)
          </label>
          <Input
            type="number"
            min={0}
            max={calculateRange(data.SWEEPF.MINFREQ, data.SWEEPF.MAXFREQ, data.SWEEPF.STPFREQ) * 1000} // مقدار میلی‌ثانیه
            value={data.SWEEPF.SWPTIME * 1000} // نمایش مقدار به میلی‌ثانیه
            onChange={(e) => {
              let value = Number(e.target.value); // مقدار را مستقیماً دریافت کنیم

              // Validate the input value within range
              const maxRange = calculateRange(data.SWEEPF.MINFREQ, data.SWEEPF.MAXFREQ, data.SWEEPF.STPFREQ) * 1000; // حداکثر مقدار مجاز

              if (value < 0) {
                value = 0;
              } else if (value > maxRange) {
                value = maxRange;
              }

              // محدود کردن مقدار به 8 رقم
              value = Number(value.toString().slice(0, 8));

              // ارسال مقدار به ثانیه برای backend
              onChange({ ...data, SWEEPF: { ...data.SWEEPF, SWPTIME: value / 1000 } });
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <ActionButtons values={data.SWEEPF} type="SWEEPF" />
      </CardFooter>
    </Card>
  );
};
export default SweepPage;
