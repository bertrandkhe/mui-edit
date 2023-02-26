import { openDB, DBSchema } from 'idb';
import { StorageAdapter, StorageObject, Folder } from 'mui-edit/types/StorageAdapter';

type StoredObject = {
  prefix: string,
} & StorageObject;

type StoredFolder = {
  parentPrefix: string,
} & Folder;

interface StorageSchema extends DBSchema {
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
  folders: {
    value: StoredFolder,
    key: string,
    indexes: {
      parentPrefix: string,
    }
  }
}

const latestVersion = 1;
const createStorage = async (): Promise<StorageAdapter> => {
  const db = await openDB<StorageSchema>('objectStorage', latestVersion, {
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
            break;
        }
      }
    },
  });
  const adapter: StorageAdapter = {
    async upload(args) {
      const keyParts = args.key.split('/');
      const prefix = `${keyParts.slice(0, -1).join('/')}/`;
      const filename = keyParts.slice(-1)[0];
      const exitingObject = await db.get('objects', args.key);
      if (exitingObject) {
        throw new Error('An object with the key already exists');
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
      return adapter.objectUrl(args);
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
      const url = URL.createObjectURL(blob.blob);
      return url;
    },
    rename(args) {
      throw new Error();
    },
  };
  return adapter;
};

export default createStorage;
