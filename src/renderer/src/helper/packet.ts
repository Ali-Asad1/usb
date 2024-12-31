export const createPacket = (method: "SET" | "GET", attribute: string, type: string, data: string | number) => {
  return `START!* ${method}!!!$$${type} *${attribute}$$${data.toString().padEnd(10, "!")}$$RESERVED$$ENDOFPKT\n`;
};

export const parsePacket = (packet: string) => {
  const match = packet.match(/\*SET!!!\$\$(.*?)\s\*(.*?)\$\$(.*?)\$\$/);
  if (match) {
    return {
      type: match[1],
      attribute: match[2],
      data: match[3].replace(/!+/g, ""),
    };
  }
  return null;
};
