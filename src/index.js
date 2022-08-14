import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SteamApp from './SteamApp.js';

/**
 * Renders the main component (SteamApp) which is the 
 * first page that is seen when opening the app.
 */
//Passing the DOM element to ReactDOM.createRoot()
const root = ReactDOM.createRoot(document.getElementById('root'));

//Renders everything in SteamApp
root.render(
    <SteamApp/>

);
