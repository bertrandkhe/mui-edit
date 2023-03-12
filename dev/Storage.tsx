import React, { useContext } from 'react';
import { openDB, DBSchema } from 'idb';
import ObjectStorageAdapter, { StorageObject, Folder } from 'mui-edit/types/ObjectStorageAdapter';
import pica from 'pica';

type StoredObject = {
  prefix: string,
} & StorageObject;

type StoredFolder = {
  parentPrefix: string,
} & Folder;

type Thumbnail = {
  id: string,
  objectId: string,
  width: number,
  blob: Blob,
}

declare global {
  interface OffscreenCanvas {
    convertToBlob(options?: {
      type?: string,
      quality?: number,
    }): Blob
  }
}

const nextFrame = (): Promise<DOMHighResTimeStamp> => {
  return new Promise((resolve) => {
    window.requestAnimationFrame((time) => {
      resolve(time);
    });
  });
}

const toImage = async (blob: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);
    image.addEventListener('load', () => {
      resolve(image);
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
    });
    image.src = URL.createObjectURL(blob);
  });
};

const blobUrlGenerator = {
  cache: new Map<string, {
    lastAccess: string,
    url: string,
  }>,
  get(id: string, blob: Blob) {
    const item = blobUrlGenerator.cache.get(id) || {
      lastAccess: '',
      url: URL.createObjectURL(blob),
    };
    blobUrlGenerator.cache.set(id, {
      ...item,
      lastAccess: (new Date()).toISOString(),
    });
    return item.url;
  },
}

const imgResizer = {
  incrementId: 0,
  pica: pica({
    idle: 60000,
  }),
  active: false,
  queue: [] as {
    jobId: string,
    blob: Blob,
    options: {
      type?: string,
      quality?: number,
      width: number,
    } }[],
  listeners: new Map<string, ((resizedBlob: Blob) => void)[]>(),
  addListener(jobId: string, listener: ((resizedBlob: Blob) => void)): void {
    const listeners = imgResizer.listeners.get(jobId) || [];
    listeners.push(listener);
    imgResizer.listeners.set(jobId, listeners);
  },
  async start() {
    if (imgResizer.active) {
      return;
    }
    imgResizer.active = true;
    while (imgResizer.queue.length > 0) {
      const {
        jobId,
        blob,
        options,
      } = imgResizer.queue.shift() as NonNullable<typeof imgResizer['queue'][0]>;
      const img = await toImage(blob);
      await nextFrame();
      const targetWidth = options.width > img.width
        ? img.width
        : options.width;
      const targetHeight = Math.floor(targetWidth * img.height / img.width);
      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      await imgResizer.pica.resize(img, canvas as unknown as HTMLCanvasElement);
      await nextFrame();
      const resizedBlob = canvas.convertToBlob({
        type: 'image/webp',
        quality: 0.75,
        ...options,
      });
      await nextFrame();
      const listeners = imgResizer.listeners.get(jobId) || [];
      for (let i = 0; i < listeners.length; i += 1) {
        listeners[i](resizedBlob);
      }
    }
    imgResizer.active = false;
  },
  async resize(blob: Blob, options: {
    width: number,
  }): Promise<Blob> {
    const jobId = `${++imgResizer.incrementId}`;
    return new Promise((resolve) => {
      imgResizer.addListener(jobId, (resizedBlob) => {
        resolve(resizedBlob);
      });
      imgResizer.queue.push({
        jobId,
        blob,
        options,
      });
      imgResizer.start();
    })
  },
}

interface ObjectStorageSchema extends DBSchema {
  objects: {
    value: StoredObject,
    key: string,
    indexes: {
      prefix: string,
    },
  },
  objectsBlob: {
    value: {
      id: string,
      blob: Blob,
    },
    key: string,
  },
  thumbnails: {
    value: Thumbnail,
    key: string,
    indexes: {
      objectId: string,
    },
  },
  folders: {
    value: StoredFolder,
    key: string,
    indexes: {
      parentPrefix: string,
    }
  }
}

const latestVersion = 1;
export const createObjectStorage = async (): Promise<ObjectStorageAdapter> => {
  const db = await openDB<ObjectStorageSchema>('objectStorage', latestVersion, {
    upgrade(db, oldVersion, newVersion: number) {
      for (let i = oldVersion + 1; i <= newVersion; i += 1) {
        switch (i) {
          case 1:
            db.createObjectStore('objects', {
              keyPath: 'id',
            }).createIndex('prefix', 'prefix', {
              unique: false,
            });
            db.createObjectStore('objectsBlob', {
              keyPath: 'id',
            });
            db.createObjectStore('folders', {
              keyPath: 'prefix',
            }).createIndex('parentPrefix', 'parentPrefix', {
              unique: false,
            });
            db.createObjectStore('thumbnails', {
              keyPath: 'id',
            }).createIndex('objectId', 'objectId', {
              unique: false,
            });
            break;
        }
      }
    },
  });
  const adapter: ObjectStorageAdapter = {
    async upload(args) {
      const {
        overwrite = false,
      } = args;
      const keyParts = args.key.split('/');
      const prefix = `${keyParts.slice(0, -1).join('/')}/`;
      const filename = keyParts.slice(-1)[0];
      const exitingObject = await db.get('objects', args.key);
      if (exitingObject && !overwrite) {
        throw new Error(`An object with the key ${args.key} already exists`);
      }
      const txObjects = db.transaction('objects', 'readwrite');
      const txBlobs = db.transaction('objectsBlob', 'readwrite');
      await Promise.all([
        txObjects.store.put({
          id: args.key,
          key: args.key,
          lastModified: (new Date()).toISOString(),
          name: filename,
          size: args.file.size,
          type: 'file',
          prefix,
        }),
        txBlobs.store.put({
          id: args.key,
          blob: args.file,
        }),
        txObjects.done,
        txBlobs.done,
      ]);
      return args.key;
    },
    async ls(args) {
      const prefix = args.prefix.endsWith('/') ? args.prefix : `${args.prefix}/`;
      const [keys, prefixes] = await Promise.all([
        db.getAllKeysFromIndex('objects', 'prefix', prefix),
        db.getAllKeysFromIndex('folders', 'parentPrefix', prefix),
      ]);
      const sortedKeys = keys.sort();
      const sortedPrefixes = prefixes.sort();
      const promises = [];
      for (let i = 0; i < sortedKeys.length; i += 1) {
        const key = sortedKeys[i];
        promises.push(db.get('objects', key));
      }
      for (let i = 0; i < sortedPrefixes.length; i += 1) {
        const prefix = sortedPrefixes[i];
        promises.push(db.get('folders', prefix));
      }
      const results = await Promise.all(promises);
      const objects = results.slice(0, keys.length) as StoredObject[];
      const folders = results.slice(keys.length) as StoredFolder[];
      return {
        count: results.length,
        folders,
        objects,
        isTruncated: false,
      }
    },
    async delete(args) {
      await Promise.all([
        db.delete('objects', args.key),
        db.delete('objectsBlob', args.key)
      ]);
    },
    async imagePreviewUrl(args) {
      const thumbnailsIds = await db.getAllKeysFromIndex('thumbnails', 'objectId', args.key);
      const allThumbnails = await Promise.all(thumbnailsIds.map((id) => {
        return db.get('thumbnails', id)
      }));
      const thumbnail = allThumbnails.find((t) => t?.width === args.width);
      if (thumbnail) {
        console.log(thumbnail.id);
        const url = blobUrlGenerator.get(thumbnail.id, thumbnail.blob);
        return url;
      }
      const blob = await db.get('objectsBlob', args.key);
      if (!blob) {
        return '';
      }
      const resizedBlob = await imgResizer.resize(blob.blob, args);
      const id = `${args.key};w=${args.width}`;
      const url = blobUrlGenerator.get(id, resizedBlob);
      await db.put('thumbnails', {
        blob: resizedBlob,
        id,
        objectId: args.key,
        width: args.width,
      });
      return url;;
    },
    async mkdir(args) {
      const prefix = args.key.endsWith('/') ? args.key : `${args.key}/`;
      const exitingFolder = await db.get('folders', prefix);
      if (exitingFolder) {
        throw new Error('A folder with this key already exists');
      }
      const prefixParts = prefix.split('/').slice(0, -1);
      const folderName = prefixParts.slice(-1)[0];
      const parentPrefix = `${prefixParts.slice(0, -1).join('/')}/`;
      await db.put('folders', {
        id: prefix,
        name: folderName,
        type: 'folder',
        prefix,
        parentPrefix,
      });
    },
    objectMeta(args) {
      throw new Error();
    },
    async objectUrl(args) {
      const blob = await db.get('objectsBlob', args.key);
      if (!blob) {
        throw new Error(`Object with key ${args.key} not found.`);
      }
      const url = blobUrlGenerator.get(args.key, blob.blob);
      return url;
    },
    rename(args) {
      throw new Error();
    },
  };
  return adapter;
};

const StorageContext = React.createContext<ObjectStorageAdapter | null>(null);
export const StorageProvider: React.FC<{
  storage: ObjectStorageAdapter,
  children: React.ReactNode,
}> = (props) => {
  const {
    storage,
    children
  } = props;
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = (): ObjectStorageAdapter => {
  const storage = useContext(StorageContext);
  if (!storage) {
    throw new Error('');
  }
  return storage;
};
