import { BlockInterface } from '@/types/components/BlockInterface';

export interface EditFormPropsInterface<D,S> extends Partial<BlockInterface<D, S>> {
  onChange(data: D): void,
  onClose(): void,
  editorContainer: HTMLElement,
}
