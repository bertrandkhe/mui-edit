import { Block } from './Block';
import { BlockType } from './BlockType';

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
  onChange(block: Block): void,
  onClone(withData: boolean): void,
  onDelete(): void,
}
