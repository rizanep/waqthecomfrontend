import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoadingProvider } from './context/LoadingContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LoadingProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </LoadingProvider>
);  