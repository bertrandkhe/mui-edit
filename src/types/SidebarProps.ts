import { Block } from './Block';
import { BlockType } from './BlockType';

export interface SidebarClasses {
  root?: string,
}

export interface SidebarProps {
  classes?: SidebarClasses,
  data: Block[],
  blockTypes: BlockType[],
  container?: HTMLElement,
  title: string,
  open: boolean,
  setData(data: Block[]): void,
  onBack?(): void,
  context: Record<string, any>,
}
