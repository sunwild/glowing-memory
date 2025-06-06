# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.

## Input & Camera Control

The sample now provides a small input system that unifies keyboard, mouse,
gamepad and touch devices. Actions can be rebound at runtime using:

```javascript
Input.bind('moveForward', ['KeyW', 'ArrowUp']);
```

Camera behaviour is managed through `CameraRig` which supports `FPS`, `TPS` and
`ORBITAL` modes:

```javascript
cameraRig.setMode('FPS');
```
