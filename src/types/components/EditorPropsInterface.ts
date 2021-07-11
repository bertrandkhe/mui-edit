import { Block } from '@/types/components/BlockInterface';
import { SidebarPropsInterface } from '@/types/components/SidebarPropsInterface';
import { BlockType } from '@/types/components/BlockTypeInterface';

interface EditorSidebarProps extends Partial<SidebarPropsInterface> {
  container: HTMLElement,
}

export interface EditorPropsInterface {
  initialData: Block[],
  blockTypes: BlockType[],
  disableEditor?: Readonly<boolean>,
  disablePreview?: Readonly<boolean>,
  sidebarProps: Readonly<EditorSidebarProps>,

  onChange?(data: Block[]): void,
}
