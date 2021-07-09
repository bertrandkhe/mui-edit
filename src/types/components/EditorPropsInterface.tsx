import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';

interface EditorSidebarPropsInterface {
  container: Readonly<HTMLElement>,
  title?: Readonly<string>
  open?: Readonly<boolean>,
}

export interface EditorPropsInterface {
  initialData: Readonly<BlockInterface<BlockDataInterface, BlockSettingsInterface>>[],
  blockTypes: Readonly<BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>>[],
  disableEditor?: Readonly<boolean>,
  disablePreview?: Readonly<boolean>,
  sidebarProps: Readonly<EditorSidebarPropsInterface>,

  onChange?(data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]): void,
}