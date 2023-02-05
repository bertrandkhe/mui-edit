import { Block, BlockType } from 'mui-edit/types';
import CardEditForm from './CardEditForm';

export type CardData = {
  title: string
  body: string,
  cards: {
    title: string,
    body: string,
  }[],
}

export type CardSettings = null;
export type CardBlock = Block<CardData, CardSettings>;

const Card: BlockType<CardData, CardSettings> = {
  id: 'card',
  label: 'Card',
  defaultData: {
    title: '',
    body: '',
    cards: [],
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
