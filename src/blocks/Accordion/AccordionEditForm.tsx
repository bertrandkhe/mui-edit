import React, { useState } from 'react';
import Editor from '@/components/Editor';
import { Portal } from '@material-ui/core';
import { EditFormProps } from '@/types/EditFormProps';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import {
  Block,
} from '@/types/Block';
import { BlockType } from '@/types/BlockType';

const AccordionEditFormFactory = (
  blockTypes: BlockType[],
): React.FunctionComponent<
  EditFormProps<AccordionData, AccordionSettings>
> => {
  const AccordionEditForm: React.FunctionComponent<
    EditFormProps<AccordionData, AccordionSettings>
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
