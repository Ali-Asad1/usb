import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
  throw new Error("contextIsolated must be enabled in browserWindow");
}

try {
  contextBridge.exposeInMainWorld("context", {
    serialPort: {
      list: () => ipcRenderer.invoke("serialport:list"),
      connect: (path: string) => ipcRenderer.invoke("serialport:connect", path),
      disconnect: () => ipcRenderer.invoke("serialport:disconnect"),
      write: (data: string) => ipcRenderer.invoke("serialport:write", data),
    },
  });
} catch (err) {
  console.log(err);
}
