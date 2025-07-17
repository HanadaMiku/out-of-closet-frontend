// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
// import ReactDOM from 'react-dom'; // For React 17-
import './index.css'; // Import global styles if you put them here
import App from './App'; // Import your main App component
import reportWebVitals from './reportWebVitals'; // Used for performance monitoring, optional

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();