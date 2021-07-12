import React from 'react';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import AccordionFactory from '@/blocks/Accordion';
import Section from '@/blocks/Section';
import Image from '@/blocks/Image';
import Editor from '@/components/Editor';

const uploadFile = async (file: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

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
          Image(uploadFile),
        ]}
      />
    </>
  );
};

export default hot(App);
