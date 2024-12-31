import { Button } from "@renderer/components/ui/button";
import { createPacket, parsePacket } from "@renderer/helper/packet";
import { useDeviceMode } from "@renderer/hooks/state/use-device-mode";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  values: Record<string, any>;
  type: string;
}

const ActionButtons = ({ values, type }: Props) => {
  const { history, data, onCancel, onReset, onSubmit, setOnInitial } = useDeviceSettings();
  const { onCancel: onModeCancel, onReset: onModeReset, onSubmit: onModeSubmit } = useDeviceMode();

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

      if (data.NOISES.PSGMODE === "2") {
        window.context.serialPort.write(createPacket("SET", "ONDETER", "NOISES", data.NOISES.ONDETER));
        window.context.serialPort.write(createPacket("SET", "OFFDETR", "NOISES", data.NOISES.OFFDETR));
      } else if (data.NOISES.PSGMODE === "3") {
        window.context.serialPort.write(createPacket("SET", "ONSTOCH", "NOISES", data.NOISES.ONSTOCH));
        window.context.serialPort.write(createPacket("SET", "OFFSTOC", "NOISES", data.NOISES.OFFSTOC));
      }

      for (const attr in values) {
        if (values[attr] !== null) {
          window.context.serialPort.write(createPacket("SET", attr, type, values[attr]));
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
      if (parsedResponse && parsedResponse.data.toLowerCase() !== "ok") {
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
