export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Response genérico para todo (GET, GET by ID, CREATE, UPDATE)
export interface ApiResponse<T> {
  data: T;
}

// Solo para cuando necesites paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
