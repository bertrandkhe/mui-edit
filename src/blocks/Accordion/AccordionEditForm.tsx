import React, { useState } from 'react';
import Editor from '@/components/Editor';
import { Portal } from '@material-ui/core';
import Section from '../Section';
import { EditFormPropsInterface } from '@/types/components/EditFormPropsInterface';
import { AccordionDataInterface } from '@/blocks/Accordion/types/AccordionDataInterface';
import { AccordionSettingsInterface } from '@/blocks/Accordion/types/AccordionSettingsInterface';
import {
  BlockDataInterface,
  BlockInterface,
  BlockSettingsInterface
} from '@/types/components/BlockInterface';

const AccordionEditForm: React.FunctionComponent<EditFormPropsInterface<AccordionDataInterface, AccordionSettingsInterface>> = (props) => {
  const {
    data, onChange, onClose, editorContainer,
  } = props;
  const [isOpen, setOpen] = useState(true);

  const handleChange = (newItems: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]) => {
    onChange({
      ...data,
      items: newItems,
    });
  };

  const handleBack = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <Portal container={editorContainer}>
      <Editor
        initialData={data.items}
        onChange={handleChange}
        blockTypes={[
          Section,
        ]}
        sidebarProps={{
          container: editorContainer,
          title: 'Edit accordion',
          onBack: handleBack,
          open: isOpen,
        }}
        disablePreview
      />
    </Portal>
  );
};

export default AccordionEditForm;
