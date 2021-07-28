import { Block } from './Block';

export interface EditFormProps<D, S, C> extends Partial<Block<D, S>> {
  id: string
  data: D,
  onChange(data: D): void,
  onClose(): void,
  container?: HTMLElement,
  context: C,
}
