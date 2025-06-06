export interface BoxOptions {
  width?: number;
  height?: number;
  depth?: number;
  x?: number;
  y?: number;
  z?: number;
  mass?: number;
}

export interface SphereOptions {
  radius?: number;
  x?: number;
  y?: number;
  z?: number;
  mass?: number;
}

export class Engine {
  constructor(options?: { gravity?: { x: number; y: number; z: number } });
  initPhysics(): Promise<void>;
  addBox(options: BoxOptions): void;
  addSphere(options: SphereOptions): void;
  addGameObject(obj: any): void;
  start(): Promise<void>;
}
