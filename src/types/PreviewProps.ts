import { BlockType } from '@/types/BlockType';
import { Block } from '@/types/Block';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string
}
