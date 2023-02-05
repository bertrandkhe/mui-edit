import type { BlockType } from 'mui-edit/types';

export type CarouselData = {
  title: string
  body: string,
}

type SectionSettings = Record<string, unknown>

const Section: BlockType<CarouselData, SectionSettings> = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: '',
  },
  defaultSettings: {
  },
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: null,
  settingsForm: null,
  editForm: null,
  cardinality: 20,
};

export default Section;
