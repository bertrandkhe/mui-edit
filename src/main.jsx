import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from '@/components/Editor';
import Section from './blocks/Section';

const main = () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  root.style.border = '1px solid #eee';
  root.style.height = '100vh';
  document.body.style.margin = 0;
  document.body.style.minHeight = '100vh';
  const HotEditor = hot(Editor);
  ReactDOM.render(
    <>
      <CssBaseline />
      <HotEditor
        initialData={[]}
        blockTypes={[
          Section,
        ]}
      />
    </>,
    root,
  )
};

main();