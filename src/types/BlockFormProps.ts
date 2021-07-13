import { Block } from '@/types/Block';
import { BlockType } from '@/types/BlockType';

interface BlockFormInitialState {
  showEditForm?: boolean,
  showSettingsForm?: boolean,
  showDeleteForm?: boolean,
  moreAnchorEl?: HTMLElement,
}

export interface BlockFormProps {
  editorContainer: HTMLElement,
  block: Block,
  blockType: BlockType,
  initialState?: BlockFormInitialState,
  onDataChange(data: Record<string, unknown>): void,
  onSettingsChange(settings: Record<string, unknown>): void,
  onClone(withData: boolean): void,
  onDelete(): void,
}
