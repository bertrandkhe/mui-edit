import { v4 as uuidv4 } from 'uuid';
import { BlockType } from '../types/BlockType';
import { Block } from '../types/Block';

export const createBlock = (
  blockType: BlockType,
): Block<typeof blockType.defaultData, typeof blockType.defaultSettings> => {
  return {
    id: uuidv4(),
    type: blockType.id,
    data: blockType.defaultData,
    settings: blockType.defaultSettings,
    meta: {
      created: Date.now(),
      changed: Date.now(),
    },
  };
};

export default {
  createBlock,
};
