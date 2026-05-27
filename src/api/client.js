import axios from 'axios';

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API}/api`,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(err);
      }
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/user/refresh-token`,
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(original);
      } catch {
        clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userinfo');
};

export default client;
