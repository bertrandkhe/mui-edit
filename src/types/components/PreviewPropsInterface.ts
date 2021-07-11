import { BlockType } from '@/types/components/BlockTypeInterface';
import { Block } from '@/types/components/BlockInterface';

export interface PreviewPropsInterface {
  blockTypes: BlockType[]
  data: Block[]
  className?: string
}
