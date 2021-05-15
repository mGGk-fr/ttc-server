export function encodeMessage(messageType: string, data: any) {
  return JSON.stringify({ type: messageType, data });
}

export function decodeMessage(message: string) {
  return JSON.parse(message);
}
