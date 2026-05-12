# Directrices de Implementación — Frontend (`Proyecto_Web2`)

## 🎨 Sistema de Diseño (ya establecido — mantener consistencia)

### Colores
```css
--primary:        #0F766E   /* Teal oscuro — botones primarios, headings */
--primary-light:  #14B8A6   /* Teal claro — hover, acentos */
--secondary:      #0369A1   /* Azul — links */
--background:     #F0FDFA   /* Fondo general */
--text:           #134E4A   /* Texto principal */
--text-muted:     #475569   /* Texto secundario, subtítulos */
--glass:          rgba(255,255,255,0.7)  /* Glassmorphism */
--featured-glow:  rgba(20,184,166,0.3)  /* Glow de propiedades destacadas */
```

### Tipografía
- **Headings** (`h1`–`h6`): `Cinzel` (serif, elegante)
- **Body / UI**: `Josefin Sans` (sans-serif, moderno)

### Clases utilitarias existentes
- `.glass` → glassmorphism card
- `.container` → max-width 1200px centrado
- `.featured` → glow verde en PropertyCard

---

## 📁 Arquitectura de Estado

No hay un Context/Redux implementado. El estado de sesión vive en `localStorage`:

| Clave | Contenido | Cuándo se guarda |
|---|---|---|
| `jwt` | String del token JWT | Al hacer login o register |
| `user` | JSON del objeto usuario `{ id, username, email }` | Al hacer login o register |

### Patrón para leer sesión en cualquier componente
```tsx
const jwt = localStorage.getItem('jwt');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAuthenticated = !!jwt;
```

### Patrón para cerrar sesión
```tsx
localStorage.removeItem('jwt');
localStorage.removeItem('user');
navigate('/');
window.location.reload(); // Fuerza re-render de Navbar
```

> [!NOTE]
> El `window.location.reload()` es necesario porque el Navbar lee `localStorage` directamente en cada render (no hay state reactivo global). Si en el futuro se añade un Context, este reload desaparecería.

---

## 🔌 Cómo Consumir la API

### Usar SIEMPRE la capa `src/api/` — no axios directo

```tsx
// ✅ Correcto
import { propertiesAPI, authAPI } from '../api';
const data = await propertiesAPI.getAll();

// ❌ Incorrecto (hay componentes que lo hacen así — migrar)
import axios from 'axios';
const data = await axios.get(`${API_URL}/api/properties`);
```

### Estructura de respuesta de Strapi v4

**Todas** las respuestas de colecciones tienen esta forma:
```json
{
  "data": [
    { "id": 1, "attributes": { "title": "...", "price": 1000, ... } }
  ],
  "meta": { "pagination": { "page": 1, "pageSize": 25, "total": 5 } }
}
```

**Función de transformación estándar** (usar en todos los componentes):
```tsx
function transformProperty(item: any) {
  const attrs = item.attributes;
  const imageUrl = attrs.images?.data?.[0]?.attributes?.url;
  return {
    id: item.id,
    title: attrs.title,
    price: attrs.price,
    location: attrs.location || 'Sin ubicación',
    area: attrs.area || 0,
    isFeatured: attrs.isFeatured || false,
    category: attrs.category?.data?.attributes?.name || 'Sin categoría',
    // ⚠️ Cloudinary devuelve URL ABSOLUTA — NO prefixar con API_URL
    image: imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  };
}
```

> [!CAUTION]
> **Bug activo en `PropertyList.tsx` y `Dashboard.tsx`:** El código actual hace `${API_URL}${url}` para las imágenes. Cloudinary devuelve URLs absolutas (`https://res.cloudinary.com/...`), por lo que esto genera URLs rotas en producción. Corregir en ambos componentes.

---

## 📄 Estado y Tareas por Página/Componente

### ✅ Ya implementados (mantener, solo migrar a `src/api/`)

| Componente | Tarea pendiente |
|---|---|
| `Navbar.tsx` | Sin cambios |
| `Hero.tsx` | Conectar búsqueda al filtro de `PropertyList` |
| `Footer.tsx` | Sin cambios |
| `Login.tsx` | Migrar de `axios` directo a `authAPI.login()` |
| `Register.tsx` | Migrar de `axios` directo a `authAPI.register()` |
| `PropertyCard.tsx` | Sin cambios funcionales |
| `PropertyList.tsx` | Migrar a `propertiesAPI.getAll()` + corregir bug imagen |
| `Dashboard.tsx` | Migrar a `propertiesAPI.getMyProperties()` + conectar botones |

---

### 🔴 `Dashboard.tsx` — Acciones a implementar

#### Botón "Create Property" (modal o nueva página)
```tsx
// Campos del formulario
const payload = {
  title: string,      // requerido
  price: number,      // requerido
  area: number,       // opcional
  location: string,   // opcional
  category: number,   // ID numérico de la categoría (opcional)
};
// El owner lo asigna el backend automáticamente
await propertiesAPI.create(payload);
```

#### Botón "Edit" por propiedad
```tsx
await propertiesAPI.update(propertyId, { title, price, ... });
```

#### Botón "Promote" (destacar con MercadoPago)
```tsx
import { paymentsAPI } from '../api';

const result = await paymentsAPI.createPreference(propertyId);
// Redirigir al usuario al checkout de MercadoPago
window.location.href = result.init_point;
```

---

### 🔴 `Properties.tsx` — Página de listado completo

Actualmente solo renderiza `<PropertyList />`. Debe ampliar con:
- **Filtros en la URL**: `?category=X&minPrice=Y&maxPrice=Z&location=Q`
- **Paginación**: usar `meta.pagination` de la respuesta de Strapi
- **Buscador conectado al Hero**

---

## 🔐 Rutas Protegidas

Las páginas de Dashboard deben redirigir si no hay JWT. Patrón actual (ya en Dashboard):

```tsx
useEffect(() => {
  if (!localStorage.getItem('jwt')) {
    navigate('/login');
  }
}, []);
```

Para escalarlo, crear un componente `ProtectedRoute`:
```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const jwt = localStorage.getItem('jwt');
  return jwt ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
```

Usar en `App.tsx`:
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

---

## 📤 Subida de Imágenes

Para la creación/edición de propiedades con imágenes:

```tsx
// Paso 1: subir las imágenes a Strapi/Cloudinary
const uploadedImages = await propertiesAPI.uploadImages(files); // Array<File>
const imageIds = uploadedImages.map((img: any) => img.id);

// Paso 2: crear la propiedad con los IDs de las imágenes
await propertiesAPI.create({
  title: '...',
  price: 1000,
  images: imageIds, // Array de IDs numéricos
});
```

---

## ⚙️ Variables de Entorno

Crear/actualizar `frontend/.env`:
```env
VITE_API_URL=http://localhost:1337
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key
```

En producción (Render Dashboard del servicio frontend):
```env
VITE_API_URL=https://strapi-backend.onrender.com
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key
```

> [!IMPORTANT]
> El archivo `.env` **NO** debe subirse al repositorio. Está en `.gitignore`. Las variables se configuran manualmente en el Dashboard de Render.

---

## 🚀 Checklist de Implementación

- [ ] Corregir bug de imágenes en `PropertyList.tsx` y `Dashboard.tsx`
- [ ] Migrar `PropertyList.tsx` a `propertiesAPI.getAll()`
- [ ] Migrar `Dashboard.tsx` a `propertiesAPI.getMyProperties()`
- [ ] Migrar `Login.tsx` a `authAPI.login()`
- [ ] Migrar `Register.tsx` a `authAPI.register()`
- [ ] Implementar modal o página "Crear Propiedad" en Dashboard
- [ ] Implementar lógica de "Edit" en Dashboard
- [ ] Implementar lógica de "Promote" (botón → `paymentsAPI.createPreference` → redirect)
- [ ] Añadir `ProtectedRoute` en `App.tsx`
- [ ] Conectar buscador del Hero a los filtros de `PropertyList`
- [ ] Añadir categorías dinámicas al `<select>` del Hero (fetch a `/api/categories`)
- [ ] Implementar paginación en `Properties.tsx`
