import { Block } from '@/types/Block';

export interface SettingsFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
}
