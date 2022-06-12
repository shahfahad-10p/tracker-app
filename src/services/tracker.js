import axios from 'axios';
import { API_URL } from '../constants/api';

export default (() => {
  async function add(payload) {
    const response = await axios.post(`${API_URL}tracker`, payload);
    return response;
  }

  async function remove(trackerId) {
    const response = await axios.delete(`${API_URL}tracker/${trackerId}`);
    return response;
  }

  async function validate(name) {
    const response = await axios.get(`${API_URL}tracker/${name}/validate`);
    return response.data;
  }

  return {
    add,
    remove,
    validate,
  };
})();
