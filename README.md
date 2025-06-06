# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.

The project now includes a lightweight in-engine editor with a scene inspector,
gizmo controls and a simple command console. A small profiler utility can be
used to capture average FPS and CPU timing.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN. The editor opens automatically
when the scene starts. To capture profiling information programmatically call:

```javascript
const profiler = new Profiler(engine.renderer);
profiler.capture(1000).then(console.log);
```
