import React from 'react';
import Preview from '@/components/Preview';
import Section from '../Section';

const AccordionView = (props) => {
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
