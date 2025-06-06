class NetReplicatorImpl {
  constructor() {
    this.registry = new Map();
  }

  register(classId, serializer) {
    this.registry.set(classId, serializer);
  }

  createSnapshot(objects) {
    return objects.map(o => {
      const serializer = this.registry.get(o.classId);
      return serializer ? serializer.serialize(o) : null;
    }).filter(Boolean);
  }

  createDelta(prev, curr) {
    const delta = [];
    const prevMap = new Map(prev.map(o => [o.id, o]));
    for (const obj of curr) {
      const prevObj = prevMap.get(obj.id);
      const serializer = this.registry.get(obj.classId);
      if (!prevObj) {
        delta.push({ type: 'add', data: serializer.serialize(obj) });
      } else if (obj.version !== prevObj.version) {
        delta.push({ type: 'update', data: serializer.serialize(obj) });
      }
      prevMap.delete(obj.id);
    }
    for (const id of prevMap.keys()) {
      delta.push({ type: 'remove', id });
    }
    return delta;
  }

  filterByInterest(client, objects) {
    if (!client.interestArea) return objects;
    const { x, y, z, radius } = client.interestArea;
    return objects.filter(o => {
      const pos = o.position || { x: 0, y: 0, z: 0 };
      const dx = pos.x - x;
      const dy = pos.y - y;
      const dz = pos.z - z;
      return dx*dx + dy*dy + dz*dz <= radius*radius;
    });
  }
}

export const NetReplicator = new NetReplicatorImpl();
export const register = NetReplicator.register.bind(NetReplicator);
