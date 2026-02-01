// Modelo para errores de la API
export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiException extends Error {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiException';
    this.message = message;
    this.statusCode = statusCode;
  }
}
