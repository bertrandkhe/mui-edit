import { BlockType } from '@/types/BlockType';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import AccordionEditForm from './AccordionEditForm';
import AccordionView from './AccordionView';

const AccordionFactory = (
  blockTypes: BlockType[],
): BlockType<AccordionData, AccordionSettings> => {
  const Accordion: BlockType<AccordionData, AccordionSettings> = {
    id: 'accordion',
    label: 'Accordion',
    defaultData: {
      items: [],
    },
    defaultSettings: null,
    hasSettings: false,
    blockLabel: () => {
      return 'Accordion';
    },
    view: AccordionView(blockTypes),
    editForm: AccordionEditForm(blockTypes),
    settingsForm: () => null,
  };
  return Accordion;
};

export default AccordionFactory;
