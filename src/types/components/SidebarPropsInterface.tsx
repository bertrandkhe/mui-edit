import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';

export interface SidebarClasses {
  root?: string,
}

export interface SidebarPropsInterface {
  classes?: SidebarClasses,
  data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[],
  blockTypes: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>[],
  container: HTMLElement,
  title: string,
  open: boolean,

  setData<D, S>(data: BlockInterface<D, S>[]): void,

  onBack?(): void,
}