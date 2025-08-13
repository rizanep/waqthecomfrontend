import axios from "axios";

const api = axios.create({
  baseURL: "https://waqthecom.duckdns.org/api/"
});

export default api;
