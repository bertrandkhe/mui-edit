import React from 'react';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import AccordionFactory from '@/blocks/Accordion';
import Section from '@/blocks/Section';
import Editor from '@/components/Editor';

const App = (props: { container: HTMLElement }): React.ReactElement => {
  const { container } = props;
  const Accordion = AccordionFactory([Section]);
  return (
    <>
      <CssBaseline />
      <Editor
        sidebarProps={{
          container,
        }}
        initialData={[]}
        blockTypes={[
          Accordion,
          Section,
        ]}
      />
    </>
  );
};

export default hot(App);
