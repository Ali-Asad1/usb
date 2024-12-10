import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@renderer/components/ui/toggle-group";
import { useState } from "react";

const SelectMode = (): JSX.Element => {
  const [mode, setMode] = useState<string>("ct");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mode</CardTitle>
        <CardDescription>change device mode</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup variant="outline" type="single" defaultValue={mode} onValueChange={setMode}>
          <ToggleGroupItem value="ct" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            CT
          </ToggleGroupItem>
          <ToggleGroupItem value="pulses" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            Pulses
          </ToggleGroupItem>
          <ToggleGroupItem value="r.pulse" className="data-[state=on]:bg-primary data-[state=on]:text-accent">
            R.Pulse
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
export default SelectMode;
