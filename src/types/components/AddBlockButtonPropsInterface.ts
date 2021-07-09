import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { BlockDataInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';

export interface AddBlockButtonPropsInterface {
  blockTypes: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>[],
  onAddBlock(blockType: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>): void
}