import { BlockInterface } from '@/types/components/BlockInterface';

export interface EditFormPropsInterface<D, S> extends Partial<BlockInterface<D, S>> {
  id: string
  data: D,
  onChange(data: D): void,
  onClose(): void,
  editorContainer: HTMLElement,
}
