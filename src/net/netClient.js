export class NetClient {
  static async connect(url) {
    if (url.startsWith('ws')) {
      const { WebSocketTransport } = await import('./transports/websocket.js');
      const transport = new WebSocketTransport();
      await transport.connect(url);
      return transport;
    }
    if (url.startsWith('rtc')) {
      const { WebRTCTransport } = await import('./transports/webrtc.js');
      const transport = new WebRTCTransport();
      await transport.connect(url);
      return transport;
    }
    throw new Error('Unsupported protocol');
  }
}
