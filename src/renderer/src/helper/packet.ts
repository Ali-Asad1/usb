export const createPacket = (method: "SET" | "GET", attribute: string, type: string, data: string | number) => {
  return `START! *${method}!!!$$${type} *${attribute}$$${data.toString().padEnd(10, "!")}$$RESERVED$$ENDOFPKT\n`;
};
