import ActionButtons from "@renderer/components/common/action-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const PulseGeneratorPage = (): JSX.Element => {
  const { data, onChange } = useDeviceSettings();
  const { data: deviceMode } = useDeviceMode();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pulse generator </CardTitle>
        <CardDescription>Change Pulse signals</CardDescription>
      </CardHeader>
      <CardContent>
        {deviceMode.mode === "2" && (
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              deterministic
            </label>
            <Input
              type="number"
              placeholder="deterministic"
              min={-28000000}
              max={28000000}
              value={deviceMode.deterministic ? (data.NOISES.ONDETER ?? 0) : (data.NOISES.OFFDETR ?? 0)}
              onChange={(e) => {
                console.log(e.target.value);
                console.log(data.NOISES);
                if (deviceMode.deterministic) {
                  onChange({
                    ...data,
                    NOISES: { ...data.NOISES, ONDETER: e.target.value, OFFDETR: null, ONSTOCH: null, OFFSTOC: null },
                  });
                } else {
                  onChange({
                    ...data,
                    NOISES: { ...data.NOISES, OFFDETR: e.target.value, ONDETER: null, ONSTOCH: null, OFFSTOC: null },
                  });
                }
              }}
            />
          </div>
        )}
        {deviceMode.mode === "3" && (
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              stochastic
            </label>
            <Input
              type="number"
              placeholder="stochastic"
              min={-28000000}
              max={28000000}
              value={deviceMode.stochastic ? (data.NOISES.ONSTOCH ?? 0) : (data.NOISES.OFFSTOC ?? 0)}
              onChange={(e) => {
                console.log(e.target.value);
                console.log(data.NOISES);
                if (deviceMode.stochastic) {
                  onChange({
                    ...data,
                    NOISES: {
                      ...data.NOISES,
                      ONSTOCH: e.target.value,
                      OFFSTOC: null,
                      OFFDETR: null,
                      ONDETER: null,
                    },
                  });
                } else {
                  onChange({
                    ...data,
                    NOISES: {
                      ...data.NOISES,
                      OFFSTOC: e.target.value,
                      ONSTOCH: null,
                      OFFDETR: null,
                      ONDETER: null,
                    },
                  });
                }
              }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <ActionButtons />
      </CardFooter>
    </Card>
  );
};
export default PulseGeneratorPage;
