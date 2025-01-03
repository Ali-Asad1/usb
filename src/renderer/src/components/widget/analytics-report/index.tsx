import { Badge } from "@renderer/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const modeEnum = {
  0: "None",
  1: "CT",
  2: "Pulses",
  3: "R.Pulses",
};

const AnalyticsReport = (): JSX.Element => {
  const { data } = useDeviceSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Report</CardTitle>
        <CardDescription>Analytics connected device</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            Selected USB: <Badge variant="secondary">none</Badge>
          </p>
          <p>
            Frequency Value: <Badge variant="secondary">{data.LOFATT.TXATTEN}</Badge>
          </p>
          <p>
            Mode: <Badge variant="secondary">{modeEnum[data.NOISES.PSGMODE]}</Badge>
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AnalyticsReport;
