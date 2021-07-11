import { BlockInterface } from '@/types/components/BlockInterface';

export interface SettingsFormPropsInterface<D, S> extends Partial<BlockInterface<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
}
