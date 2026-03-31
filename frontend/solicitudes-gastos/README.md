# Solicitudes de Gastos - Frontend

Aplicación Angular para gestionar solicitudes de gastos. La solución cubre listado, filtros, detalle, creación, edición y acciones de aprobación o rechazo sobre solicitudes conectadas a una API REST.

## Resumen técnico

- Framework: Angular 21
- Enfoque: componentes standalone
- Formularios: Reactive Forms
- HTTP: `HttpClient` con interceptor funcional para API key
- Estado local y flujos async: RxJS
- Estilos: SCSS sin librerías UI externas

## Requisitos

- Node.js 18+
- npm 10+
- Backend levantado localmente
- Acceso al endpoint HTTPS local `https://localhost:5243/api`

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

## Ejecución

### Modo desarrollo

```bash
npm start
```

La aplicación queda disponible en:

- `http://localhost:4200`

Ruta principal:

- `http://localhost:4200/solicitudes`

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Configuración de ambiente

La configuración actual está en [src/environments/environment.ts](src/environments/environment.ts).

Valores actuales:

- `apiUrl`: `https://localhost:5243/api`
- `apiKey`: `123456`

La API key se agrega a cada request mediante [src/app/core/api-key-interceptor.ts](src/app/core/api-key-interceptor.ts).

## Endpoints esperados

El frontend espera una API con estas rutas base sobre `apiUrl`:

- `GET /SolicitudesGastos`
- `GET /SolicitudesGastos/{id}`
- `POST /SolicitudesGastos`
- `PUT /SolicitudesGastos/{id}`
- `POST /SolicitudesGastos/{id}/aprobar`
- `POST /SolicitudesGastos/{id}/rechazar`

Se asume que las respuestas están envueltas en una estructura tipo `ApiResponse<T>` con al menos:

- `success`
- `data`
- `message` opcional

## Instrucciones de uso

### Listado

- Entrar a `http://localhost:4200/solicitudes`.
- La pantalla carga solicitudes automáticamente al entrar.
- Los filtros se aplican en cliente por texto, estado, categoría y rango de fechas.
- La paginación también se resuelve en cliente sobre la colección cargada.

### Crear solicitud

- Ir a `solicitudes/nuevo`.
- Completar categoría, usuario, descripción, valor y fecha del gasto.
- Guardar redirige nuevamente al listado.

### Ver detalle

- Desde la tabla, usar la acción `Ver`.
- El detalle intenta mostrar información inmediata desde el estado de navegación y luego refresca desde backend.
- Si la solicitud está pendiente, desde esa vista se puede editar, aprobar o rechazar.

## Supuestos

- El backend local expone HTTPS en `https://localhost:5243`.
- El certificado local puede requerir confianza explícita en el navegador o en el sistema operativo.
- El modelo del backend para `valor` y `fechaGasto` puede venir envuelto y por eso el frontend normaliza esos campos en el servicio.
- El estado puede llegar como valor numérico y se traduce a `Pendiente`, `Aprobada` o `Rechazada`.
- El tamaño actual del dataset permite filtrar, ordenar y paginar del lado cliente sin degradación fuerte.

## Decisiones técnicas

### Arquitectura Angular

- Se usó Angular standalone para reducir fricción de módulos y simplificar composición de pantallas.
- La configuración principal está en [src/app/app.config.ts](src/app/app.config.ts).
- El router principal y el feature routing separan navegación global de navegación funcional de solicitudes.

### Integración HTTP

- La integración con backend está centralizada en [src/app/features/solicitudes/services/solicitudes.service.ts](src/app/features/solicitudes/services/solicitudes.service.ts).
- El servicio encapsula normalización de payloads para evitar propagar detalles del backend a la UI.
- Se añadió `timeout` a las operaciones HTTP del servicio para evitar pantallas colgadas por requests pendientes indefinidamente.

### Estado y experiencia de usuario

- Cada pantalla maneja estados de carga locales para no bloquear toda la app.
- En listado y detalle se usa actualización optimista donde tiene sentido, especialmente en aprobar y rechazar.
- El detalle separa carga inicial de refresco en segundo plano para no ocultar datos ya disponibles.
- Los componentes compartidos de alertas, confirmación y loading están montados desde [src/app/app.ts](src/app/app.ts).

### Formularios

- Se usa `ReactiveFormsModule` por control explícito sobre validaciones, estados y reseteos.
- El formulario de crear/editar marca campos como tocados antes de guardar y bloquea edición si la solicitud ya no está pendiente.

### Testing

- Se agregaron pruebas unitarias para el componente de listado y para el servicio HTTP de solicitudes.
- Las pruebas del componente mockean `SolicitudesService`, `AlertService`, `ConfirmService` y `Router`.
- Las pruebas del servicio usan `HttpClientTestingModule` y `HttpTestingController`.

## Estructura relevante

- [src/app/features/solicitudes/pages/list/list.component.ts](src/app/features/solicitudes/pages/list/list.component.ts)
- [src/app/features/solicitudes/pages/list/list.component.spec.ts](src/app/features/solicitudes/pages/list/list.component.spec.ts)
- [src/app/features/solicitudes/pages/form/form.component.ts](src/app/features/solicitudes/pages/form/form.component.ts)
- [src/app/features/solicitudes/pages/detail/detail.component.ts](src/app/features/solicitudes/pages/detail/detail.component.ts)
- [src/app/features/solicitudes/services/solicitudes.service.ts](src/app/features/solicitudes/services/solicitudes.service.ts)
- [src/app/features/solicitudes/services/solicitudes.service.spec.ts](src/app/features/solicitudes/services/solicitudes.service.spec.ts)
- [src/app/core/api-key-interceptor.ts](src/app/core/api-key-interceptor.ts)
- [src/environments/environment.ts](src/environments/environment.ts)

## Prueba manual sugerida

1. Levantar backend y frontend.
2. Abrir `http://localhost:4200/solicitudes`.
3. Verificar carga inicial del listado.
4. Aplicar filtros y revisar paginación.
5. Crear una solicitud nueva.
6. Entrar al detalle con `Ver`.
7. Aprobar o rechazar una solicitud pendiente y confirmar actualización inmediata.
8. Probar edición de una solicitud pendiente.

## Riesgos y notas

- La `apiKey` está hardcodeada para entorno local. Eso no debe mantenerse en producción.
- Si el backend no responde dentro del timeout definido, la UI mostrará error y abortará la espera.
- Si el volumen de datos crece, conviene mover filtros, ordenamiento y paginación al backend.
- Aunque existe `LoadingService`, varias pantallas usan indicadores locales más finos para mejorar UX por vista.

