export type GameObjectProto = {
  start?: () => void;
  update?: (delta: number) => void;
  destroy?: () => void;
};

export class GameObject {
  /**
   * Extend allows defining lightweight GameObject subclasses via a simple prototype.
   */
  static extend<T extends GameObjectProto>(proto: T) {
    return class extends GameObject {
      constructor() {
        super();
        Object.assign(this, proto);
      }
    } as unknown as { new (): GameObject & T };
  }

  start(): void {}
  update(_delta: number): void {}
  destroy(): void {}
}

export type EventHandler<T = any> = (payload: T) => void;

export class EventBus {
  private static handlers: Record<string, EventHandler[]> = {};

  static on(type: string, handler: EventHandler) {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
  }

  static off(type: string, handler: EventHandler) {
    const list = this.handlers[type];
    if (!list) return;
    const idx = list.indexOf(handler);
    if (idx !== -1) list.splice(idx, 1);
  }

  static emit(type: string, payload?: any) {
    const list = this.handlers[type];
    if (!list) return;
    for (const h of [...list]) h(payload);
  }
}
