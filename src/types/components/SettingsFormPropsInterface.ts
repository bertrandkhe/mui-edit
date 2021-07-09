import { BlockInterface } from '@/types/components/BlockInterface';

export interface SettingsFormPropsInterface<D,S> extends Partial<BlockInterface<D, S>> {
  onChange(settings: S): void,
}