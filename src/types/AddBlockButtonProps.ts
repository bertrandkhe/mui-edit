import { BlockType } from '@/types/BlockType';

export interface AddBlockButtonProps {
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void
}
