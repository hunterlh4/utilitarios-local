# Endpoints para Backend - Utilitarios Local

Este documento describe todos los endpoints necesarios para el frontend React.

## Base URL
```
http://localhost:3000/api
```

---

## 📺 VER

### Anime
**Base:** `/anime`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/anime` | Obtener todos los animes | - |
| GET | `/anime/:id` | Obtener anime por ID | - |
| POST | `/anime` | Crear nuevo anime | `{ title, image, episodes, status }` |
| PUT | `/anime/:id` | Actualizar anime | `{ title?, image?, episodes?, status? }` |
| DELETE | `/anime/:id` | Eliminar anime | - |

**Modelo:**
```typescript
{
  id: number;
  title: string;
  image: string;
  episodes: number;
  status: 1 | 2; // 1: proximamente, 2: completado
  createdAt: DateTime;
}
```

---

### Hentai
**Base:** `/hentai`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/hentai` | Obtener todos los hentai | - |
| GET | `/hentai/:id` | Obtener hentai por ID | - |
| POST | `/hentai` | Crear nuevo hentai | `{ title, image, episodes, status }` |
| PUT | `/hentai/:id` | Actualizar hentai | `{ title?, image?, episodes?, status? }` |
| DELETE | `/hentai/:id` | Eliminar hentai | - |

**Modelo:** Igual que Anime

---

### JAV
**Base:** `/jav`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/jav` | Obtener todos los JAV | - |
| GET | `/jav/:id` | Obtener JAV por ID | - |
| POST | `/jav` | Crear nuevo JAV | `{ code, actressId?, image, status }` |
| PUT | `/jav/:id` | Actualizar JAV | `{ code?, actressId?, image?, status? }` |
| DELETE | `/jav/:id` | Eliminar JAV | - |

**Modelo:**
```typescript
{
  id: number;
  code: string;
  actressId?: number;
  image: string;
  status: 1 | 2;
  createdAt: DateTime;
}
```

---

### Series
**Base:** `/series`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/series` | Obtener todas las series | - |
| GET | `/series/:id` | Obtener serie por ID | - |
| POST | `/series` | Crear nueva serie | `{ imdbId, title, image, year?, rating?, type?, status }` |
| PUT | `/series/:id` | Actualizar serie | `{ imdbId?, title?, image?, year?, rating?, type?, status? }` |
| DELETE | `/series/:id` | Eliminar serie | - |

**Modelo:**
```typescript
{
  id: number;
  imdbId: string;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  type?: string;
  status: 1 | 2;
  createdAt: DateTime;
}
```

---

### Actrices
**Base:** `/actress`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/actress` | Obtener todas las actrices | - |
| GET | `/actress/:id` | Obtener actriz por ID | - |
| POST | `/actress` | Crear nueva actriz | `{ name, image? }` |
| PUT | `/actress/:id` | Actualizar actriz | `{ name?, image? }` |
| DELETE | `/actress/:id` | Eliminar actriz | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  image?: string;
  createdAt: DateTime;
}
```

---

### YouTube
**Base:** `/youtube`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/youtube` | Obtener todos los videos | - |
| GET | `/youtube/:id` | Obtener video por ID | - |
| POST | `/youtube` | Crear nuevo video | Ver modelo completo abajo |
| PUT | `/youtube/:id` | Actualizar video | Ver modelo completo abajo |
| DELETE | `/youtube/:id` | Eliminar video | - |

**Modelo:**
```typescript
{
  id: number;
  url: string;
  title: string;
  authorName?: string;
  authorUrl?: string;
  type?: string;
  height?: number;
  width?: number;
  version?: string;
  providerName?: string;
  providerUrl?: string;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  thumbnailUrl?: string;
  html?: string;
  category: 1 | 2 | 3 | 4; // 1: anime, 2: serie, 3: pelicula, 4: shorts
  createdAt: DateTime;
}
```

---

## 🖼️ GALERÍA

### Galería Anime
**Base:** `/anime-galery`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/anime-galery` | Obtener todas las galerías | - |
| GET | `/anime-galery/:id` | Obtener galería por ID | - |
| POST | `/anime-galery` | Crear nueva galería | `{ name }` |
| PUT | `/anime-galery/:id` | Actualizar galería | `{ name? }` |
| DELETE | `/anime-galery/:id` | Eliminar galería | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  createdAt: DateTime;
}
```

---

### Galería Chicas
**Base:** `/girl-galery`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/girl-galery` | Obtener todas las galerías | - |
| GET | `/girl-galery/:id` | Obtener galería por ID | - |
| POST | `/girl-galery` | Crear nueva galería | `{ name }` |
| PUT | `/girl-galery/:id` | Actualizar galería | `{ name? }` |
| DELETE | `/girl-galery/:id` | Eliminar galería | - |

**Modelo:** Igual que Galería Anime

---

## 🎮 STEAM

### Cuentas
**Base:** `/account`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/account` | Obtener todas las cuentas | - |
| GET | `/account/:id` | Obtener cuenta por ID | - |
| POST | `/account` | Crear nueva cuenta | Ver modelo abajo |
| PUT | `/account/:id` | Actualizar cuenta | Ver modelo abajo |
| DELETE | `/account/:id` | Eliminar cuenta | - |

**Modelo:**
```typescript
{
  id: number;
  type: 1 | 2 | 3 | 4 | 5 | 6; // 1: Email, 2: Steam, 3: Facebook, 4: Instagram, 5: Game, 6: Other
  name: string;
  username?: string;
  password?: string;
  profileUrl?: string;
  phoneNumber?: string;
  recoveryEmail?: string;
  lastConnection?: DateTime;
  createdAt: DateTime;
}
```

---

### Búsqueda Steam
**Base:** `/steam-item`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/steam-item` | Obtener todos los items | - |
| GET | `/steam-item/:id` | Obtener item por ID | - |
| POST | `/steam-item` | Crear nuevo item | `{ name, image, price?, game, marketUrl, status }` |
| PUT | `/steam-item/:id` | Actualizar item | `{ name?, image?, price?, game?, marketUrl?, status? }` |
| DELETE | `/steam-item/:id` | Eliminar item | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  image: string;
  price?: string;
  game: 1 | 2; // 1: dota2, 2: cs2
  marketUrl: string;
  status: 1 | 2; // 1: historial, 2: por_comprar
  createdAt: DateTime;
}
```

---

### Drops
**Base:** `/steam-item-drop`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/steam-item-drop` | Obtener todos los drops | - |
| GET | `/steam-item-drop/:id` | Obtener drop por ID | - |
| POST | `/steam-item-drop` | Crear nuevo drop | `{ steamItemId, quantity, price, salePrice, total }` |
| PUT | `/steam-item-drop/:id` | Actualizar drop | `{ steamItemId?, quantity?, price?, salePrice?, total? }` |
| DELETE | `/steam-item-drop/:id` | Eliminar drop | - |

**Modelo:**
```typescript
{
  id: number;
  steamItemId: number;
  quantity: number;
  price: number;
  salePrice: number;
  total: number;
  createdAt: DateTime;
}
```

---

### Compras
**Base:** `/steam-item-purchase`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/steam-item-purchase` | Obtener todas las compras | - |
| GET | `/steam-item-purchase/:id` | Obtener compra por ID | - |
| POST | `/steam-item-purchase` | Crear nueva compra | Ver modelo abajo |
| PUT | `/steam-item-purchase/:id` | Actualizar compra | Ver modelo abajo |
| DELETE | `/steam-item-purchase/:id` | Eliminar compra | - |

**Modelo:**
```typescript
{
  id: number;
  steamItemId: number;
  purchasePrice: number;
  salePrice?: number;
  profit?: number;
  status: 1 | 2; // 1: comprado, 2: vendido
  purchaseDate: DateTime;
  saleDate?: DateTime;
  createdAt: DateTime;
}
```

---

## 🎯 DOTA

### Héroes
**Base:** `/dota-hero`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/dota-hero` | Obtener todos los héroes | - |
| GET | `/dota-hero/:id` | Obtener héroe por ID | - |
| POST | `/dota-hero` | Crear nuevo héroe | `{ name, image? }` |
| PUT | `/dota-hero/:id` | Actualizar héroe | `{ name?, image? }` |
| DELETE | `/dota-hero/:id` | Eliminar héroe | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  image?: string;
  createdAt: DateTime;
}
```

---

### Cofres
**Base:** `/dota-treasure`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/dota-treasure` | Obtener todos los cofres | - |
| GET | `/dota-treasure/:id` | Obtener cofre por ID | - |
| POST | `/dota-treasure` | Crear nuevo cofre | `{ name, image, imagePresentation?, year, type? }` |
| PUT | `/dota-treasure/:id` | Actualizar cofre | `{ name?, image?, imagePresentation?, year?, type? }` |
| DELETE | `/dota-treasure/:id` | Eliminar cofre | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  image: string;
  imagePresentation?: string;
  year: number;
  type?: 1 | 2; // 1: Treasure I, 2: Treasure II
  createdAt: DateTime;
}
```

---

### Cache
**Base:** `/dota-cache`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/dota-cache` | Obtener todos los cache | - |
| GET | `/dota-cache/:id` | Obtener cache por ID | - |
| POST | `/dota-cache` | Crear nuevo cache | Ver modelo abajo |
| PUT | `/dota-cache/:id` | Actualizar cache | Ver modelo abajo |
| DELETE | `/dota-cache/:id` | Eliminar cache | - |

**Modelo:**
```typescript
{
  id: number;
  treasureId: number;
  heroId: number;
  name: string;
  photo: string;
  price?: number;
  quantity?: number;
  total?: number;
  owner?: string;
  createdAt: DateTime;
}
```

---

### Vendedores
**Base:** `/seller`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/seller` | Obtener todos los vendedores | - |
| GET | `/seller/:id` | Obtener vendedor por ID | - |
| POST | `/seller` | Crear nuevo vendedor | `{ name?, whatsapp?, products? }` |
| PUT | `/seller/:id` | Actualizar vendedor | `{ name?, whatsapp?, products? }` |
| DELETE | `/seller/:id` | Eliminar vendedor | - |

**Modelo:**
```typescript
{
  id: number;
  name?: string;
  whatsapp?: string;
  products?: string;
  createdAt: DateTime;
}
```

---

## 💰 DINERO

### Personas
**Base:** `/person`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/person` | Obtener todas las personas | - |
| GET | `/person/:id` | Obtener persona por ID | - |
| POST | `/person` | Crear nueva persona | `{ name }` |
| PUT | `/person/:id` | Actualizar persona | `{ name? }` |
| DELETE | `/person/:id` | Eliminar persona | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  createdAt: DateTime;
}
```

---

### Pagos
**Base:** `/payment`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/payment` | Obtener todos los pagos | - |
| GET | `/payment/:id` | Obtener pago por ID | - |
| POST | `/payment` | Crear nuevo pago | `{ personId, type, amount, description?, date }` |
| PUT | `/payment/:id` | Actualizar pago | `{ personId?, type?, amount?, description?, date? }` |
| DELETE | `/payment/:id` | Eliminar pago | - |

**Modelo:**
```typescript
{
  id: number;
  personId: number;
  type: 1 | 2 | 3 | 4; // 1: deuda, 2: pago, 3: interes_deuda, 4: interes_pago
  amount: number;
  description?: string;
  date: Date;
  createdAt: DateTime;
}
```

---

### Sueldo
**Base:** `/salary`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/salary` | Obtener configuración de sueldo | - |
| POST | `/salary` | Crear configuración | Ver modelo abajo |
| PUT | `/salary/:id` | Actualizar configuración | Ver modelo abajo |

**Modelo:**
```typescript
{
  id: number;
  currentMoney?: number;
  grossSalary: number;
  afpDiscount: number;
  firstFortnightNet: number;
  secondFortnightNet: number;
  cts?: number;
  bonus?: number;
  createdAt: DateTime;
}
```

---

## 🛠️ UTILITARIOS

### Proyectos
**Base:** `/proyect`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/proyect` | Obtener todos los proyectos | - |
| GET | `/proyect/:id` | Obtener proyecto por ID | - |
| POST | `/proyect` | Crear nuevo proyecto | `{ name, description?, url? }` |
| PUT | `/proyect/:id` | Actualizar proyecto | `{ name?, description?, url? }` |
| DELETE | `/proyect/:id` | Eliminar proyecto | - |

**Modelo:**
```typescript
{
  id: number;
  name: string;
  description?: string;
  url?: string;
  createdAt: DateTime;
}
```

---

### Posts
**Base:** `/post`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/post` | Obtener todos los posts | - |
| GET | `/post/:id` | Obtener post por ID | - |
| POST | `/post` | Crear nuevo post | `{ title, description?, category, subcategory?, slug, date }` |
| PUT | `/post/:id` | Actualizar post | `{ title?, description?, category?, subcategory?, slug?, date? }` |
| DELETE | `/post/:id` | Eliminar post | - |

**Modelo:**
```typescript
{
  id: number;
  title: string;
  description?: string;
  category: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 1: Frontend, 2: Backend, 3: Mobile, 4: Diseño, 5: BD, 6: Utilidades, 7: ORM, 8: Fullstack
  subcategory?: string;
  slug: string;
  date: Date;
  createdAt: DateTime;
}
```

---

### Tareas
**Base:** `/task-list`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/task-list` | Obtener todas las listas | - |
| GET | `/task-list/:id` | Obtener lista por ID | - |
| POST | `/task-list` | Crear nueva lista | `{ id, title, status, createdAt }` |
| PUT | `/task-list/:id` | Actualizar lista | `{ id?, title?, status?, updatedAt? }` |
| DELETE | `/task-list/:id` | Eliminar lista | - |
| POST | `/task-list/task` | Crear tarea | `{ id, taskListId, title, completed }` |
| PUT | `/task-list/task/:id` | Actualizar tarea | `{ id?, taskListId?, title?, completed? }` |
| DELETE | `/task-list/task/:id` | Eliminar tarea | - |

**Modelos:**
```typescript
// TaskList
{
  id: string;
  title: string;
  status: 1 | 2; // 1: en proceso, 2: completado
  createdAt: DateTime;
  updatedAt?: DateTime;
}

// Task
{
  id: string;
  taskListId: string;
  title: string;
  completed: boolean;
}
```

---

### Eventos
**Base:** `/event`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/event` | Obtener todos los eventos | - |
| GET | `/event/:id` | Obtener evento por ID | - |
| POST | `/event` | Crear nuevo evento | `{ id, title, startDate, endDate, type, allDay, color? }` |
| PUT | `/event/:id` | Actualizar evento | `{ id?, title?, startDate?, endDate?, type?, allDay?, color? }` |
| DELETE | `/event/:id` | Eliminar evento | - |

**Modelo:**
```typescript
{
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 1 | 2; // 1: festivo, 2: personal
  allDay: boolean;
  color?: string;
  createdAt: DateTime;
}
```

---

## 🔍 METADATA

### Obtener Metadata de URL
**Base:** `/metadata`

| Método | Endpoint | Descripción | Query Params |
|--------|----------|-------------|--------------|
| GET | `/metadata` | Obtener metadata de una URL usando Microlink | `url` (string, required) |

**Ejemplo de uso:**
```
GET /api/metadata?url=https://missav123.com/en/nima-055-uncensored-leak
```

**Respuesta:**
```typescript
{
  status: "success",
  data: {
    title: "NIMA-055 Uncensored Leak...",
    description: "Starring By: Yuria Yoshine...",
    image: {
      url: "https://..."
    },
    url: "https://missav123.com/en/nima-055-uncensored-leak"
  }
}
```

**Implementación Backend:**

El backend debe llamar a Microlink API:
```
https://api.microlink.io/?url={encodedUrl}&palette=true&audio=true&video=true&iframe=true
```

---

## 📋 Formato de Respuesta

Todas las respuestas deben seguir este formato:

### Éxito (GET All)
```json
{
  "data": [...],
  "total": 10
}
```

### Éxito (GET One)
```json
{
  "data": {...}
}
```

### Éxito (POST/PUT/DELETE)
```json
{
  "message": "Operación exitosa",
  "data": {...}
}
```

### Error
```json
{
  "message": "Descripción del error",
  "statusCode": 400
}
```

---

## 🔐 Autenticación

Si implementas autenticación, el frontend enviará el token en el header:
```
Authorization: Bearer {token}
```

---

## 📝 Notas

1. Todos los endpoints deben tener el prefijo `/api`
2. Los IDs numéricos son `INT IDENTITY(1,1)` en SQL Server
3. Los IDs string (Task, Event) son timestamps
4. Los campos opcionales están marcados con `?`
5. Los enums se guardan como números (1, 2, 3, etc.)
6. Las fechas deben estar en formato ISO 8601
