# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.

## Networking

The `src/net` directory contains a small networking layer with WebSocket and
WebRTC transports. Clients can connect using:

```javascript
import { NetClient } from './src/net/index.js';
const transport = await NetClient.connect('ws://localhost:3000');
```

Custom serializers can be registered on the replicator via:

```javascript
import { register } from './src/net/index.js';
register(1, mySerializer);
```

An authoritative WebSocket server is available in `server/server.js` and can be
started with `node server/server.js`. It periodically sends snapshots of the
world state to all connected clients.
