import React from 'react';
import Preview from '@/components/Preview';
import { BlockInterface } from '@/types/components/BlockInterface';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import { BlockType } from '@/types/components/BlockTypeInterface';

const AccordionViewFactory = (
  blockTypes: BlockType[],
): React.FunctionComponent<BlockInterface<AccordionData, AccordionSettings>> => {
  const AccordionView: React.FunctionComponent<
    BlockInterface<AccordionData, AccordionSettings>
    > = (props) => {
      const { data } = props;
      const { items } = data;
      return (
        <Preview
          blockTypes={blockTypes}
          data={items}
        />
      );
    };
  return AccordionView;
};

export default AccordionViewFactory;
