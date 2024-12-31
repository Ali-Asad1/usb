import { Button } from "@renderer/components/ui/button";
import { createPacket, parsePacket } from "@renderer/helper/packet";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { ConnectionStatus } from "@renderer/components/widget/device-status";

interface Props {
  values: Record<string, any>;
  type: string;
  connectionStatus: ConnectionStatus; // اضافه کردن connectionStatus به Props
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ActionButtons = ({ values, type, connectionStatus }: Props) => {
  const { history, data, onCancel, onReset, onSubmit, setOnInitial } = useDeviceSettings();
  const { onCancel: onModeCancel, onReset: onModeReset, onSubmit: onModeSubmit } = useDeviceMode();

  
  const handleSubmit = async () => { 
    if (connectionStatus !== "connected") { // چک کردن connectionStatus
      toast("Please connect to a port first", {
        icon: <XIcon className="text-red-600" />,
      });
      return;
    } 
    onSubmit();
    onModeSubmit();

    try {
      for (const key in data.LOFATT) {
        if (data.LOFATT[key] !== null) {
          window.context.serialPort.write(createPacket("SET", key, "LOFATT", data.LOFATT[key]));
          await delay(100); // اضافه کردن تأخیر 100 میلی‌ثانیه
        }
      }

      window.context.serialPort.write(createPacket("SET", "PSGMODE", "NOISES", data.NOISES.PSGMODE));
      await delay(100); // تأخیر برای این ارسال

      for (const attr in values) {
        if (values[attr] !== null) {
          window.context.serialPort.write(createPacket("SET", attr, type, values[attr]));
          await delay(100); // اضافه کردن تأخیر 500 میلی‌ثانیه
        }
      }

      toast("Data set successfully", {
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
      if (!parsedResponse) {
        return; // اگر پاسخ قابل پردازش نیست، خروج
      }
  
      const validResponses = ["ok", "~valid"]; // پاسخ‌های معتبر
      if (!validResponses.includes(parsedResponse.data.toLowerCase())) {
        return; // ایگنور کردن پاسخ‌های نامعتبر
      }
  
      if (parsedResponse.data.toLowerCase() !== "ok") {
        console.log("reset");
        setOnInitial(parsedResponse.type, parsedResponse.attribute);
      }
  
      toast(`data ${parsedResponse.attribute}: ${parsedResponse.data}`, {
        icon:
          parsedResponse.data.toLowerCase() === "ok" ? (
            <Check className="text-green-600" />
          ) : (
            <XIcon className="text-red-600" />
          ),
      });
    };
  
    window.context.serialPort.onData(handleResponse);
  
    return () => {
      window.context.serialPort.removeOnData();
    };
  }, []);

  return (
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
  );
};

export default ActionButtons;
