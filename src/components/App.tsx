import React from 'react';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import { AppPropsInterface } from '@/types/components/AppPropsInterface';
import AccordionFactory from '@/blocks/Accordion';
import Section from '@/blocks/Section';
import Editor from './Editor';

const App: React.FunctionComponent<AppPropsInterface> = (props) => {
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
