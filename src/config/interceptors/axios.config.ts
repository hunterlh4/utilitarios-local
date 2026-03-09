import axios, { AxiosError } from 'axios';
import { ApiException } from '@/config/models/api-error.model';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// ============================================
// INTERCEPTOR DE REQUEST
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token automáticamente si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPONSE
// ============================================
apiClient.interceptors.response.use(
  (response): any => {
    // Retornar solo la data
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    let errorMessage = 'Error en la petición';

    if (error.response) {
      // El servidor respondió con un código de error
      errorMessage = error.response.data?.message || `Error ${status}`;

      // Manejo específico por código de estado
      if (status === 401) {
        // Token expirado o no autorizado
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        // Sin permisos
        toast.error(errorMessage || 'No tienes permisos para realizar esta acción');
      } else if (status === 404) {
        // No encontrado
        toast.error(errorMessage || 'Recurso no encontrado');
      } else if (status === 500) {
        // Error del servidor
        toast.error('Error del servidor. Intenta nuevamente más tarde.');
      } else {
        // Otros errores
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage = 'No se pudo conectar con el servidor';
      toast.error(errorMessage);
    } else {
      // Error al configurar la petición
      errorMessage = error.message || 'Error desconocido';
      toast.error(errorMessage);
    }

    // Lanzar ApiException para que los hooks puedan capturarlo si necesitan
    return Promise.reject(new ApiException(errorMessage, status || 500));
  }
);
