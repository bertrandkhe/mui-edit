import { Block } from '@/types/components/BlockInterface';
import { BlockType } from '@/types/components/BlockTypeInterface';

export interface SidebarClasses {
  root?: string,
}

export interface SidebarPropsInterface {
  classes?: SidebarClasses,
  data: Block[],
  blockTypes: BlockType[],
  container: HTMLElement,
  title: string,
  open: boolean,
  setData(data: Block[]): void,
  onBack?(): void,
}
