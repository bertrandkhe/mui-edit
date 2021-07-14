import { BlockType } from './BlockType';
import { Block } from './Block';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string
}
