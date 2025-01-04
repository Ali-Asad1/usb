import { Button } from "@renderer/components/ui/button";
import { createPacket } from "@renderer/helper/packet";
import { DeviceSettingType, useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { Check, UnplugIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  values: Record<string, any>;
  type: keyof DeviceSettingType;
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
      switch (type) {
        case "SWEEPF":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "0"));
          break;
        case "DELDOP":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "1"));
          break;
        case "FNOISE":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "2"));
          break;
        case "MULTON":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "3"));
          break;
        case "SINGLE":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "3"));
          break;
        case "BARAGE":
          window.context.serialPort.write(createPacket("SET", "NIOSES", "NOISESS", "4"));
          break;
        default:
          break;
      }

      for (const key in data.LOFATT) {
        window.context.serialPort.write(createPacket("SET", "LOFATT", key, data.LOFATT[key]));
      }
      window.context.serialPort.write(createPacket("SET", "NOISES", "PSGMODE", data.NOISES.PSGMODE));

      if (data.NOISES.PSGMODE === "2") {
        window.context.serialPort.write(createPacket("SET", "NOISES", "ONDETER", data.NOISES.ONDETER));
        window.context.serialPort.write(createPacket("SET", "NOISES", "OFFDETR", data.NOISES.OFFDETR));
      } else if (data.NOISES.PSGMODE === "3") {
        window.context.serialPort.write(createPacket("SET", "NOISES", "ONSTOCH", data.NOISES.ONSTOCH));
        window.context.serialPort.write(createPacket("SET", "NOISES", "OFFSTOC", data.NOISES.OFFSTOC));
      }

      for (const attr in values) {
        if (values[attr] !== null) {
          window.context.serialPort.write(createPacket("SET", type, attr, values[attr]));
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
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 xl:w-1/2">
      <Button onClick={handleSubmit} className="col-span-1 w-full">
        Submit
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          onCancel();
        }}
        className="col-span-1 w-full"
      >
        Cancel
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          onReset();
        }}
        className="col-span-1 w-full"
      >
        Reset
      </Button>
    </div>
  );
};

export default ActionButtons;
