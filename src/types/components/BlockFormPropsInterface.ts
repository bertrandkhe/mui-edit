import { Block } from '@/types/components/BlockInterface';
import { BlockType } from '@/types/components/BlockTypeInterface';

interface BlockFormInitialStateInterface {
  showEditForm?: boolean,
  showSettingsForm?: boolean,
  showDeleteForm?: boolean,
  moreAnchorEl?: HTMLElement,
}

export interface BlockFormPropsInterface {
  editorContainer: HTMLElement,
  block: Block,
  blockType: BlockType,
  initialState?: BlockFormInitialStateInterface,
  onDataChange(data: Record<string, unknown>): void,
  onSettingsChange(settings: Record<string, unknown>): void,
  onClone(withData: boolean): void,
  onDelete(): void,
}
