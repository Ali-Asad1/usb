import { SerialPort } from "serialport";

type PortInfo = Awaited<ReturnType<typeof SerialPort.list>>[number];

declare global {
  interface Window {
    context: {
      serialPort: {
        list: () => Promise<PortInfo[]>;
        connect: (path: string) => Promise<void>;
        disconnect: () => void;
        write: (data: string) => void;
      };
    };
  }
}
