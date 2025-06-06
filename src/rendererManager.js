export const MaterialLib = {
  _materials: new Map(),
  register(name, material) {
    this._materials.set(name, material);
  },
  get(name) {
    return this._materials.get(name);
  },
};

export const RendererManager = {
  renderer: null,
  composer: null,
  scene: null,
  camera: null,
  init(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.composer = new THREE.EffectComposer(this.renderer);
    if (this.scene && this.camera) {
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.4,
        0.85
      );
      this.composer.addPass(bloomPass);
      const ssaoPass = new THREE.SSAOPass(
        this.scene,
        this.camera,
        window.innerWidth,
        window.innerHeight
      );
      this.composer.addPass(ssaoPass);
      const fxaa = new THREE.ShaderPass(THREE.FXAAShader);
      fxaa.uniforms.resolution.value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      this.composer.addPass(fxaa);
    }

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
      if (this.camera) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      }
    });

    return this.renderer;
  },
  _performCulling() {
    if (!this.camera || !this.scene) return;
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    this.camera.updateMatrixWorld();
    projScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(projScreenMatrix);
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        if (!obj.geometry.boundingSphere) {
          obj.geometry.computeBoundingSphere();
        }
        const sphere = obj.geometry.boundingSphere
          .clone()
          .applyMatrix4(obj.matrixWorld);
        obj.visible = frustum.intersectsSphere(sphere);
      }
    });
  },
  drawFrame(dt) {
    this._performCulling();
    if (this.composer) {
      this.composer.render(dt);
    } else if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },
};

// default materials
MaterialLib.register('box', new THREE.MeshStandardMaterial({ color: 0x6699ff }));
MaterialLib.register('sphere', new THREE.MeshStandardMaterial({ color: 0xff9966 }));
