export class WebRTCTransport {
  constructor() {
    this.peer = null;
    this.channel = null;
    this.ws = null;
  }

  connect(url) {
    const wsUrl = url.replace('rtc:', 'ws:');
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        this.peer = new RTCPeerConnection();
        this.channel = this.peer.createDataChannel('data');
        this.channel.onopen = () => resolve();
        this.channel.onmessage = e => this.onmessage && this.onmessage(e.data);

        this.peer.onicecandidate = event => {
          if (event.candidate) {
            this.ws.send(JSON.stringify({ candidate: event.candidate }));
          }
        };

        this.peer.createOffer().then(offer => {
          this.peer.setLocalDescription(offer);
          this.ws.send(JSON.stringify({ offer }));
        });
      };

      this.ws.onmessage = event => {
        const msg = JSON.parse(event.data);
        if (msg.answer) {
          this.peer.setRemoteDescription(new RTCSessionDescription(msg.answer));
        } else if (msg.candidate) {
          this.peer.addIceCandidate(new RTCIceCandidate(msg.candidate));
        }
      };

      this.ws.onerror = err => reject(err);
    });
  }

  send(data) {
    if (this.channel && this.channel.readyState === 'open') {
      this.channel.send(data);
    }
  }

  onMessage(cb) {
    this.onmessage = cb;
  }

  close() {
    this.channel && this.channel.close();
    this.peer && this.peer.close();
    this.ws && this.ws.close();
  }
}
