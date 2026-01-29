# Prueba Tecnica Carsales

Este repositorio contiene la solución a la prueba técnica para el cargo de Ingeniero de Software. La aplicación implementa un patrón BFF (Backend for Frontend) para consumir la API de Rick and Morty, procesar los datos y presentarlos en una interfaz web moderna.

## Estructura del Proyecto

El proyecto está dividido en dos componentes principales:

- **backend**: Web API desarrollada en .NET 8.
- **frontend**: SPA desarrollada en Angular 17+.

---

### Tecnologías y Arquitectura
- **Framework**: .NET 8 (ASP.NET Core Web API).
- **Arquitectura**: Clean Architecture (Separación en capas: API, Application, Core, Infrastructure).
- **Patrones**: Repository/Service pattern, Dependency Injection.
- **Middleware**: Manejo global de excepciones para respuestas de error estandarizadas.
- **Configuración**: URLs externas configurables vía appsettings.json.

### Funcionalidades
- Consumo de API externa (Rick and Morty).
- Paginación recursiva para obtención completa de datos.
- Transformación de datos (Data shaping) antes de enviarlos al cliente.
- Documentación de API mediante Swagger.

### Ejecución
1. Navegar a la carpeta backend.
2. Ejecutar `dotnet build` para restaurar dependencias.
3. Ejecutar `dotnet run` para iniciar el servidor (Puerto por defecto: 5199).
4. Swagger disponible en: http://localhost:5199/swagger

---

## Frontend (Angular)

Interfaz de usuario moderna enfocada en el rendimiento y la experiencia de usuario, sin dependencia de librerías de componentes UI externas.

### Tecnologías
- **Framework**: Angular 17+.
- **Estado**: Uso de Signals y Computed Properties para gestión de estado reactivo.
- **Componentes**: Arquitectura basada en Standalone Components.
- **Estilos**: SCSS puro, implementación de CSS Grid y Flexbox (Sin Bootstrap/Tailwind).

### Funcionalidades
- **Navegación**: Enrutamiento para diferentes vistas de contenido.
- **Persistencia**: Almacenamiento local (LocalStorage) para marcar episodios como "Vistos".
- **Interacción**: Buscador en tiempo real y paginación local.
- **Diseño**: Interfaz responsiva y modo oscuro.

### Ejecución
1. Navegar a la carpeta frontend.
2. Ejecutar `npm install` para instalar dependencias.
3. Ejecutar `npx @angular/cli serve` para iniciar el servidor de desarrollo.
4. Acceder mediante el navegador a: http://localhost:4200
