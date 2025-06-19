import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios client instance
const createAxiosClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api' || '/api',
    timeout: 20000
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Create the client instance
const httpClient = createAxiosClient();

// Request object with 4 HTTP methods
const requests = {
  // GET method
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return httpClient.get<T>(url, config);
  },

  // POST method
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return httpClient.post<T>(url, data, config);
  },

  // PUT method
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return httpClient.put<T>(url, data, config);
  },

  // DELETE method
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return httpClient.delete<T>(url, config);
  }
};

// Export the client instance as well for advanced usage
export { httpClient };

// Default export
export default requests;
