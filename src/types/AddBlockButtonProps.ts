import { BlockType } from './BlockType';

export interface AddBlockButtonProps {
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void,
  container?: HTMLElement,
}
