import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';

interface EditorSidebarPropsInterface {
  container: HTMLElement,
  title?: string
  open?: boolean,
}

export interface EditorPropsInterface {
  initialData: BlockInterface<BlockDataInterface, BlockSettingsInterface>[],
  blockTypes: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>[],
  disableEditor?: boolean,
  disablePreview?: boolean,
  sidebarProps: EditorSidebarPropsInterface,

  onChange?(data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]): void,
}