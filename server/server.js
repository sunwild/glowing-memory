import { WebSocketServer } from 'ws';
import { NetReplicator } from '../src/net/netReplicator.js';

const wss = new WebSocketServer({ port: 3000 });
const clients = new Set();
let worldState = [];

wss.on('connection', ws => {
  const client = { ws, interestArea: null };
  clients.add(client);

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.interestArea) {
        client.interestArea = data.interestArea;
      }
    } catch {}
  });

  ws.on('close', () => clients.delete(client));
});

function broadcastSnapshots() {
  for (const c of clients) {
    const objects = NetReplicator.filterByInterest(c, worldState);
    const snapshot = NetReplicator.createSnapshot(objects);
    c.ws.send(JSON.stringify({ snapshot }));
  }
}

setInterval(broadcastSnapshots, 50);

console.log('Authoritative server running on ws://localhost:3000');
