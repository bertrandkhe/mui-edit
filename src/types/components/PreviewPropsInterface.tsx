import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { BlockDataInterface, BlockInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';

export interface PreviewPropsInterface {
  blockTypes: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>[]
  data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]
  className?: string
}