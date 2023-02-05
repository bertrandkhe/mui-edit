import { BlockType } from 'mui-edit/types';
import SectionView from './SectionView';
import SectionEditForm from './SectionEditForm';
import { CardBlock } from './Card';

export type SectionData = {
  title: string
  body: string,
  cards: CardBlock[],
}

export type SectionSettings = null;

const Section: BlockType<SectionData, SectionSettings> = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: '',
    cards: [],
  },
  defaultSettings: null,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: SectionView,
  settingsForm: null,
  editForm: SectionEditForm,
  cardinality: 20,
};

export default Section;
