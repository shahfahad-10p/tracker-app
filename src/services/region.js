import axios from 'axios';
import { API_URL } from '../constants/api';

export default (() => {
  async function add(payload) {
    const response = await axios.post(`${API_URL}region`, payload);
    return response;
  }

  return {
    add,
  };
})();
