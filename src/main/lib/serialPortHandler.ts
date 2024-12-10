import { SerialPort } from "serialport";

export class SerialPortHandler {
  private port: SerialPort | null = null;

  async listPorts() {
    return SerialPort.list();
  }

  connect(path: string, baudRate = 9600): Promise<string> {
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

      this.port.on("data", (data) => {
        console.log(`Received data: ${data}`);
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
    }
  }

  write(data: string): void {
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
}
