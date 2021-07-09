import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { SidebarPropsInterface } from '@/types/components/SidebarPropsInterface';

interface EditorSidebarProps extends Partial<SidebarPropsInterface> {
  container: HTMLElement,
}

export interface EditorPropsInterface {
  initialData: Readonly<BlockInterface<BlockDataInterface, BlockSettingsInterface>>[],
  blockTypes: Readonly<BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>>[],
  disableEditor?: Readonly<boolean>,
  disablePreview?: Readonly<boolean>,
  sidebarProps: Readonly<EditorSidebarProps>,

  onChange?(data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]): void,
}