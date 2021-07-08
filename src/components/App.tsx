import React from 'react';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import { AppPropsInterface } from '@/types/AppPropsInterface';
import Editor from './Editor';
import Accordion from '@/blocks/Accordion';
import Section from '@/blocks/Section';

const App: React.FunctionComponent<AppPropsInterface> = (props) => {
  const {container} = props;
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
