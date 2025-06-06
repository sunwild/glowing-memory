export class Profiler {
  constructor(renderer) {
    this.renderer = renderer;
  }

  async capture(duration = 1000) {
    const start = performance.now();
    let last = start;
    let frames = 0;
    let cpuTotal = 0;

    return new Promise((resolve) => {
      const loop = () => {
        const now = performance.now();
        cpuTotal += now - last;
        last = now;
        frames++;
        if (now - start >= duration) {
          const fps = (frames * 1000) / (now - start);
          const cpuMs = cpuTotal / frames;
          resolve({ fps, cpuMs, gpuMs: 0 });
        } else {
          requestAnimationFrame(loop);
        }
      };
      requestAnimationFrame(loop);
    });
  }
}
