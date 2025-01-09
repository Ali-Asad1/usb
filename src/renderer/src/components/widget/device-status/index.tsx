import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import PerformanceIndicator from "./performance-indicator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, CheckIcon, Loader2Icon, Unplug, XIcon } from "lucide-react";
import { createPacket, parsePacket } from "@renderer/helper/packet";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";
import { sleep } from "@renderer/utils/sleep";
import ExitButton from "./exit-button";

type ConnectionStatus = "idle" | "loading" | "connected" | "error" | "disconnect";
type ListStatus = "loading" | "success" | "failure";

const DeviceStatus = (): JSX.Element => {
  const { data, updateField, setOnInitial } = useDeviceSettings();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [listStatus, setListStatus] = useState<ListStatus>("loading");

  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState<null | any>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const connectToPort = async () => {
    setConnectionStatus("loading");
    try {
      await window.context.serialPort.connect(selectedPort);
      setConnectionStatus("connected");
      toast(`Connected to port ${selectedPort}`, {
        icon: <Check className="text-green-600" />,
      });
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

  const getAllData = async () => {
    const port = await window.context.serialPort.portInfo();
    if (port) {
      for (const type in data) {
        for (const attr in data[type]) {
          window.context.serialPort.write(createPacket("GET", type, attr, ""));
        }
      }
    }
  };

  const handleRefresh = async () => {
    const port = await window.context.serialPort.portInfo();
    if (port && connectionStatus === "connected" && !isRefreshing) {
      setIsRefreshing(true);
      toast("Refreshing...", {
        id: "refresh-loading",
        icon: <Loader2Icon className="animate-spin text-blue-600 duration-1000" />,
      });
      await getAllData();
      await sleep(3000);
      setIsRefreshing(false);
      toast("Refresh finished", {
        id: "refresh-loading",
        icon: <CheckIcon className="text-green-600" />,
      });
    }
  };

  const disconnect = () => {
    window.context.serialPort.disconnect();
    setConnectionStatus("disconnect");
    toast("Port Disconnected", {
      icon: <Unplug className="text-red-600" />,
    });
  };

  const handleResponse = (chunk: string) => {
    const parsedResponse = parsePacket(chunk);
    if (parsedResponse) {
      switch (parsedResponse.method) {
        case "SET": {
          switch (parsedResponse.data.toLowerCase()) {
            case "ok":
              toast(`Data ${parsedResponse.attribute}: set successfully`, {
                icon: <CheckIcon className="text-green-600" />,
              });
              break;

            default:
              toast(`Error ${parsedResponse.attribute}: ${parsedResponse.data}`, {
                icon: <XIcon className="text-red-600" />,
              });
              setOnInitial(parsedResponse.type, parsedResponse.attribute);
              break;
          }
          break;
        }

        case "GET": {
          updateField(parsedResponse.type, parsedResponse.attribute, parsedResponse.data);
          break;
        }

        default:
          break;
      }
    }
  };

  useEffect(() => {
    getAllPorts();

    window.context.serialPort.onData(handleResponse);

    return () => {
      window.context.serialPort.removeOnData();
    };
  }, []);

  useEffect(() => {
    if (connectionStatus === "connected") {
      getAllData();
    }
  }, [connectionStatus]);

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
      <div className="flex h-full flex-col overflow-y-auto rounded-lg bg-card px-3 py-5 shadow-lg">
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
            <p className="text-muted-foreground">Baundrate:</p>
            <Badge variant="secondary">115200 </Badge>
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Last Activity:</p>
            <Badge variant="secondary">5m ago</Badge>
          </div> */}
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
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRefresh}
            disabled={connectionStatus !== "connected"}
          >
            Refresh
          </Button>
          <select
            onChange={(e) => setSelectedPort(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 focus-within:outline-none"
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
        <PerformanceIndicator value={+data.DPOWER.TXPOWER} className="mx-auto mt-10" />
        <div className="mt-0 space-y-5 text-center text-sm text-muted-foreground">Output Power (dbm)</div>
        <ExitButton />
      </div>
    </div>
  );
};

export default DeviceStatus;
