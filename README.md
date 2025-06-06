# Simple 3D Engine Example

This repository contains a minimal browser based 3D engine example using
[Three.js](https://threejs.org/) for rendering and
[Ammo.js](https://github.com/kripken/ammo.js/) for physics. The example spawns
several boxes that fall onto a static ground plane. It now also supports
dynamic spheres that interact with the physics world in the same way.

## Running

Open `index.html` in a modern browser. No build step is required because the
example loads libraries directly from a CDN.

## Animation System

An `Animator` utility is available for skeletal and procedural animations. It
supports clip blending, additive layers, simple IK chains and a lightweight
state machine for clip control. Clips can also be retargeted between different
skeletons.

Basic usage:

```javascript
import { Animator } from './src/animator.js';

const animator = new Animator();
animator.register(skinnedMesh, clips);
animator.playClip(skinnedMesh, 'Idle');

function loop(dt) {
  animator.update(dt);
}
```

Use `Animator.playClip(node, clipName)` to trigger animations and call
`Animator.update(dt)` every frame.
