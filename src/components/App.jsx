import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { hot } from 'react-hot-loader/root';
import Editor from './Editor';
import Accordion from '../blocks/Accordion';
import Section from '../blocks/Section';

const App = ({ container }) => {
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
