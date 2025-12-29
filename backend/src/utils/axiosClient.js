import axios from "axios";

const axiosClient = axios.create({
  // timeout: 10000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    throw err;
  }
);

export default axiosClient;
