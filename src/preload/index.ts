import { contextBridge } from "electron";

if (!process.contextIsolated) {
  throw new Error("contextIsolated must be enabled in browserWindow");
}

try {
  contextBridge.exposeInMainWorld("context", {});
} catch (err) {
  console.log(err);
}
