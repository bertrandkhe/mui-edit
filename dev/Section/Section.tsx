import { BlockType } from 'mui-edit/types';
import SectionView from './SectionView';
import SectionEditForm from './SectionEditForm';
import { CardBlock } from './Card';
import { MediaItem } from 'mui-edit/controls/MediaLibraryControl';

export type SectionData = {
  image?: MediaItem | null,
  title: string
  body: string,
  cards: CardBlock[],
}

export type SectionSettings = null;

const Section: BlockType<SectionData, SectionSettings> = {
  id: 'section',
  label: 'Section',
  defaultData: {
    image: null,
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
  cardinality: 1,
};

export default Section;
