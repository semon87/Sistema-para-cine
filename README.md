# 🎬 Sistema para Cine

![Sistema para Cine](https://img.shields.io/badge/Sistema_para_Cine-v1.0-blue)

CineReservas es un sistema completo de gestión y reserva de entradas para cines. Permite a los usuarios ver la cartelera, seleccionar películas, elegir asientos y gestionar sus reservas. Este sistema está compuesto por un backend desarrollado en Spring Boot con Java y un frontend moderno creado con React, TypeScript y Material UI.

## 📚 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Enlaces](#-enlaces)

## ⭐ Características

- **Visualización de Cartelera**: Los usuarios pueden ver todas las películas disponibles en el cine.
- **Selección de Películas**: Permite a los usuarios seleccionar una película específica para obtener más detalles.
- **Elección de Asientos**: Los usuarios pueden elegir sus asientos preferidos antes de realizar la reserva.
- **Gestión de Reservas**: Los usuarios pueden gestionar sus reservas, incluyendo la posibilidad de cancelar o modificar.
- **Interfaz Intuitiva**: La interfaz es fácil de usar, diseñada para una experiencia fluida.

## ⚙️ Tecnologías Utilizadas

Este proyecto utiliza varias tecnologías modernas para ofrecer una experiencia robusta y eficiente:

- **Backend**: 
  - Spring Boot
  - Java 17
  - Spring Data JPA
  - Spring Security
  - Lombok
  - PostgreSQL

- **Frontend**:
  - React 19
  - TypeScript
  - Material UI
  - React Router DOM 7
  - Axios
  - date-fns

## 🛠️ Instalación

Para instalar y ejecutar el sistema, sigue estos pasos:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/semon87/Sistema-para-cine.git
   ```

2. **Navega a la carpeta del proyecto**:
   ```bash
   cd Sistema-para-cine
   ```

3. **Configura el backend**:
   - Asegúrate de tener Java 17 y Maven instalados.
   - Configura la base de datos PostgreSQL y actualiza el archivo `application.properties` con tus credenciales.

4. **Ejecuta el backend**:
   ```bash
   mvn spring-boot:run
   ```

5. **Configura el frontend**:
   - Navega a la carpeta del frontend.
   ```bash
   cd frontend
   ```

6. **Instala las dependencias**:
   ```bash
   npm install
   ```

7. **Ejecuta el frontend**:
   ```bash
   npm start
   ```

## 🖥️ Uso

Una vez que el sistema esté en funcionamiento, puedes acceder a la aplicación en tu navegador en `http://localhost:3000`. Desde allí, podrás explorar la cartelera, seleccionar películas y realizar reservas.

### Ejemplo de Flujo de Usuario

1. **Visitar la Cartelera**: Al abrir la aplicación, verás la lista de películas en cartelera.
2. **Seleccionar una Película**: Haz clic en una película para ver más detalles.
3. **Elegir Asientos**: Selecciona tus asientos preferidos en la interfaz.
4. **Realizar Reserva**: Completa el proceso de reserva ingresando tus datos.

## 🤝 Contribución

Las contribuciones son bienvenidas. Si deseas contribuir al proyecto, sigue estos pasos:

1. **Fork el repositorio**.
2. **Crea una nueva rama**:
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```

3. **Realiza tus cambios y haz commit**:
   ```bash
   git commit -m "Añadir nueva característica"
   ```

4. **Envía tus cambios**:
   ```bash
   git push origin feature/nueva-caracteristica
   ```

5. **Crea un Pull Request**.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo `LICENSE`.

## 🔗 Enlaces

Para descargar la última versión del sistema, visita la sección de [Releases](https://github.com/semon87/Sistema-para-cine/releases). Aquí encontrarás los archivos necesarios para ejecutar el sistema.

Si tienes preguntas o necesitas más información, revisa la sección de [Releases](https://github.com/semon87/Sistema-para-cine/releases) para obtener actualizaciones y versiones anteriores.

---

¡Gracias por tu interés en Sistema para Cine! Esperamos que disfrutes usando esta aplicación y que facilite tu experiencia en el cine.