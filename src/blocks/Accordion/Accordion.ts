import AccordionView from './AccordionView';
import AccordionEditForm from './AccordionEditForm';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { AccordionDataInterface } from '@/blocks/Accordion/types/AccordionDataInterface';
import { AccordionSettingsInterface } from '@/blocks/Accordion/types/AccordionSettingsInterface';

const Accordion: BlockTypeInterface<AccordionDataInterface, AccordionSettingsInterface> = {
  id: 'accordion',
  label: 'Accordion',
  defaultData: {
    items: [],
  },
  defaultSettings: {},
  hasSettings: false,
  blockLabel: () => {
    return 'Accordion';
  },
  view: AccordionView,
  editForm: AccordionEditForm,
};

export default Accordion;
