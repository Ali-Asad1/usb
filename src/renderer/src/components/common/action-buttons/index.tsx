import { Button } from "@renderer/components/ui/button";
import { createPacket } from "@renderer/helper/packet";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check, UnplugIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  values: Record<string, any>;
  type: string;
}

const ActionButtons = ({ values, type }: Props) => {
  const { data, onCancel, onReset, onSubmit } = useDeviceSettings();

  const handleSubmit = async () => {
    const port = await window.context.serialPort.portInfo();

    if (!port) {
      toast("Port isn't connected", { icon: <UnplugIcon className="text-red-600" /> });
      return;
    }

    try {
      for (const key in data.LOFATT) {
        window.context.serialPort.write(createPacket("SET", key, "LOFATT", data.LOFATT[key]));
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

      onSubmit();

      toast("Data set successfully", {
        icon: <Check className="text-green-600" />,
      });
    } catch (err: any) {
      toast("Data set failed", {
        icon: <XIcon className="text-red-600" />,
      });
    }
  };

  return (
    <div className="flex gap-x-5">
      <Button onClick={handleSubmit} className="w-32">
        Submit
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          onCancel();
        }}
        className="w-32"
      >
        Cancel
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          onReset();
        }}
        className="w-32"
      >
        Reset
      </Button>
    </div>
  );
};

export default ActionButtons;
