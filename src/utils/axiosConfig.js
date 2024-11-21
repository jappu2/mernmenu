import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Or 127.0.0.1:5000
});

export default instance;