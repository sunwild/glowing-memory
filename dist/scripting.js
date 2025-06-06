export class GameObject {
    /**
     * Extend allows defining lightweight GameObject subclasses via a simple prototype.
     */
    static extend(proto) {
        return class extends GameObject {
            constructor() {
                super();
                Object.assign(this, proto);
            }
        };
    }
    start() { }
    update(_delta) { }
    destroy() { }
}
export class EventBus {
    static on(type, handler) {
        if (!this.handlers[type])
            this.handlers[type] = [];
        this.handlers[type].push(handler);
    }
    static off(type, handler) {
        const list = this.handlers[type];
        if (!list)
            return;
        const idx = list.indexOf(handler);
        if (idx !== -1)
            list.splice(idx, 1);
    }
    static emit(type, payload) {
        const list = this.handlers[type];
        if (!list)
            return;
        for (const h of [...list])
            h(payload);
    }
}
EventBus.handlers = {};
