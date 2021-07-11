import { BlockType } from '@/types/components/BlockTypeInterface';

export interface AddBlockButtonPropsInterface {
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void
}
