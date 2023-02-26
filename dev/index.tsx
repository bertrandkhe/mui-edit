import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import createStorage from './Storage';

const index = async () => {
  const root = document.createElement('div');
  const storage = await createStorage();
  document.body.appendChild(root);
  const reactRoot = createRoot(root);
  if (window.location.pathname === '/preview') {
    reactRoot.render(
      <App storage={storage} preview />,
    );
    return;
  }
  root.style.border = '1px solid #eee';
  root.style.height = '100vh';
  root.style.minHeight = '100vh';
  root.style.width = '100vw';
  root.style.maxWidth = '100vw';
  root.style.overflow = 'hidden';
  root.style.position = 'relative';
  document.body.style.margin = '0px';
  document.body.style.minHeight = '100vh';
  reactRoot.render(
    <App storage={storage} />,
  );
};

index();
