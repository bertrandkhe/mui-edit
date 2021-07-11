import { BlockTypeInterface, BlockType } from '@/types/components/BlockTypeInterface';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import AccordionEditForm from './AccordionEditForm';
import AccordionView from './AccordionView';

const AccordionFactory = (
  blockTypes: BlockType[],
): BlockTypeInterface<AccordionData, AccordionSettings> => {
  const Accordion: BlockTypeInterface<AccordionData, AccordionSettings> = {
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
    view: AccordionView(blockTypes),
    editForm: AccordionEditForm(blockTypes),
    settingsForm: () => null,
  };
  return Accordion;
};

export default AccordionFactory;
