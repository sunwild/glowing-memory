export class Animator {
  constructor() {
    this.nodes = new Map();
  }

  /**
   * Register a skinned mesh with optional animation clips.
   * @param {THREE.Object3D} node
   * @param {THREE.AnimationClip[]} clips
   */
  register(node, clips = []) {
    const mixer = new THREE.AnimationMixer(node);
    const actions = {};
    for (const clip of clips) {
      actions[clip.name] = mixer.clipAction(clip);
    }
    this.nodes.set(node, {
      mixer,
      actions,
      currentAction: null,
      additiveActions: [],
      ikChains: [],
      stateMachine: null,
    });
  }

  /**
   * Play an animation clip by name on the given node.
   * Blends from the current clip if one is playing.
   */
  playClip(node, clipName, fadeDuration = 0.2) {
    const state = this.nodes.get(node);
    if (!state) return;
    const { mixer, actions } = state;
    const action = actions[clipName];
    if (!action) return;
    if (state.currentAction && state.currentAction !== action) {
      state.currentAction.crossFadeTo(action, fadeDuration, false);
    }
    action.reset().play();
    state.currentAction = action;
  }

  /**
   * Add an additive layer using a clip.
   * This assumes the clip was authored in additive mode.
   */
  playAdditive(node, clipName, weight = 1) {
    const state = this.nodes.get(node);
    if (!state) return;
    const action = state.actions[clipName];
    if (!action) return;
    action.reset();
    action.setEffectiveWeight(weight);
    action.setLoop(THREE.LoopRepeat);
    action.play();
    state.additiveActions.push(action);
  }

  /**
   * Simple state machine description and evaluation.
   * states: { [name]: { clip, transitions: [{ to, if }] } }
   */
  setStateMachine(node, definition, initialState) {
    const state = this.nodes.get(node);
    if (!state) return;
    state.stateMachine = {
      def: definition,
      current: initialState,
      time: 0,
    };
    const clip = definition[initialState]?.clip;
    if (clip) this.playClip(node, clip);
  }

  updateStateMachine(node, dt) {
    const state = this.nodes.get(node);
    if (!state || !state.stateMachine) return;
    const sm = state.stateMachine;
    sm.time += dt;
    const def = sm.def[sm.current];
    if (!def) return;
    for (const t of def.transitions || []) {
      if (t.if(sm, node)) {
        sm.current = t.to;
        sm.time = 0;
        const clip = sm.def[sm.current]?.clip;
        if (clip) this.playClip(node, clip);
        break;
      }
    }
  }

  addIKChain(node, chain) {
    const state = this.nodes.get(node);
    if (!state) return;
    state.ikChains.push(chain);
  }

  solveIK(chain) {
    const { bones, target, iterations = 10 } = chain;
    for (let i = 0; i < iterations; i++) {
      for (let j = bones.length - 1; j >= 0; j--) {
        const bone = bones[j];
        bone.updateWorldMatrix(true, false);
        const bonePos = new THREE.Vector3();
        const targetPos = new THREE.Vector3();
        bone.getWorldPosition(bonePos);
        target.getWorldPosition(targetPos);
        const dir = targetPos.clone().sub(bonePos).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        bone.quaternion.slerp(quat, 0.5);
        bone.updateMatrixWorld();
      }
    }
  }

  retargetClip(srcClip, srcSkeleton, dstSkeleton, boneMap) {
    const tracks = srcClip.tracks.map((t) => {
      const dstName = boneMap[t.name.split('.')[0]];
      if (!dstName) return null;
      const dstTrackName = dstName + '.' + t.name.split('.').slice(1).join('.');
      return t.clone().rename(dstTrackName);
    }).filter(Boolean);
    return new THREE.AnimationClip(srcClip.name, srcClip.duration, tracks);
  }

  update(dt) {
    for (const [node, state] of this.nodes) {
      state.mixer.update(dt);
      for (const action of state.additiveActions) {
        action.weight = action.getEffectiveWeight();
      }
      for (const chain of state.ikChains) {
        this.solveIK(chain);
      }
      this.updateStateMachine(node, dt);
    }
  }
}
