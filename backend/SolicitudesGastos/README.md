Here's the improved `README.md` file, incorporating the new content while maintaining the existing structure and information:

# Solicitudes de Gastos API

## Descripción
API REST construida con ASP.NET Core y .NET 8 para gestionar solicitudes de gastos. Esta API permite a los usuarios crear, modificar, aprobar y rechazar solicitudes de gastos de manera eficiente y segura.

## Tecnologías
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core 8
- SQL Server
- Swagger / OpenAPI
- xUnit + Moq

## Estructura del proyecto
- `SolicitudesGastos.API`: capa de presentación y configuración
- `SolicitudesGastos.Application`: casos de uso, DTOs, interfaces y servicios
- `SolicitudesGastos.Domain`: entidades, enums y value objects
- `SolicitudesGastos.Infrastructure`: persistencia, DbContext, repositorios y migraciones
- `SolicitudesGastos.Tests`: pruebas unitarias

## Requisitos previos
- SDK de .NET 8
- SQL Server disponible localmente
- Visual Studio 2022 o CLI de `dotnet`

## Configuración
La cadena de conexión y la API Key están en `SolicitudesGastos.API/appsettings.json`.

Ejemplo actual:
- Base de datos: `SolicitudesGastosDb`
- API Key: `123456`
- URL HTTP: `http://localhost:5242`
- URL HTTPS: `https://localhost:5243`

## Ejecución del proyecto
1. Restaurar dependencias:
   dotnet restore
2. Aplicar migraciones:
   dotnet ef database update --project .\SolicitudesGastos.Infrastructure --startup-project .\SolicitudesGastos.API
3. Ejecutar la API:
   dotnet run --project .\SolicitudesGastos.API
4. Abrir Swagger:
- `https://localhost:5243/swagger`
5. Autorizar la API Key en Swagger con el header `x-api-key` y el valor `123456`.

## Migraciones y base de datos
La solución ya incluye una migración inicial en `SolicitudesGastos.Infrastructure/Migrations`.

### Aplicar migraciones existentes
dotnet ef database update --project .\SolicitudesGastos.Infrastructure --startup-project .\SolicitudesGastos.API

### Crear una nueva migración
dotnet ef migrations add NombreMigracion --project .\SolicitudesGastos.Infrastructure --startup-project .\SolicitudesGastos.API

### Script SQL de migración
dotnet ef migrations script --project .\SolicitudesGastos.Infrastructure --startup-project .\SolicitudesGastos.API -o .\script-migraciones.sql

## Pruebas unitarias
Ejecutar todas las pruebas:
dotnet test

Ejecutar solo el proyecto de pruebas:
dotnet test .\SolicitudesGastos.Tests\SolicitudesGastos.Tests.csproj

## Supuestos
- La autenticación del reto se resuelve con una API Key simple enviada en el header `x-api-key`.
- El frontend permitido corre en `http://localhost:4200`.
- El estado inicial de una solicitud siempre es `Pendiente`.
- Solo una solicitud en estado `Pendiente` puede aprobarse, rechazarse o editarse.
- La base de datos SQL Server está disponible en `localhost`.

## Decisiones técnicas
- Se usa arquitectura por capas (`API`, `Application`, `Domain`, `Infrastructure`) para separar responsabilidades.
- Se usan value objects (`ValorGasto`, `FechaGasto`) para encapsular reglas de negocio simples.
- Se usa Entity Framework Core con SQL Server por simplicidad y rapidez de implementación.
- Se documenta la API con Swagger para facilitar pruebas manuales.
- Se usan pruebas unitarias con xUnit y Moq para validar la lógica del servicio sin depender de base de datos.
- Se incluyó `DesignTimeDbContextFactory` para soportar correctamente las migraciones en tiempo de diseño.

## Endpoints principales
- `GET /api/SolicitudesGastos`: Obtiene la lista de todas las solicitudes de gastos.
- `GET /api/SolicitudesGastos/{id}`: Obtiene los detalles de una solicitud de gasto específica.
- `POST /api/SolicitudesGastos`: Crea una nueva solicitud de gasto.
- `PUT /api/SolicitudesGastos/{id}`: Actualiza una solicitud de gasto existente.
- `POST /api/SolicitudesGastos/{id}/aprobar`: Aprueba una solicitud de gasto.
- `POST /api/SolicitudesGastos/{id}/rechazar`: Rechaza una solicitud de gasto.
- `GET /ping`: Verifica el estado de la API.

## Notas
Si Swagger responde `401`, primero debes autorizar la API Key en la interfaz o enviar el header `x-api-key` manualmente.

This version maintains the original structure while enhancing clarity and coherence, particularly in the descriptions and explanations of the API's functionality and usage.