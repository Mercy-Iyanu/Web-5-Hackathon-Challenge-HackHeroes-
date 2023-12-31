import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web5 } from '@web5/api';
import { webcrypto } from 'node:crypto';


if (!globalThis.crypto) globalThis.crypto = webcrypto;

const { web5, did: aliceDid } = await Web5.connect();
const { record } = await web5.dwn.records.create({
  data: 'Hello, Web5!',
  message: {
    dataFormat: 'text/plain',
  },
});

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// reportWebVitals();
