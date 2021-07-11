import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const main = () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  root.style.border = '1px solid #eee';
  root.style.height = '100vh';
  root.style.minHeight = '100vh';
  root.style.width = '100vw';
  root.style.maxWidth = '100vw';
  root.style.overflow = 'hidden';
  root.style.position = 'relative';
  document.body.style.margin = '0px';
  document.body.style.minHeight = '100vh';
  ReactDOM.render(
    <App container={root} />,
    root,
  );
};

main();
