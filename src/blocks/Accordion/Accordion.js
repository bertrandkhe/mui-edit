import AccordionView from './AccordionView';
import AccordionEditForm from './AccordionEditForm';

const Accordion = {
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
