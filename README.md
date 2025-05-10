# CineReservas - Sistema de Reservas para Cine

![CineReservas Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&h=400&auto=format&fit=crop)

## 📝 Descripción

CineReservas es un sistema completo de gestión y reserva de entradas para cines que permite a los usuarios ver la cartelera, seleccionar películas, elegir asientos y gestionar sus reservas. El sistema está compuesto por un backend desarrollado en Spring Boot con Java y un frontend moderno creado con React, TypeScript y Material UI.

## ✨ Características Principales

- **Gestión de Películas**: Catálogo completo con información detallada
- **Cartelera Dinámica**: Visualización de funciones por día, sala y género
- **Selección de Asientos**: Sistema interactivo para elegir asientos
- **Reservas en Tiempo Real**: Proceso de reserva fácil e intuitivo
- **Panel de Administración**: Gestión de salas, butacas y funciones
- **Diseño Responsive**: Experiencia óptima en todos los dispositivos

## 🛠️ Tecnologías

### Backend
- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Security**
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**
- **Lombok**

### Frontend
- **React 19**
- **TypeScript**
- **Material UI 7**
- **React Router DOM 7**
- **Axios**
- **Date-fns**

## 📋 Requisitos Previos

Para ejecutar el proyecto necesitarás:

- JDK 17+
- Node.js 18+
- npm o yarn
- PostgreSQL 14+

## 🚀 Instalación y Configuración

### Base de Datos
1. Crea una base de datos PostgreSQL llamada `cinereservas`
2. El script inicial se encuentra en `backend/src/main/resources/db/init.sql`

### Backend
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Copia y modifica el archivo de propiedades (si es necesario):
   ```bash
   # El archivo está en src/main/resources/application.properties
   # Configura la conexión a la base de datos según tu entorno
   ```

3. Compila y ejecuta la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   En Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

### Frontend
1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   # o
   yarn start
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Uso del Sistema

### Flujo de Usuario
1. Explora la cartelera de películas
2. Selecciona una película para ver detalles
3. Elige una función (fecha y hora)
4. Selecciona asientos disponibles
5. Introduce tus datos personales
6. Confirma la reserva
7. Gestiona tus reservas desde la sección "Mis Reservas"

### Panel de Administración
1. Accede a las secciones de administración
2. Gestiona la cartelera de funciones
3. Administra salas y butacas
4. Visualiza y edita reservas

## 📂 Estructura del Proyecto

```
cinereservas/
├── backend/               # API REST con Spring Boot
│   ├── src/main/java/     # Código fuente Java
│   ├── src/main/resources/ # Recursos y configuraciones
│   └── pom.xml            # Dependencias Maven
│
└── frontend/              # Cliente web con React
    ├── public/            # Archivos estáticos
    ├── src/               # Código fuente React/TypeScript
    │   ├── components/    # Componentes React
    │   ├── context/       # Context API
    │   ├── services/      # Servicios para la API
    │   └── App.tsx        # Componente principal
    ├── package.json       # Dependencias NPM
    └── tsconfig.json      # Configuración TypeScript
```

## 🧪 Pruebas

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm test
# o
yarn test
```

## 🔧 Endpoints API

El backend expone los siguientes endpoints principales:

- **Películas**: `/api/movies`
- **Salas**: `/api/rooms`
- **Butacas**: `/api/seats`
- **Cartelera**: `/api/billboards`
- **Clientes**: `/api/customers`
- **Reservas**: `/api/bookings`

Para más detalles, consulta la documentación completa de la API en `http://localhost:8080/swagger-ui.html` cuando el backend esté en ejecución.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abre primero un issue para discutir lo que te gustaría cambiar.

## 📄 Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo [LICENSE](https://github.com/JC-DEV-EC/Sistema-para-cine/blob/main/LICENSE).  para más detalles.

## 📞 Contacto

Para cualquier consulta o sugerencia, puedes contactarme a través de:

- GitHub: [JC-DEV-EC](https://github.com/JC-DEV-EC)
- Email: [jassergerardoc@gmail.com]

---

Desarrollado con ❤️ por [JC-DEV-EC]
