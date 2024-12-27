import { Button } from "@renderer/components/ui/button";
import { createPacket, parsePacket } from "@renderer/helper/packet";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  values: Record<string, any>;
  type: string;
}

const ActionButtons = ({ values, type }: Props) => {
  const { history, data, onCancel, onReset, onSubmit, setOnInitial } = useDeviceSettings();
  const { onCancel: onModeCancel, onReset: onModeReset, onSubmit: onModeSubmit } = useDeviceMode();

  // State برای نگهداری زمان آخرین فعالیت
  const [lastSubmitTime, setLastSubmitTime] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit();
    onModeSubmit();

    try {
      for (const key in data.LOFATT) {
        if (data.LOFATT[key] !== null) {
          window.context.serialPort.write(createPacket("SET", key, "LOFATT", data.LOFATT[key]));
        }
      }
      window.context.serialPort.write(createPacket("SET", "PSGMODE", "NOISES", data.NOISES.PSGMODE));

      for (const attr in values) {
        if (values[attr] !== null) {
          window.context.serialPort.write(createPacket("SET", attr, type, values[attr]));
        }
      }

      const currentTime = new Date().toLocaleTimeString();
      setLastSubmitTime(currentTime); // بروزرسانی زمان آخرین فعالیت

      toast(`Data set successfully at ${currentTime}`, {
        icon: <Check className="text-green-600" />,
      });
    } catch (err: any) {
      toast(err ?? "Data set failed", {
        icon: <XIcon className="text-red-600" />,
      });
    }
  };

  useEffect(() => {
    const handleResponse = (data: string) => {
      const parsedResponse = parsePacket(data);
      if (parsedResponse && parsedResponse.data.toLowerCase() !== "ok") {
        console.log("reset");
        setOnInitial(parsedResponse.type, parsedResponse.attribute);
      }

      if (parsedResponse) {
        toast(`data ${parsedResponse.attribute}: ${parsedResponse.data}`, {
          icon:
            parsedResponse.data.toLocaleLowerCase() === "ok" ? (
              <Check className="text-green-600" />
            ) : (
              <XIcon className="text-red-600" />
            ),
        });
      }
    };

    window.context.serialPort.onData(handleResponse);

    return () => {
      window.context.serialPort.removeOnData();
    };
  }, []);

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
