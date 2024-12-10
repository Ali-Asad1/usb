export const createPacket = (method, attribute, type, data) => {
  return `START!*${method}!!!$$${type}*${attribute}$$${data}$$RESERVED$$ENDOFPKT\n`;
};
