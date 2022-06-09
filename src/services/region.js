import axios from 'axios';
import { API_URL } from '../constants/api';

export default (() => {
  async function add(payload) {
    const response = await axios.post(`${API_URL}region`, payload);
    return response;
  }

  async function remove(regionId) {
    const response = await axios.delete(`${API_URL}region/${regionId}`);
    return response;
  }

  return {
    add,
    remove,
  };
})();
