import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
// import AOS from "aos";
import "aos/dist/aos.css";
// import LoginPage from './LoginPage'; // Your login component
// import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';
import "./assets/css/bootstrap.min.css"; // Icons
import "./assets/css/app.min.css"; // Main app CSS
import "./assets/css/custom.min.css"; // Custom styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter  basename="/job_frontend">
    <GlobalStyle />
    <App />
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


