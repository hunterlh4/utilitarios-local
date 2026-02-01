# Ejemplo Completo: Inventario con Hooks Separados

## Estructura de Modelos

### `src/pages/Inventario/models/inventario.model.ts`
```ts
import { BaseEntity } from '@/shared/models/base.model';

export interface Producto extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoriaId: string;
  categoria: Categoria;
  estado: 'activo' | 'inactivo';
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface ProductoFilters {
  search?: string;
  categoriaId?: string;
  estado?: 'activo' | 'inactivo';
}
```

### `src/pages/Inventario/models/inventario-request.dto.ts`
```ts
export interface CreateProductoRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoriaId: string;
}

export interface UpdateProductoRequest {
  // No incluye id porque se pasa como parámetro en la URL
  nombre?: string;
  descripcion?: string;
  cantidad?: number;
  precio?: number;
  categoriaId?: string;
  estado?: 'activo' | 'inactivo';
}

export interface GetProductosRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoriaId?: string;
  estado?: 'activo' | 'inactivo';
}
```

### `src/pages/Inventario/models/inventario-response.dto.ts`
```ts
import { Producto } from './inventario.model';
import { PaginatedResponse } from '@/shared/models/base.model';

// Response para listar productos (con paginación)
export interface GetProductosResponse extends PaginatedResponse<Producto> {}

// Response para obtener un producto por ID
export interface GetProductoByIdResponse {
  data: Producto;
}

// Response para crear - solo retorna el ID creado
export interface CreateProductoResponse {
  id: string;
}

// Response para actualizar - solo retorna el ID actualizado
export interface UpdateProductoResponse {
  id: string;
}

// O si tu backend no retorna nada en create/update, usa void
// export type CreateProductoResponse = void;
// export type UpdateProductoResponse = void;
```

---

## Service

### `src/pages/Inventario/services/inventario.service.ts`
```ts
import { ApiService } from '@/shared/services/api.service';
import {
  GetProductosResponse,
  GetProductoByIdResponse,
  CreateProductoResponse,
  UpdateProductoResponse,
} from '../models/inventario-response.dto';
import {
  CreateProductoRequest,
  UpdateProductoRequest,
  GetProductosRequest,
} from '../models/inventario-request.dto';

export class InventarioService {
  // GET ALL - Listar productos con paginación y filtros
  static async getAllProductos(params: GetProductosRequest): Promise<GetProductosResponse> {
    return ApiService.get<GetProductosResponse>('/productos', params);
  }

  // GET BY ID - Obtener un producto por ID
  static async getProductoById(id: string): Promise<Producto> {
    const response = await ApiService.get<GetProductoByIdResponse>(`/productos/${id}`);
    return response.data;
  }

  // CREATE - Crear nuevo producto (retorna solo el ID)
  static async createProducto(data: CreateProductoRequest): Promise<string> {
    const response = await ApiService.post<CreateProductoResponse>('/productos', data);
    return response.id;
  }

  // UPDATE - Actualizar producto existente (retorna solo el ID)
  static async updateProducto(id: string, data: UpdateProductoRequest): Promise<string> {
    const response = await ApiService.put<UpdateProductoResponse>(`/productos/${id}`, data);
    return response.id;
  }

  // DELETE - Eliminar producto (no retorna nada)
  static async deleteProducto(id: string): Promise<void> {
    await ApiService.delete<void>(`/productos/${id}`);
  }
}
```

---

## Hooks Separados

### `src/pages/Inventario/hooks/useGetAllProductos.hook.ts`
```ts
import { useState, useEffect } from 'react';
import { InventarioService } from '../services/inventario.service';
import { Producto, ProductoFilters } from '../models/inventario.model';
import { ApiException } from '@/shared/models/api-error.model';

export const useGetAllProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductoFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await InventarioService.getAllProductos({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      setProductos(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (err) {
      // El interceptor ya mostró el toast de error
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al cargar productos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [pagination.page, pagination.limit, filters]);

  const applyFilters = (newFilters: ProductoFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    productos,
    loading,
    error,
    filters,
    pagination,
    applyFilters,
    changePage,
    refetch: fetchProductos,
  };
};
```

### `src/pages/Inventario/hooks/useGetByIdProducto.hook.ts`
```ts
import { useState } from 'react';
import { InventarioService } from '../services/inventario.service';
import { Producto } from '../models/inventario.model';
import { ApiException } from '@/shared/models/api-error.model';

export const useGetByIdProducto = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducto = async (id: string): Promise<Producto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const producto = await InventarioService.getProductoById(id);
      setProducto(producto);
      
      return producto;
    } catch (err) {
      // El interceptor ya mostró el toast de error
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al cargar producto');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { producto, loading, error, getProducto };
};
```

### `src/pages/Inventario/hooks/useAddProducto.hook.ts`
```ts
import { useState } from 'react';
import { InventarioService } from '../services/inventario.service';
import { CreateProductoRequest } from '../models/inventario-request.dto';
import { ApiException } from '@/shared/models/api-error.model';
import { toast } from 'sonner';

export const useAddProducto = (onSuccess?: (id: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProducto = async (data: CreateProductoRequest): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const id = await InventarioService.createProducto(data);
      
      // Mostrar mensaje de éxito
      toast.success('Producto creado exitosamente');
      
      // Ejecutar callback con el ID creado
      onSuccess?.(id);
      
      return id;
    } catch (err) {
      // El interceptor ya mostró el toast de error
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al crear producto');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addProducto, loading, error };
};
```

### `src/pages/Inventario/hooks/useUpdateProducto.hook.ts`
```ts
import { useState } from 'react';
import { InventarioService } from '../services/inventario.service';
import { UpdateProductoRequest } from '../models/inventario-request.dto';
import { ApiException } from '@/shared/models/api-error.model';
import { toast } from 'sonner';

export const useUpdateProducto = (onSuccess?: (id: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProducto = async (id: string, data: UpdateProductoRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedId = await InventarioService.updateProducto(id, data);
      
      // Mostrar mensaje de éxito
      toast.success('Producto actualizado exitosamente');
      
      // Ejecutar callback con el ID actualizado
      onSuccess?.(updatedId);
      
      return true;
    } catch (err) {
      // El interceptor ya mostró el toast de error
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al actualizar producto');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProducto, loading, error };
};
```

### `src/pages/Inventario/hooks/useDeleteProducto.hook.ts`
```ts
import { useState } from 'react';
import { InventarioService } from '../services/inventario.service';
import { ApiException } from '@/shared/models/api-error.model';
import { toast } from 'sonner';

export const useDeleteProducto = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProducto = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await InventarioService.deleteProducto(id);
      
      // Mostrar mensaje de éxito
      toast.success('Producto eliminado exitosamente');
      
      // Ejecutar callback si existe
      onSuccess?.();
      
      return true;
    } catch (err) {
      // El interceptor ya mostró el toast de error
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al eliminar producto');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProducto, loading, error };
};
```

---

## Uso en el Componente Page

### `src/pages/Inventario/InventarioPage.tsx`
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGetAllProductos } from './hooks/useGetAllProductos.hook';
import { useAddProducto } from './hooks/useAddProducto.hook';
import { useUpdateProducto } from './hooks/useUpdateProducto.hook';
import { useDeleteProducto } from './hooks/useDeleteProducto.hook';
import { useGetByIdProducto } from './hooks/useGetByIdProducto.hook';
import { InventarioTable } from './components/InventarioTable';
import { Producto } from './models/inventario.model';

export const InventarioPage = () => {
  // Hook para listar productos
  const { productos, loading, error, refetch } = useGetAllProductos();
  
  // Hook para agregar producto
  const { addProducto, loading: addingLoading } = useAddProducto(refetch);
  
  // Hook para actualizar producto
  const { updateProducto, loading: updatingLoading } = useUpdateProducto(refetch);
  
  // Hook para eliminar producto
  const { deleteProducto, loading: deletingLoading } = useDeleteProducto(refetch);
  
  // Hook para obtener producto por ID
  const { getProducto } = useGetByIdProducto();

  const handleCreate = async () => {
    const newProducto = {
      codigo: 'PROD001',
      nombre: 'Producto Nuevo',
      descripcion: 'Descripción del producto',
      cantidad: 10,
      precio: 99.99,
      categoriaId: '1',
    };
    
    const created = await addProducto(newProducto);
    if (created) {
      console.log('Producto creado:', created);
    }
  };

  const handleEdit = async (producto: Producto) => {
    // Actualizar producto
    const success = await updateProducto(producto.id, {
      nombre: 'Nombre Actualizado',
      cantidad: 50,
    });
    
    if (success) {
      console.log('Producto actualizado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const success = await deleteProducto(id);
      if (success) {
        console.log('Producto eliminado');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Inventario</h1>
        <Button onClick={handleCreate} disabled={addingLoading}>
          <Plus className="w-4 h-4 mr-2" />
          {addingLoading ? 'Creando...' : 'Nuevo Producto'}
        </Button>
      </div>

      <InventarioTable
        items={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isUpdating={updatingLoading}
        isDeleting={deletingLoading}
      />
    </div>
  );
};
```

---

## Ventajas de este Patrón

1. **Hooks Separados**: Cada operación CRUD tiene su propio hook
2. **Reutilizables**: Puedes usar `useAddProducto` en cualquier componente
3. **Loading States**: Cada hook maneja su propio estado de loading
4. **Error Handling**: Try/catch en cada hook, el interceptor muestra toast automáticamente
5. **Callbacks**: `onSuccess` para refrescar datos después de operaciones
6. **Type-Safe**: Todo tipado con TypeScript
7. **Clean Code**: Componentes más limpios y fáciles de mantener
8. **Sin try/catch innecesarios**: El service no tiene try/catch, solo retorna la data
9. **ID en URL**: UpdateRequest no tiene ID, se pasa como parámetro en la URL
10. **Responses minimalistas**: Create/Update solo retornan ID, no el objeto completo

---

## 📝 Notas Importantes

### ¿Por qué no usar try/catch en el service?

```ts
// ❌ MAL - Try/catch innecesario
static async getProductoById(id: string): Promise<Producto> {
  try {
    const response = await ApiService.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Solo re-lanza el error
  }
}

// ✅ BIEN - Deja que el error se propague
static async getProductoById(id: string): Promise<Producto> {
  const response = await ApiService.get<GetProductoByIdResponse>(`/productos/${id}`);
  return response.data;
}
```

El interceptor de Axios ya maneja los errores y muestra el toast. El hook captura el error si necesita hacer algo específico.

### ¿Por qué UpdateRequest no tiene ID?

```ts
// ❌ MAL - ID en el body
interface UpdateProductoRequest {
  id: string;  // ❌ No necesario
  nombre?: string;
}

// Service
static async updateProducto(data: UpdateProductoRequest) {
  return ApiService.put(`/productos/${data.id}`, data); // ID duplicado
}

// ✅ BIEN - ID como parámetro
interface UpdateProductoRequest {
  nombre?: string;  // ✅ Solo los campos a actualizar
}

// Service
static async updateProducto(id: string, data: UpdateProductoRequest) {
  return ApiService.put(`/productos/${id}`, data); // ID solo en URL
}
```

### ¿Por qué Create/Update solo retornan ID?

```ts
// ❌ MAL - Retornar objeto completo (innecesario)
interface CreateProductoResponse {
  data: Producto; // ❌ Mucha data innecesaria
}

// ✅ BIEN - Solo el ID (o void si no retorna nada)
interface CreateProductoResponse {
  id: string; // ✅ Solo lo necesario
}

// O si tu backend no retorna nada:
type CreateProductoResponse = void;
```

Después de crear/actualizar, el hook llama a `refetch()` para obtener la lista actualizada. No necesitas el objeto completo en la respuesta.

