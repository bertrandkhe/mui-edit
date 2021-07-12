import SectionView from '@/blocks/Section/SectionView';
import SectionSettingsForm from '@/blocks/Section/SectionSettingsForm';
import SectionEditForm from '@/blocks/Section/SectionEditForm';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { SectionDataInterface } from '@/blocks/Section/types/SectionDataInterface';
import { SectionSettingsInterface } from '@/blocks/Section/types/SectionSettingsInterface';

const Section: BlockTypeInterface<SectionDataInterface, SectionSettingsInterface> = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: '',
  },
  defaultSettings: {
    titleVariant: 'h3',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'left',
  },
  hasSettings: true,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: SectionView,
  settingsForm: SectionSettingsForm,
  editForm: SectionEditForm,
};

export default Section;