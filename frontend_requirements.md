# Requerimientos del Frontend (Plataforma de Propiedades)

Este documento detalla todos los elementos indispensables que el frontend debe implementar para consumir el backend que acabamos de construir.

## 1. Vistas y Páginas Esenciales

Para que el usuario pueda utilizar toda la funcionalidad del sistema, el frontend necesitará construir las siguientes pantallas:

### Autenticación y Usuarios
- **Página de Registro:** Formulario para crear una nueva cuenta (`username`, `email`, `password`).
- **Página de Login:** Formulario para iniciar sesión y obtener el JWT (JSON Web Token).
- **Gestión de Sesión:** El frontend debe almacenar el JWT (ej. en `localStorage` o `cookies`) e inyectarlo como header `Authorization: Bearer <token>` en todas las peticiones privadas a la API.

### Navegación Pública
- **Listado de Propiedades (Home):** Muestra todas las propiedades. Las propiedades que tengan `isFeatured: true` deberían destacar visualmente (estar de primeras, tener un borde distinto, un banner de "Destacado", etc.).
- **Detalle de Propiedad:** Vista individual de una propiedad con toda su información, categoría e imágenes completas.

### Dashboard Privado (Propietarios)
- **Mis Propiedades:** Un panel donde el usuario autenticado solo ve las propiedades que él mismo creó.
- **Crear Propiedad:** Formulario con campos: Título, Precio, Área, Ubicación, Categoría (Select) e Imágenes.
- **Editar Propiedad:** Formulario rellenado con los datos actuales para modificar una propiedad (solo disponible si el usuario logueado es el dueño).
- **Flujo de Pago (Destacar Propiedad):** Un botón en las propiedades propias no destacadas que diga "Destacar Propiedad". Al presionarlo, inicia la integración con MercadoPago.

---

## 2. Endpoints a Consumir (Integración API)

El frontend deberá hacer peticiones HTTP a la API de Strapi (por defecto `http://localhost:1337`).

> [!IMPORTANT]
> Todas las peticiones de creación, edición, eliminación y pagos requieren que envíes el header `Authorization: Bearer <TU_JWT>`.

### Autenticación (Nativo de Strapi)
- **Login:** `POST /api/auth/local` (Envía `identifier` y `password`). Retorna el `jwt` y la info del usuario.
- **Registro:** `POST /api/auth/local/register` (Envía `username`, `email` y `password`).

### Propiedades (`/api/properties`)
- **Listar todas (Público):** `GET /api/properties?populate=*`
- **Listar "Mis Propiedades" (Privado):** `GET /api/properties?filters[owner][id][$eq]=<TU_USER_ID>&populate=*`
- **Crear (Privado):** `POST /api/properties` 
  - **Body:** `{ "data": { "title": "...", "price": 1000, "area": 50, "location": "...", "category": ID_CATEGORIA } }`
  - *Nota: El backend asignará automáticamente el `owner`, no lo envíes desde el frontend.*
- **Actualizar (Privado - Solo dueño):** `PUT /api/properties/:id`
- **Eliminar (Privado - Solo dueño):** `DELETE /api/properties/:id`

### Flujo de Pagos (MercadoPago)
- **Generar Pago:** `POST /api/payments/create-preference`
  - **Body:** `{ "propertyId": ID_DE_LA_PROPIEDAD }`
  - **Respuesta:** `{ "init_point": "https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=...", "preferenceId": "..." }`
  - **Acción del Frontend:** Una vez recibes el `init_point`, debes redirigir al usuario a esa URL (o abrirla en un modal embebido usando el SDK frontend de MercadoPago) para que complete el pago.

---

## 3. Modelo de Datos de la Propiedad

Al enviar o recibir información sobre una propiedad, los campos disponibles (según el `schema.json` actual) son:

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | String | Sí | Nombre o título de la propiedad. |
| `price` | Decimal | Sí | Precio de la propiedad. |
| `area` | Float | No | Área en metros cuadrados. |
| `location` | String | No | Ubicación o dirección. |
| `isFeatured` | Boolean | No | Si es destacada. El backend la pone en `true` cuando se aprueba el pago, el frontend no debería poder mandarla directamente en el `create` para evitar trampas. |
| `category` | Relation | No | ID numérico de la categoría a la que pertenece. |
| `owner` | Relation | Automático | Relación con el usuario creador (se gestiona desde el backend automáticamente). |

> [!TIP]
> **Manejo de Imágenes (Uploads)**
> Aunque no está definido directamente como un campo de texto en el esquema básico, Strapi maneja imágenes mediante relaciones. Para que el frontend suba imágenes y las asocie a la propiedad, debe primero usar el endpoint `POST /api/upload` enviando un objeto `FormData` con los archivos físicos. Strapi procesará esto, las enviará a Cloudinary y retornará un arreglo con los IDs de las imágenes. Esos IDs son los que enlazarás a la propiedad al momento de crearla o editarla.
