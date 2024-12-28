// src/config/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Then import this in your app's entry point (usually index.js or App.js)