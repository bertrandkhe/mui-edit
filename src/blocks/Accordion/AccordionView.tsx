import React from 'react';
import Preview from '@/components/Preview';
import { Block } from '@/types/Block';
import { AccordionData } from '@/blocks/Accordion/types/AccordionData';
import { AccordionSettings } from '@/blocks/Accordion/types/AccordionSettings';
import { BlockType } from '@/types/BlockType';

const AccordionViewFactory = (
  blockTypes: BlockType[],
): React.FunctionComponent<Block<AccordionData, AccordionSettings>> => {
  const AccordionView: React.FunctionComponent<
    Block<AccordionData, AccordionSettings>
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
