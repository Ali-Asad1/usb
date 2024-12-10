import { Badge } from "@renderer/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";

const AnalyticsReport = (): JSX.Element => {
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
            Frequency Value: <Badge variant="secondary">0</Badge>
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
export default AnalyticsReport;
