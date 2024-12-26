import { Button } from "@renderer/components/ui/button";
import { createPacket } from "@renderer/helper/packet";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ActionButtons = () => {
  const { history, data, onCancel, onReset, onSubmit } = useDeviceSettings();
  const { onCancel: onModeCancel, onReset: onModeReset, onSubmit: onModeSubmit } = useDeviceMode();

  // State برای نگهداری زمان آخرین فعالیت
  const [lastSubmitTime, setLastSubmitTime] = useState<string | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = () => {
    onSubmit();
    onModeSubmit();

    try {
      for (const type in data) {
        for (const attr in data[type]) {
          if (data[type][attr] !== null) {
            window.context.serialPort.write(createPacket("SET", attr, type, data[type][attr]));
            delay(100);
          }
        }
      }

      const currentTime = new Date().toLocaleTimeString();
      setLastSubmitTime(currentTime); // بروزرسانی زمان آخرین فعالیت

      toast(`Data set successfully at ${currentTime}`, {
        icon: <Check className="text-green-600" />,
      });
    } catch (err: any) {
      toast(err ?? "Data set failed", {
        icon: <Check className="text-red-600" />,
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-5">
        <Button onClick={handleSubmit} className="w-32">
          Submit
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.log(history, data);
            onCancel();
            onModeCancel();
          }}
          className="w-32"
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onReset();
            onModeReset();
          }}
          className="w-32"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
