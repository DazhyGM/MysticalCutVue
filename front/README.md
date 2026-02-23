# 💈 MysticalCut - Sistema de Gestión para Barbería

![Vue](https://img.shields.io/badge/Vue-3-42b883)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Swagger](https://img.shields.io/badge/API-Documented-success)
![QA](https://img.shields.io/badge/Testing-Selenium%20%7C%20Cucumber%20%7C%20Serenity-purple)

Aplicación web **Full Stack** desarrollada para la gestión de usuarios, empleados y clientes en una barbería.

El sistema permite administrar usuarios, roles y operaciones internas mediante una arquitectura basada en API REST.

---

## 🎯 Características Técnicas Clave

- Arquitectura cliente-servidor desacoplada
- API REST documentada con Swagger
- Autenticación basada en JWT
- Middleware de protección de rutas
- CRUD completo con control de roles
- Diseño responsive
- Trazabilidad entre Casos de Uso → Casos de Prueba → Automatización
- Automatización bajo enfoque BDD

---

# 🧠 Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

mysticalcut/
│
├── front/ # Aplicación Vue.js
└── back/ # API REST con Node.js y Express

---

El frontend consume los servicios del backend mediante peticiones HTTP usando Axios.

---

# 🚀 Tecnologías Utilizadas

## 🔹 Frontend
- Vue 3 (Composition API)
- Vue Router
- Axios
- Bootstrap 5
- CSS modular (global + scoped)

## 🔹 Backend
- Node.js
- Express
- MySQL
- JWT
- Swagger

## 🔹 QA y Automatización
- Selenium WebDriver
- Cucumber (BDD)
- Serenity BDD
- Gradle

---

# ⚙️ Requisitos Previos

Para ejecutar el proyecto en una máquina nueva se requiere:

- Node.js (v16 o superior recomendado)
- npm
- MySQL
- Visual Studio Code (recomendado)
- Extensión Vue (Volar)

Verificar instalación de Node:

node -v
npm -v

---

## ⚙️ Instalación

### 1️⃣ Clonar el repositorio

git clone https://github.com/DazhyGM/MysticalCutVue.git
cd MysticalCutVue

# ▶️ Ejecutar Backend

Abrir una terminal en VSC y ejecutar:
cd back
npm install
npm run dev

El servidor se ejecutará en:
http://localhost:5000

---
## 📄 Documentación de la API (Swagger)

La documentación interactiva de la API está disponible en:

http://localhost:5000/api-docs


Desde allí se pueden probar todos los endpoints disponibles del sistema.

---

# ▶️ Ejecutar Frontend

Abrir una nueva terminal (sin cerrar la del backend):

cd front
npm install
npm run serve

La aplicación estará disponible en:

http://localhost:8080

---

# 🗂️ Estructura del Proyecto

## 📁 Frontend

front/src/
│
├── assets/
├── components/
├── views/
├── router/
├── services/
└── App.vue


## 📁 Backend

back/
│
├── controllers/
├── routes/
├── middleware/
├── models/
├── config/
└── server.js


---

# 🏗️ Base de Datos

El proyecto utiliza MySQL.

Es necesario:

1. Importar la base de datos ubicada en la carpeta back/db
2. Crear nu archivo `.env` en la carpeta `back` y configurar las credenciales.

Ejemplo:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mysticalcut-db
JWT_SECRET=tu_clave_secreta

---

# 🔐 Funcionalidades Implementadas

- Autenticación con JWT
- Protección de rutas
- CRUD completo de usuarios
- Gestión de roles (Administrador, Empleado, Cliente)
- Activación / desactivación de usuarios
- Gestion de servicios
- Consumo estructurado de API REST
- Diseño responsive
- Componentes reutilizables

---

# 🧪 Aseguramiento de Calidad (QA)

El proyecto incluye un proceso formal de validación y pruebas dividido en:

## 🔍 Pruebas Manuales

- Plan de pruebas general
- Casos de prueba por módulo (Usuarios y Servicios)
- Estimación de QA
- Evidencia de ejecución de pruebas
- Revisión de casos de uso

Documentación disponible en:

/documentacion/Trimestre_5/Pruebas de calidad

---

## 🤖 Pruebas Automatizadas

Se implementó automatización de pruebas utilizando:

- Selenium WebDriver
- Cucumber (BDD)
- Serenity BDD
- Gradle

Las pruebas automatizadas validan:

- Flujo de autenticación
- Gestión de usuarios
- Módulo de servicios

Estructura del módulo de automatización:

Automatizaciones/MysticalCut

---

## 🎯 Enfoque de Calidad

El proyecto fue desarrollado bajo un enfoque estructurado que incluye:

- Análisis
- Diseño
- Implementación
- Pruebas manuales
- Pruebas automatizadas
- Documentación formal

Esto garantiza trazabilidad entre:

Casos de uso → Casos de prueba → Automatización

---

## 🔄 Flujo General

1. Usuario inicia sesión.
2. Backend valida credenciales y genera JWT.
3. Frontend almacena token y protege rutas.
4. Usuario interactúa con módulos (Usuarios / Servicios).
5. Backend procesa la lógica y responde vía API REST.

---

## 📚 Documentación del Proyecto
El sistema cuenta con documentación estructurada que incluye:

- Casos de uso
- Historias de usuario
- Diagramas UML (Clases, Despliegue, MER)
- Mockups
- Manuales técnicos
- Base de datos
- Plan de pruebas
- Automatización

---

# 👨‍💻 Autor

Kevin David Sabogal  
Desarrollador Full Stack con enfoque en calidad

📧 kevinsabogal24@gmail.com  
🔗 LinkedIn: (https://www.linkedin.com/in/kevin-david-sabogal-mancipe/)

---

# ⭐ Objetivo del Proyecto

Este proyecto fue desarrollado con fines académicos y de portafolio, con el objetivo de fortalecer habilidades en:

- Desarrollo Full Stack
- Arquitectura cliente-servidor
- Diseño de APIs REST
- Autenticación y autorización con JWT
- Aseguramiento de calidad
- Automatizacion de pruebas
- Organización modular de código
- Buenas prácticas de desarrollo
- Documentacion técnica estructurada
