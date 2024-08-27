import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {PostProvider} from "./pages/boardpage/PostContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <PostProvider>
    <App />
    </PostProvider>
);
