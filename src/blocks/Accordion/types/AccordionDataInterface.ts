import {
  BlockDataInterface,
  BlockInterface,
  BlockSettingsInterface
} from '@/types/components/BlockInterface';

export interface AccordionDataInterface extends BlockDataInterface {
  items: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]
}