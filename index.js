
import { Web5 } from '@web5/api';

import { React } from 'react';
import { ReactDOM } from 'react-dom/client';
// import styles from './index.css';
import { App } from './App.js';
import { reportWebVitals } from './reportWebVitals.js';

import { webcrypto } from 'node:crypto';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const { web5, did: hackHeroesDid } = await Web5.connect();


const { record } = await web5.dwn.records.create({
    data: 'Hello, Web5!',
    message: {
      dataFormat: 'text/plain',
    },
  });

  console.log('writeResult', record);
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// reportWebVitals();
