import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { showConfigurationStatus } from './utils/envCheck';

// 显示配置状态
showConfigurationStatus();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
