import { BlockType } from './BlockType';
import { Block } from './Block';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string,
  setData?(data: Block[]): void,
  context: Record<string, any>,
}
