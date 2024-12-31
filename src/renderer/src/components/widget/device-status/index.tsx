import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import PerformanceIndicator from "./performance-indicator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Unplug, XIcon } from "lucide-react";
import { parsePacket } from "@renderer/helper/packet";

export type ConnectionStatus = "idle" | "loading" | "connected" | "error" | "disconnect";
type ListStatus = "loading" | "success" | "failure";

const DeviceStatus = (): JSX.Element => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [listStatus, setListStatus] = useState<ListStatus>("loading");

  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState<null | any>(null);

  const connectToPort = async () => {
    setConnectionStatus("loading");
    try {
      await window.context.serialPort.connect(selectedPort);
      setConnectionStatus("connected");
      toast(`Connected to port ${selectedPort}`, {
        icon: <Check className="text-green-600" />,
      });
      // دستورات GET استاتیک
      const staticGetCommands = [
        "START! *GET!!!$$DELDOP *DOPFREQ$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *NOISESS$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *PSGMODE$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *ONDETER$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *OFFDETR$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *ONSTOCH$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$NOISES *OFFSTOC$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$LOFATT *LOFRQCY$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$LOFATT *TXATTEN$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
        "START! *GET!!!$$LOFATT *TXPOWER$$$$!!!!!!!$$RESERVED$$ENDOFPKT\n",
      ];

      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // تعریف تابع تأخیر
      const responses: string[] = []; // ذخیره پاسخ‌ها

      const handleResponse = (data: string) => {
        const parsedResponse = parsePacket(data);
        if (!parsedResponse) {
          return; // اگر پاسخ قابل پردازش نیست، خروج
        }

        const lowerCaseData = parsedResponse.data.toLowerCase();
        console.log(lowerCaseData);
        // responses.push(data); // ذخیره داده دریافتی
        // console.log("Received:", data); // نمایش در کنسول
      };

      // ثبت Listener
      window.context.serialPort.onData(handleResponse);

      // ارسال دستورات
      for (const command of staticGetCommands) {
        window.context.serialPort.write(command);
        await delay(100); // تأخیر 100 میلی‌ثانیه
      }

      // بررسی پاسخ‌ها
      await delay(500); // تأخیر اضافی برای دریافت تمام داده‌ها
      console.log("All Responses:", responses);
    } catch {
      setConnectionStatus("error");
      toast("Connecting to port failed", {
        icon: <XIcon className="text-red-600" />,
      });
    }
  };

  const getAllPorts = async () => {
    try {
      const portList = await window.context.serialPort.list();
      setPorts(portList);
      setListStatus("success");
    } catch {
      setListStatus("failure");
    }
  };

  const disconnect = async () => {
    window.context.serialPort.disconnect();
    setConnectionStatus("disconnect");
    toast("Port Disconnected", {
      icon: <Unplug className="text-red-600" />,
    });
  };

  useEffect(() => {
    getAllPorts();
  }, []);

  const renderStatusBadge = () => {
    switch (connectionStatus) {
      case "loading":
        return <Badge variant="secondary">Connecting...</Badge>;
      case "connected":
        return <Badge variant="default">Connected</Badge>;
      case "error":
        return <Badge variant="destructive">Connection Failed</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  return (
    <div className="h-screen w-72 shrink-0 p-5">
      <div className="h-full overflow-y-auto rounded-lg bg-card px-3 py-5 shadow-lg">
        <h2 className="mb-5 border-b border-border pb-2 text-lg font-semibold text-accent-foreground">
          Connection Info
        </h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Status:</p>
            {renderStatusBadge()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Port:</p>
            <Badge variant="secondary">{selectedPort || "none"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Speed:</p>
            <Badge variant="secondary">115200 baud</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Last Activity:</p>
            <Badge variant="secondary">5m ago</Badge>
          </div>
          <Button
            className="!mt-20 w-full"
            variant={connectionStatus === "connected" ? "destructive" : "default"}
            onClick={connectionStatus === "connected" ? disconnect : connectToPort}
            disabled={connectionStatus === "loading" || listStatus === "loading" || !selectedPort}
          >
            {connectionStatus === "loading"
              ? "Connecting"
              : connectionStatus === "connected"
                ? "Disconnect"
                : "Connect"}
          </Button>
          <select
            onChange={(e) => {
              if (connectionStatus === "connected") {
                alert("Please disconnect before changing the port.");
              } else {
                setSelectedPort(e.target.value);
              }
            }}
            className={`w-full rounded-md border border-border px-3 py-2 focus-within:outline-none ${
              connectionStatus === "connected" ? "cursor-not-allowed bg-gray-200 text-gray-400" : ""
            }`}
            disabled={connectionStatus === "connected"}
          >
            <option disabled selected>
              select port
            </option>
            {ports.map((port, index) => (
              <option key={index} value={port.path}>
                {port.path}
              </option>
            ))}
          </select>
        </div>
        {/* <PerformanceIndicator value={80} className="mx-auto mt-10" /> */}
      </div>
    </div>
  );
};

export default DeviceStatus;
