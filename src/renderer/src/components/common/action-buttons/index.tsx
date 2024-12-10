import { Button } from "@renderer/components/ui/button";
import { createPacket } from "@renderer/helper/packet";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check } from "lucide-react";
import { toast } from "sonner";

const ActionButtons = () => {
  const { data, onCancel, onReset, onSubmit } = useDeviceSettings();

  const handleSubmit = () => {
    onSubmit();

    try {
      for (const type in data) {
        for (const attr in data[type]) {
          window.context.serialPort.write(createPacket("SET", attr, type, data[type][attr]));
        }
      }

      toast("Data set successfully", {
        icon: <Check className="text-green-600" />,
      });
    } catch (err: any) {
      toast(err ?? "Data set failed", {
        icon: <Check className="text-red-600" />,
      });
    }
  };

  return (
    <div className="flex gap-x-5">
      <Button onClick={handleSubmit} className="w-32">
        Submit
      </Button>
      <Button variant="destructive" onClick={onCancel} className="w-32">
        Cancel
      </Button>
      <Button variant="secondary" onClick={onReset} className="w-32">
        Reset
      </Button>
    </div>
  );
};

export default ActionButtons;
