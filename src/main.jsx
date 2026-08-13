import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(<App />);

// 서비스워커는 https(또는 localhost)에서만 등록된다.
// dev 서버에서는 캐시가 수정 결과를 가려서 헷갈리므로 등록하지 않는다.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('[sw] 등록 실패:', err);
    });
  });
}
