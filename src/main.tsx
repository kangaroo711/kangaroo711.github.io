import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'react-vant/lib/index.css';
import './styles.css';
import { ChurujingPage } from './pages/churujing/ChurujingPage';
import { KrakenPage } from './pages/kraken/KrakenPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/churujing" replace />} />
        <Route path="/churujing" element={<ChurujingPage />} />
        <Route path="/kraken" element={<KrakenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
