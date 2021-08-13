import FileUploadControl from './FileUploadControl';

export type FileItem = {
  id: string,
  type: string,
  url: string
  title?: string,
  alt?: string,
}

export default FileUploadControl;
