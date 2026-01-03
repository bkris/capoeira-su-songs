import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const getBasename = () => {
  const publicUrl = process.env.PUBLIC_URL;
  if (!publicUrl) {
    return '/capoeira-su-songs';
  }
  try {
    const url = new URL(publicUrl);
    return url.pathname === '/' ? '/capoeira-su-songs' : url.pathname.replace(/\/$/, '');
  } catch (error) {
    if (publicUrl.startsWith('/')) {
      return publicUrl;
    }
    return `/${publicUrl}`;
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
