import { SerialPort } from "serialport";

export class SerialPortHandler {
  private port: SerialPort | null = null;
  private dataListener: ((data: string) => void) | null = null;

  async listPorts() {
    return SerialPort.list();
  }

  connect(path: string, baudRate = 115200): Promise<string> {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({ path, baudRate });

      this.port.on("open", () => {
        console.log(`Connected to ${path}`);
        resolve(`Connected to ${path}`);
      });

      this.port.on("error", (err) => {
        console.error(`Error connecting to port: ${err.message}`);
        reject(err);
      });

      this.port.on("close", () => {
        console.log("Port closed");
      });

      this.port.on("data", (data) => {
        const receivedData = data.toString();
        console.log(`Received data: ${receivedData}`);

        if (this.dataListener) {
          this.dataListener(receivedData);
        }
      });
    });
  }

  disconnect(): void {
    if (this.port) {
      this.port.close((err) => {
        if (err) {
          console.error(`Error closing port: ${err.message}`);
        } else {
          console.log("Port closed successfully");
        }
      });
      this.port = null;
    }
  }

  write(data: BigInt): void {
    if (this.port) {
      this.port.write(data, (err) => {
        if (err) {
          console.error(`Error writing to port: ${err.message}`);
        } else {
          console.log(`Data sent: ${data}`);
        }
      });
    } else {
      console.warn("No port is connected");
    }
  }

  portInfo(): SerialPort | null {
    if (this.port) {
      return this.port;
    } else {
      console.warn("No port is connected");
      return null;
    }
  }

  onData(listener: (data: string) => void): void {
    this.dataListener = listener;
  }

  clearDataListener(): void {
    this.dataListener = null;
  }
}
