# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way. The
physics layer is handled by a small `PhysicsWorld` wrapper around Ammo.js which
updates Three.js meshes each frame. It exposes helpers for collisions,
constraints and even simple vehicle and ragdoll setups.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.
