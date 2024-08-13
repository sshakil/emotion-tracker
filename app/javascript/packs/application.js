// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);

// Import necessary libraries for React and Redux
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../configureStore'; // Adjust the path to your actual store configuration
import App from '../components/App'; // Adjust the path to your main React component

// Initialize Redux store
const store = configureStore();

// Render the React app into the #root element in your HTML
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root') // Ensure this matches the element ID in your HTML file
    );
});