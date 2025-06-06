export class WebSocketTransport {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = () => resolve();
      this.socket.onerror = err => reject(err);
    });
  }

  send(data) {
    this.socket && this.socket.send(data);
  }

  onMessage(cb) {
    if (this.socket) {
      this.socket.onmessage = e => cb(e.data);
    }
  }

  close() {
    this.socket && this.socket.close();
  }
}
