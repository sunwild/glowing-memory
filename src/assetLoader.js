import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js';

export class AssetLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = new FBXLoader();
    this.audioLoader = new THREE.AudioLoader();

    this.geometryPool = new Map();
    this.texturePool = new Map();
  }

  /**
   * Load an asset asynchronously.
   * @param {'gltf'|'fbx'|'audio'|'texture'} type - Type of asset.
   * @param {string} url - URL of the asset.
   * @returns {Promise<any>} Loaded asset.
   */
  async load(type, url) {
    switch (type) {
      case 'gltf':
        return this._loadGLTF(url);
      case 'fbx':
        return this._loadFBX(url);
      case 'audio':
        return this._loadAudio(url);
      case 'texture':
        return this._loadTexture(url);
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
  }

  _loadGLTF(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        gltf => {
          this._poolFromObject(gltf.scene);
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  _loadFBX(url) {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        url,
        object => {
          this._poolFromObject(object);
          resolve(object);
        },
        undefined,
        reject
      );
    });
  }

  _loadAudio(url) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(url, buffer => resolve(buffer), undefined, reject);
    });
  }

  _loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        texture => {
          this.texturePool.set(texture.uuid, texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  _poolFromObject(object) {
    object.traverse(child => {
      if (child.isMesh) {
        const geom = child.geometry;
        if (geom && !this.geometryPool.has(geom.uuid)) {
          this.geometryPool.set(geom.uuid, geom);
        }
        const material = child.material;
        if (material) {
          const materials = Array.isArray(material) ? material : [material];
          for (const mat of materials) {
            for (const key of Object.keys(mat)) {
              const value = mat[key];
              if (value instanceof THREE.Texture) {
                if (!this.texturePool.has(value.uuid)) {
                  this.texturePool.set(value.uuid, value);
                }
              }
            }
          }
        }
      }
    });
  }
}
