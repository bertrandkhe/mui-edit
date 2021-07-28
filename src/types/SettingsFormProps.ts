import { Block } from './Block';

export interface SettingsFormProps<D, S, C> extends Partial<Block<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
  context: C,
}
