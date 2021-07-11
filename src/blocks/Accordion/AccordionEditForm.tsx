import React, { useState } from 'react';
import Editor from '@/components/Editor';
import { Portal } from '@material-ui/core';
import { EditFormPropsInterface } from '@/types/components/EditFormPropsInterface';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import {
  Block,
} from '@/types/components/BlockInterface';
import { BlockType } from '@/types/components/BlockTypeInterface';

const AccordionEditFormFactory = (
  blockTypes: BlockType[],
): React.FunctionComponent<
  EditFormPropsInterface<AccordionData, AccordionSettings>
> => {
  const AccordionEditForm: React.FunctionComponent<
    EditFormPropsInterface<AccordionData, AccordionSettings>
  > = (props) => {
    const {
      data, onChange, onClose, editorContainer,
    } = props;
    const [isOpen, setOpen] = useState(true);

    const handleChange = (newItems: Block[]) => {
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
          blockTypes={blockTypes}
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
  return AccordionEditForm;
};

export default AccordionEditFormFactory;
