import React from 'react';
import Preview from '@/components/Preview';
import Section from '../Section';
import { BlockInterface } from '@/types/components/BlockInterface';
import { AccordionDataInterface } from '@/blocks/Accordion/types/AccordionDataInterface';
import { AccordionSettingsInterface } from '@/blocks/Accordion/types/AccordionSettingsInterface';

const AccordionView: React.FunctionComponent<BlockInterface<AccordionDataInterface, AccordionSettingsInterface>> = (props) => {
  const { data } = props;
  const { items } = data;
  return (
    <Preview
      blockTypes={[
        Section,
      ]}
      data={items}
    />
  );
};

export default AccordionView;
