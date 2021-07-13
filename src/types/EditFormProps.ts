import { Block } from '@/types/Block';

export interface EditFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  onChange(data: D): void,
  onClose(): void,
  editorContainer: HTMLElement,
}
