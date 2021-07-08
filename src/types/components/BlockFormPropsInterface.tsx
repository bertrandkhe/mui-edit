import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';

interface BlockFormInitialStateInterface {
  showEditForm?: boolean,
  showSettingsForm?: boolean,
  showDeleteForm?: boolean,
  moreAnchorEl?: HTMLElement,
}

export interface BlockFormPropsInterface {
  editorContainer: HTMLElement,
  block: BlockInterface<BlockDataInterface, BlockSettingsInterface>
  blockType: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>
  initialState?: BlockFormInitialStateInterface,
  onDataChange(data: BlockDataInterface): void,
  onSettingsChange(settings: BlockSettingsInterface): void,
  onClone(withData: boolean): void,
  onDelete(): void,
}