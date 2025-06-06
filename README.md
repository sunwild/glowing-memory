# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.
It now also contains a simple HUD framework with DOM, Canvas2D and WebGL
sprites. Widgets for an inventory, mini-map and dialog are included.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.
