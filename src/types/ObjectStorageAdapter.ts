export interface StorageObject {
  id: string,
  type: 'file',
  key: string,
  size: number,
  name: string,
  lastModified: string,
}

export interface StorageObjectMeta {
  name: string,
  url: string,
  uri: string,
  contentType: string,
  size: string,
  md5?: string,
  exif?: {
    width: number,
    height: number,
  },
}

export interface Folder {
  id: string,
  type: 'folder',
  prefix: string,
  name: string,
}

export type LsResult = {
  objects: StorageObject[];
  folders: Folder[];
  isTruncated: boolean;
  count: number
};

export interface ObjectStorageAdapter {
  ls(args: {
    prefix: string
  }): Promise<LsResult>

  upload(args: {
    key: string,
    file: File | Blob,
    acl?: 'private' | 'public' | 'public-read',
    overwrite?: boolean,
    onProgress?: XMLHttpRequestUpload['onprogress'],
    onReady?(xhr: XMLHttpRequest): void,
  }): Promise<string>

  mkdir(args: {
    key: string,
  }): Promise<void>

  rename(args: {
    source: string,
    destination: string,
  }): Promise<void>

  objectUrl(args: {
    key: string,
    expires?: number,
  }): Promise<string>

  imagePreviewUrl(args: {
    key: string,
    expires?: number,
    width: number,
  }): Promise<string>

  objectMeta(args: {
    key: string,
  }): Promise<StorageObjectMeta>

  delete(args: {
    key: string,
  }): Promise<void>
}

export default ObjectStorageAdapter;
