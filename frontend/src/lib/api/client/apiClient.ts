// configuracao da api aqui
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';

// definimos de onde vem o back end
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,  // <-- chave para mandar cookie httpOnly
  headers: {
    'Content-Type': 'application/json',
  }
});
