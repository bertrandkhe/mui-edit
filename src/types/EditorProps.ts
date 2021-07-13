import { Block } from '@/types/Block';
import { SidebarProps } from '@/types/SidebarProps';
import { BlockType } from '@/types/BlockType';

interface EditorSidebarProps extends Partial<SidebarProps> {
  container: HTMLElement,
}

export interface EditorProps {
  initialData: Block[],
  blockTypes: BlockType[],
  disableEditor?: Readonly<boolean>,
  disablePreview?: Readonly<boolean>,
  sidebarProps: Readonly<EditorSidebarProps>,

  onChange?(data: Block[]): void,
}
