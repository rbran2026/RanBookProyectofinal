Markdown
# 📚 RanBook - Catálogo de Libros y Materiales

RanBook es una plataforma web comunitaria diseñada para la gestión, control e intercambio de recursos y materiales educativos. El sistema cuenta con un panel administrativo completo que permite supervisar catálogos, solicitudes de usuarios, categorías y auditorías de actividad.

---

## 🚀 Tecnologías Utilizadas

### Frontend
* **Angular** (Versión Standalone Components)
* **TypeScript**
* **Bootstrap** (Diseño y estilos responsivos)
* **RxJS**

### Backend
* **Node.js** con **Express**
* **TypeScript**
* **MySQL** (Base de datos relacional)
* **CORS**

---

## 📂 Estructura del Proyecto

El repositorio está dividido en dos partes principales:
* `/frontend`: Aplicación cliente desarrollada en Angular.
* `/backend`: API RESTful desarrollada en Node.js y Express.

---

## ⚙️ Guía de Instalación y Configuración Local

Sigue estos pasos para clonar y poner en marcha el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/rbran2026/RanBookProyectofinal.git](https://github.com/rbran2026/RanBookProyectofinal.git)
cd RanBookProyectofinal
2. Configurar la Base de Datos (MySQL)
Crea una base de datos en tu gestor MySQL e importa las tablas necesarias para soportar los siguientes módulos:

materiales

solicitudes

categorias

auditoria

usuarios

3. Configurar y Ejecutar el Backend
Entra a la carpeta del backend y asegúrate de tener las dependencias instaladas:

Bash
cd backend
npm install
Configura los datos de conexión a tu base de datos MySQL.

Inicia el servidor de desarrollo:

Bash
npm run dev
El servidor correrá por defecto en http://localhost:3000.

4. Configurar y Ejecutar el Frontend
Abre otra terminal, dirígete a la carpeta del frontend e instala las dependencias:

Bash
cd frontend
npm install
Inicia la aplicación de Angular:

Bash
ng serve
Abre tu navegador y entra a http://localhost:4200.

🔌 Endpoints de la API (Backend)
La API REST se comunica bajo el prefijo base http://localhost:3000/api:

Materiales

GET /api/materiales - Lista todos los materiales disponibles.

POST /api/materiales - Registra un nuevo material.

Solicitudes

GET /api/solicitudes - Lista las solicitudes de la comunidad.

POST /api/solicitudes - Crea una nueva solicitud.

Categorías

GET /api/categorias - Lista las categorías registradas.

POST /api/categorias - Añade una nueva categoría.

Auditoría

GET /api/auditoria - Consulta el historial de actividades del sistema.

👥 Autor
Armando Bran - Desarrollo Principal - rbran2026