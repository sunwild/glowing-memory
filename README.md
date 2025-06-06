# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.

## Scene and Asset Management

`SceneGraph` provides a simple hierarchy of transform nodes built on top of
`THREE.Object3D`. Nodes can be added via `SceneGraph.add(node, parent)`.

`AssetLoader` exposes an asynchronous `load(type, url)` method supporting
`gltf`, `fbx`, `audio` and `texture` assets. Loaded geometries and textures are
stored in internal pools so they can be reused.
