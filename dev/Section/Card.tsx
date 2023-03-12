import { MediaItem } from 'mui-edit/controls/MediaLibraryControl';
import { Block, BlockType } from 'mui-edit/types';
import CardEditForm from './CardEditForm';

export type CardData = {
  title: string
  body: string,
  image: MediaItem | null,
}

export type CardSettings = null;
export type CardBlock = Block<CardData, CardSettings>;

const Card: BlockType<CardData, CardSettings> = {
  id: 'card',
  label: 'Card',
  defaultData: {
    image: null,
    title: '',
    body: '',
  },
  defaultSettings: null,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed card';
  },
  view: null,
  settingsForm: null,
  editForm: CardEditForm,
  cardinality: 20,
};

export default Card;
