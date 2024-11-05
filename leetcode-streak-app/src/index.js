import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Удаляем React.StrictMode для правильной работы Service Worker
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // React.StrictMode убран для корректной работы SW
  <App />
);

// Регистрация Service Worker для оффлайн работы
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration);
      })
      .catch((registrationError) => {
        console.log('Ошибка регистрации Service Worker:', registrationError);
      });
  });
}

// Метрики для анализа производительности приложения
reportWebVitals();
