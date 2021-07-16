import { Block } from './Block';
import { SidebarProps } from './SidebarProps';
import { BlockType } from './BlockType';

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
