# Guía de Instalación y Configuración - Proyecto React

## 📋 Estructura Final del Proyecto

```
utilitarios-local/
├── src/
│   ├── config/
│   │   └── axios.config.ts          # Configuración de Axios con interceptores
│   ├── components/
│   │   ├── ui/              # Componentes ShadCN
│   │   └── layout/
│   │       ├── Layout.tsx
│   │       └── Navbar.tsx
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   └── StatsCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useHome.hook.ts
│   │   │   ├── services/
│   │   │   │   └── home.service.ts
│   │   │   ├── models/
│   │   │   │   ├── home.model.ts
│   │   │   │   └── home-request.dto.ts  # Solo si necesitas DTOs de request
│   │   │   └── HomePage.tsx
│   │   └── Inventario/
│   │       ├── components/
│   │       │   ├── InventarioTable.tsx
│   │       │   ├── InventarioFilters.tsx
│   │       │   ├── InventarioForm.tsx
│   │       │   └── InventarioCard.tsx
│   │       ├── hooks/
│   │       │   ├── useInventario.hook.ts
│   │       │   └── useInventarioForm.hook.ts
│   │       ├── services/
│   │       │   └── inventario.service.ts
│   │       ├── models/
│   │       │   ├── inventario.model.ts
│   │       │   ├── inventario-request.dto.ts
│   │       │   └── inventario-response.dto.ts
│   │       └── InventarioPage.tsx
│   ├── shared/
│   │   ├── models/
│   │   │   ├── base.model.ts
│   │   │   └── api-error.model.ts    # ApiException para errores
│   │   ├── hooks/
│   │   │   ├── useDarkMode.hook.ts
│   │   │   └── useToast.hook.ts
│   │   ├── services/
│   │   │   └── api.service.ts        # Wrapper de métodos HTTP
│   │   ├── utils/
│   │   │   └── validators.ts
│   │   └── types/
│   │       └── http.types.ts
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── components.json
```

---

## 🚀 Paso a Paso - Instalación y Configuración

### **PASO 1: Crear el Proyecto con Vite + React + TypeScript**

```bash
npm create vite@latest utilitarios-local -- --template react-ts
cd utilitarios-local
npm install
```

---

### **PASO 2: Instalar y Configurar ShadCN UI con Tailwind**

#### 2.1 Instalar Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2.2 Configurar Tailwind
Editar `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 2.3 Configurar estilos globales
Crear/editar `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### 2.4 Instalar ShadCN UI
```bash
npm install -D @types/node
npx shadcn-ui@latest init
```

Responder a las preguntas:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

#### 2.5 Instalar componentes básicos de ShadCN
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add sonner
```

---

### **PASO 3: Instalar y Configurar Framer Motion**

```bash
npm install framer-motion
```

---

### **PASO 4: Instalar React Router y Axios**

```bash
npm install react-router-dom axios
```

---

### **PASO 5: Configurar Path Aliases en Vite**

Editar `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Editar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### **PASO 6: Crear Estructura de Carpetas**

```bash
mkdir -p src/config
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/pages/Home/components
mkdir -p src/pages/Home/hooks
mkdir -p src/pages/Home/services
mkdir -p src/pages/Home/models
mkdir -p src/pages/Inventario/components
mkdir -p src/pages/Inventario/hooks
mkdir -p src/pages/Inventario/services
mkdir -p src/pages/Inventario/models
mkdir -p src/shared/models
mkdir -p src/shared/hooks
mkdir -p src/shared/services
mkdir -p src/shared/utils
mkdir -p src/shared/types
mkdir -p src/routes
mkdir -p src/styles
```

---

### **PASO 7: Crear Modelos Globales**

Crear `src/shared/models/base.model.ts`:
```ts
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

Crear `src/shared/models/api-error.model.ts`:
```ts
// Modelo para errores de la API
export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiException extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
```

---

### **PASO 8: Crear Types Globales**

Crear `src/shared/types/http.types.ts`:
```ts
export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}
```

---

### **PASO 9: Crear Loading Context Global**

Crear `src/shared/contexts/LoadingContext.tsx`:
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = () => {
    setLoadingCount((prev) => prev + 1);
  };

  const hideLoading = () => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <LoadingContext.Provider value={{ isLoading: loadingCount > 0, showLoading, hideLoading }}>
      {children}
      {loadingCount > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Cargando...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider');
  }
  return context;
};
```

---

### **PASO 10: Crear Axios Client con Interceptores**

Crear `src/config/axios.config.ts`:
```ts
import axios, { AxiosError } from 'axios';
import { ApiException } from '@/shared/models/api-error.model';
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
  (response) => {
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
```

Crear `src/shared/services/api.service.ts`:
```ts
import { apiClient } from '@/config/axios.config';

export class ApiService {
  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return apiClient.get<T, T>(endpoint, { params });
  }

  static async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.post<T, T>(endpoint, data);
  }

  static async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.put<T, T>(endpoint, data);
  }

  static async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.patch<T, T>(endpoint, data);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return apiClient.delete<T, T>(endpoint);
  }
}
```

---

### **PASO 10: Crear Hooks Globales en Shared**

Crear `src/shared/hooks/useDarkMode.hook.ts`:
```ts
import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark(!isDark) };
};
```

Crear `src/shared/hooks/useToast.hook.ts`:
```ts
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};
```

---

### **PASO 11: Crear Layout y Navbar**

Crear `src/components/layout/Navbar.tsx`:
```tsx
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/shared/hooks/useDarkMode.hook';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Utilitarios Local
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-primary">
              Inicio
            </Link>
            {/* Agregar más links aquí */}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};
```

Crear `src/components/layout/Layout.tsx`:
```tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

export const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};
```

---

### **PASO 12: Crear Ejemplo de Page Home con su Estructura**

Crear `src/pages/Home/models/home.model.ts`:
```ts
import { BaseEntity } from '@/shared/models/base.model';

export interface HomeData extends BaseEntity {
  title: string;
  description: string;
  stats: HomeStats;
}

export interface HomeStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
}
```

Crear `src/pages/Home/services/home.service.ts`:
```ts
import { ApiService } from '@/shared/services/api.service';
import { HomeData } from '../models/home.model';

export class HomeService {
  static async getHomeData(): Promise<HomeData> {
    return ApiService.get<HomeData>('/home');
  }
}
```

Crear `src/pages/Home/hooks/useHome.hook.ts`:
```ts
import { useState, useEffect } from 'react';
import { HomeService } from '../services/home.service';
import { HomeData } from '../models/home.model';
import { ApiException } from '@/shared/models/api-error.model';

export const useHome = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getHomeData();
        setData(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
```

Crear `src/pages/Home/components/HeroSection.tsx`:
```tsx
interface HeroSectionProps {
  title: string;
  description: string;
}

export const HeroSection = ({ title, description }: HeroSectionProps) => {
  return (
    <div className="text-center py-12">
      <h1 className="text-5xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground">{description}</p>
    </div>
  );
};
```

Crear `src/pages/Home/components/StatsCard.tsx`:
```tsx
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export const StatsCard = ({ label, value, icon }: StatsCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    </Card>
  );
};
```

Crear `src/pages/Home/HomePage.tsx`:
```tsx
import { HeroSection } from './components/HeroSection';
import { StatsCard } from './components/StatsCard';
import { useHome } from './hooks/useHome.hook';
import { Users, Package, DollarSign } from 'lucide-react';

export const HomePage = () => {
  const { data } = useHome();

  // El loading se muestra automáticamente con el LoadingContext
  // Los errores se muestran automáticamente con toast
  
  if (!data) return null;

  return (
    <div>
      <HeroSection title={data.title} description={data.description} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatsCard
          label="Total Usuarios"
          value={data.stats.totalUsers}
          icon={<Users className="w-8 h-8" />}
        />
        <StatsCard
          label="Total Productos"
          value={data.stats.totalProducts}
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          label="Total Ventas"
          value={data.stats.totalSales}
          icon={<DollarSign className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
```

---

### **PASO 13: Crear Ejemplo de Page Inventario con Múltiples Componentes**

Crear `src/pages/Inventario/models/inventario.model.ts`:
```ts
import { BaseEntity } from '@/shared/models/base.model';

export interface Inventario extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  estado: 'activo' | 'inactivo';
}

export interface InventarioFilters {
  search?: string;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
}
```

Crear `src/pages/Inventario/models/inventario-request.dto.ts`:
```ts
export interface CreateInventarioRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
}

export interface UpdateInventarioRequest {
  id: string;
  nombre?: string;
  descripcion?: string;
  cantidad?: number;
  precio?: number;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
}

export interface GetInventarioListRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
}
```

Crear `src/pages/Inventario/models/inventario-response.dto.ts`:
```ts
import { Inventario } from './inventario.model';
import { PaginatedResponse } from '@/shared/models/base.model';

export interface GetInventarioListResponse extends PaginatedResponse<Inventario> {}

export interface GetInventarioByIdResponse {
  data: Inventario;
}

export interface CreateInventarioResponse {
  data: Inventario;
}

export interface UpdateInventarioResponse {
  data: Inventario;
}
```

Crear `src/pages/Inventario/services/inventario.service.ts`:
```ts
import { ApiService } from '@/shared/services/api.service';
import { PaginatedResponse } from '@/shared/models/base.model';
import { Inventario } from '../models/inventario.model';
import {
  CreateInventarioRequest,
  UpdateInventarioRequest,
  GetInventarioListRequest,
} from '../models/inventario-request.dto';

export class InventarioService {
  static async getList(params: GetInventarioListRequest): Promise<PaginatedResponse<Inventario>> {
    return ApiSes/inventario-request.dto';

export class InventarioService {
  static async getAllProductos(params: GetProductosRequest): Promise<GetProductosResponse> {
    return ApiService.get<GetProductosResponse>('/productos', params);
  }

  static async getProductoById(id: string): Promise<GetProductoByIdResponse> {
    return ApiService.get<GetProductoByIdResponse>(`/productos/${id}`);
  }

  static async createProducto(data: CreateProductoRequest): Promise<CreateProductoResponse> {
    return ApiService.post<CreateProductoResponse>('/productos', data);
  }

  static async updateProducto(data: UpdateProductoRequest): Promise<UpdateProductoResponse> {
    return ApiService.put<UpdateProductoResponse>(`/productos/${data.id}`, data);
  }

  static async deleteProducto(id: string): Promise<void> {
    return ApiService.delete<void>(`/productos/${id}`);
  }
}
```

Crear `src/pages/Inventario/hooks/useInventario.hook.ts`:
```ts
import { useState, useEffect } from 'react';
import { InventarioService } from '../services/inventario.service';
import { Inventario, InventarioFilters } from '../models/inventario.model';
import { ApiException } from '@/shared/models/api-error.model';

export const useInventario = () => {
  const [items, setItems] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventarioFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await InventarioService.getList({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      setItems(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
      setError(null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [pagination.page, pagination.limit, filters]);

  const applyFilters = (newFilters: InventarioFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    items,
    loading,
    error,
    filters,
    pagination,
    applyFilters,
    changePage,
    refetch: fetchItems,
  };
};
```

Crear `src/pages/Inventario/hooks/useInventarioForm.hook.ts`:
```ts
import { useState } from 'react';
import { InventarioService } from '../services/inventario.service';
import { CreateInventarioRequest, UpdateInventarioRequest } from '../models/inventario-request.dto';
import { ApiException } from '@/shared/models/api-error.model';

export const useInventarioForm = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateInventarioRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await InventarioService.create(data);
      onSuccess?.();
      return response.data;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al crear');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (data: UpdateInventarioRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await InventarioService.update(data);
      onSuccess?.();
      return response.data;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al actualizar');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await InventarioService.delete(id);
      onSuccess?.();
      return true;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al eliminar');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, deleteItem, loading, error };
};
```

Crear `src/pages/Inventario/components/InventarioFilters.tsx`:
```tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventarioFilters as Filters } from '../models/inventario.model';
import { useState } from 'react';

interface InventarioFiltersProps {
  onApplyFilters: (filters: Filters) => void;
}

export const InventarioFilters = ({ onApplyFilters }: InventarioFiltersProps) => {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [estado, setEstado] = useState<'activo' | 'inactivo' | ''>('');

  const handleApply = () => {
    onApplyFilters({
      search: search || undefined,
      categoria: categoria || undefined,
      estado: estado || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setCategoria('');
    setEstado('');
    onApplyFilters({});
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">Buscar</label>
        <Input
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-48">
        <label className="text-sm font-medium mb-2 block">Categoría</label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="electronica">Electrónica</SelectItem>
            <SelectItem value="ropa">Ropa</SelectItem>
            <SelectItem value="alimentos">Alimentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <label className="text-sm font-medium mb-2 block">Estado</label>
        <Select value={estado} onValueChange={(v) => setEstado(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleApply}>Aplicar</Button>
      <Button variant="outline" onClick={handleReset}>Limpiar</Button>
    </div>
  );
};
```

Crear `src/pages/Inventario/components/InventarioTable.tsx`:
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Inventario } from '../models/inventario.model';
import { Edit, Trash2 } from 'lucide-react';

interface InventarioTableProps {
  items: Inventario[];
  onEdit: (item: Inventario) => void;
  onDelete: (id: string) => void;
}

export const InventarioTable = ({ items, onEdit, onDelete }: InventarioTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.codigo}</TableCell>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>${item.precio.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.estado === 'activo'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {item.estado}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

Crear `src/pages/Inventario/components/InventarioCard.tsx`:
```tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inventario } from '../models/inventario.model';
import { Edit, Trash2, Package } from 'lucide-react';

interface InventarioCardProps {
  item: Inventario;
  onEdit: (item: Inventario) => void;
  onDelete: (id: string) => void;
}

export const InventarioCard = ({ item, onEdit, onDelete }: InventarioCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{item.nombre}</h3>
            <p className="text-sm text-muted-foreground">{item.codigo}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.estado === 'activo'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {item.estado}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{item.descripcion}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Cantidad</p>
          <p className="font-semibold">{item.cantidad}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="font-semibold">${item.precio.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
```

Crear `src/pages/Inventario/InventarioPage.tsx`:
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { useInventario } from './hooks/useInventario.hook';
import { useInventarioForm } from './hooks/useInventarioForm.hook';
import { InventarioFilters } from './components/InventarioFilters';
import { InventarioTable } from './components/InventarioTable';
import { InventarioCard } from './components/InventarioCard';
import { Inventario } from './models/inventario.model';

export const InventarioPage = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { items, loading, error, applyFilters, refetch } = useInventario();
  const { deleteItem } = useInventarioForm(refetch);

  const handleEdit = (item: Inventario) => {
    // Abrir modal o navegar a formulario de edición
    console.log('Editar:', item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      await deleteItem(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Inventario</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Item
        </Button>
      </div>

      <div className="mb-6">
        <InventarioFilters onApplyFilters={applyFilters} />
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <InventarioTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <InventarioCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### **PASO 14: Configurar Rutas**

Crear `src/routes/AppRoutes.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/Home/HomePage';
import { InventarioPage } from '@/pages/Inventario/InventarioPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="inventario" element={<InventarioPage />} />
          {/* Agregar más rutas aquí */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

### **PASO 15: Actualizar Navbar con Links**

Actualizar `src/components/layout/Navbar.tsx`:
```tsx
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/shared/hooks/useDarkMode.hook';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Utilitarios Local
          </Link>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`hover:text-primary transition-colors ${
                isActive('/') ? 'text-primary font-semibold' : ''
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/inventario"
              className={`hover:text-primary transition-colors ${
                isActive('/inventario') ? 'text-primary font-semibold' : ''
              }`}
            >
              Inventario
            </Link>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};
```

Editar `src/App.tsx`:
```tsx
import { AppRoutes } from './routes/AppRoutes';
import './styles/globals.css';

function App() {
  return <AppRoutes />;
}

export default App;
```

Editar `src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### **PASO 16: Configurar App Principal**

Editar `src/App.tsx`:
```tsx
import { AppRoutes } from './routes/AppRoutes';
import './styles/globals.css';

function App() {
  return <AppRoutes />;
}

export default App;
```

Editar `src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### **PASO 17: Instalar Componentes Adicionales de ShadCN**

```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input
```

---

### **PASO 18: Crear archivo .env**

Crear `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

---

### **PASO 19: Ejecutar el Proyecto**

```bash
npm run dev
```

---

## 📝 Notas Importantes

1. **Estructura por Page**: Cada página tiene su propia carpeta con:
   - `components/` - Componentes específicos de esa página
   - `hooks/` - Hooks personalizados para lógica de la página
   - `services/` - Servicios para comunicación con API
   - `models/` - Modelos, DTOs de request y response

2. **Config**: Configuración centralizada del proyecto en `src/config/`:
   - `axios.config.ts` - Configuración de Axios con interceptores globales
   - `constants.ts` - Constantes globales de la aplicación
   - `env.ts` - Variables de entorno tipadas

3. **Shared**: Recursos reutilizables en `src/shared/`:
   - Modelos base y `ApiException` para manejo de errores
   - Hooks globales como `useDarkMode`
   - `api.service.ts` wrapper simple sobre Axios
   - Utilidades y tipos compartidos

4. **Backend Integration con Axios**: 
   - Axios configurado una sola vez en `config/axios.config.ts`
   - Interceptor de request agrega token automáticamente
   - Interceptor de response maneja errores por código de estado
   - Toast automático para errores (401, 403, 404, 500, etc.)
   - Redirección automática a login en 401
   - No se pasan headers en cada llamada (se agregan automáticamente)
   - Los services solo llaman métodos simples: `ApiService.get('/productos')`

4. **Múltiples Componentes por Page**: 
   - Ejemplo: Inventario tiene `InventarioTable`, `InventarioCard`, `InventarioFilters`, `InventarioForm`
   - Cada componente es reutilizable dentro de su página
   - Mantiene la separación de responsabilidades

5. **Dark Mode**: Implementado con hook global y persistencia en localStorage

6. **Motion**: Framer Motion configurado en el Layout para transiciones suaves

7. **TypeScript**: Todo tipado para mejor desarrollo y autocompletado

8. **Alias**: `@/` apunta a `src/` para imports más limpios

9. **Vistas Múltiples**: Ejemplo de tabla y grid en Inventario con toggle de vista

10. **Axios con Interceptores Centralizados**: 
   - Configuración única en `config/axios.config.ts`
   - Interceptor de request agrega token automáticamente desde localStorage
   - Interceptor de response maneja errores por código de estado (401, 403, 404, 500)
   - Toast automático para cada tipo de error
   - Redirección automática a /login en 401
   - No se pasan headers en cada llamada (todo centralizado)
   - Los services son súper simples: `ApiService.get('/productos', params)`

---

## 🎯 Próximos Pasos

- Agregar más páginas siguiendo la estructura de `Home` o `Inventario`
- Cada página nueva debe tener su carpeta con `components/`, `hooks/`, `services/`, `models/`
- Los DTOs de request y response van dentro de `models/` de cada página
- Implementar autenticación si es necesario (agregar token en interceptor)
- Agregar más componentes de ShadCN según necesites
- Configurar variables de entorno para diferentes ambientes
- Implementar toast notifications globales para mostrar errores
- Agregar loading states globales con contexto
- Implementar paginación completa en tablas
- Agregar formularios modales para crear/editar

---

## 🔄 Patrón de Desarrollo para Nuevas Páginas

Cuando crees una nueva página, sigue este patrón:

1. Crear carpeta en `src/pages/[NombrePagina]/`
2. Crear subcarpetas: `components/`, `hooks/`, `services/`, `models/`
3. En `models/`: crear `[nombre].model.ts`, `[nombre]-request.dto.ts`, `[nombre]-response.dto.ts`
4. En `services/`: crear `[nombre].service.ts` usando `ApiService`
   ```ts
   // Ejemplo simple - el interceptor maneja los errores
   static async getProducts(): Promise<ProductDto[]> {
     return ApiService.get<ProductDto[]>('/products');
   }
   ```
5. En `hooks/`: crear hooks personalizados que usen el service con try/catch
   ```ts
   try {
     const products = await ProductService.getProducts();
     setProducts(products);
   } catch (err) {
     if (err instanceof ApiException) {
       setError(err.message);
     }
   }
   ```
6. En `components/`: crear componentes específicos de la página
7. Crear `[Nombre]Page.tsx` que orqueste todo
8. Agregar ruta en `AppRoutes.tsx`
9. Agregar link en `Navbar.tsx`

---

## 💡 Ventajas de Axios con Interceptores

1. **Código más limpio**: Los services retornan directamente el tipo esperado sin wrappers
2. **Manejo centralizado de errores**: Un solo lugar para manejar todos los errores HTTP
3. **Autenticación automática**: El interceptor agrega el token en cada request
4. **Toast automático**: Los errores se muestran automáticamente al usuario
5. **Loading global**: Spinner automático mientras se hacen peticiones
6. **Mejor que fetch nativo**: 
   - Transformación automática de JSON
   - Manejo de timeouts (30 segundos configurado)
   - Cancelación de peticiones
   - Mejor manejo de errores con tipos
   - Progress events para uploads
   - Interceptores nativos
7. **Similar a Angular**: Patrón familiar si vienes de Angular HttpClient
8. **Type-safe**: TypeScript infiere correctamente los tipos de retorno
9. **Menos boilerplate**: No necesitas verificar `isSuccess` o `response.ok` en cada llamada
10. **Extensible**: Fácil agregar retry logic, logging, refresh token, etc.

---

## 🔧 Características Adicionales Implementadas

- **Loading Context**: Spinner global que se muestra automáticamente en cada petición
- **Toast Notifications**: Usando `sonner` para mostrar errores automáticamente
- **Error Handling**: `ApiException` personalizada con mensaje y código de estado
- **Token Management**: Interceptor agrega automáticamente el token de localStorage
- **Timeout**: 30 segundos configurado por defecto
- **Type Safety**: Todo tipado con TypeScript para mejor DX
