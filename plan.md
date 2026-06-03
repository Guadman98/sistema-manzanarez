# Plan de Desarrollo Maestro: Portal Liceo Ecológico Manzanarez

## 1. Contexto y Directrices Globales
**Descripción:** Sistema integral de gestión académica, disciplinaria y administrativa para reemplazar la papelería física del colegio.
**Arquitectura de Repositorio:** El agente debe crear dos directorios separados en la raíz: `/backend` y `/frontend`.

**Stack Tecnológico Obligatorio:**
* **Backend:** NestJS (TypeScript), TypeORM, PostgreSQL. Patrón modular, DTOs estrictos con `class-validator` y documentación con Swagger.
* **Frontend:** Angular (Última versión estable, componentes Standalone), Tailwind CSS para estilos, interceptores para JWT.
* **Base de Datos:** PostgreSQL (Desplegado vía `docker-compose`).

---

## 2. Esquema de Base de Datos (TypeORM Entities)
El agente debe construir estas entidades exactamente con estas relaciones:

* **User:** `id`, `documento_identidad` (unique), `password_hash`, `nombre`, `apellidos`, `email`, `telefono`, `role` (Enum: ADMIN, TEACHER, STUDENT), `fecha_nacimiento`, `nombre_acudiente`, `telefono_acudiente`, `isActive` (boolean).
* **Grado:** `id`, `nombre` (Ej: '6to A').
* **Asignatura:** `id`, `nombre` (Ej: 'Matemáticas').
* **PlanEstudio:** Tabla puente. Relaciona `Grado` (ManyToOne) y `Asignatura` (ManyToOne).
* **Matricula:** Relaciona `User` (Rol STUDENT), `Grado` y `ano_lectivo` (int).
* **AsignacionDocente:** Relaciona `User` (Rol TEACHER) con `PlanEstudio`.
* **CalificacionPeriodo:** `id`, `id_estudiante`, `id_asignatura`, `periodo_academico` (int), `nota_original` (float), `nota_nivelacion` (float, nullable), `es_nota_final` (boolean), `fecha_registro`.
* **ObservacionDisciplinaria:** `id`, `id_estudiante`, `id_docente`, `fecha_incidente`, `categoria` (Enum: LEVE, GRAVE, CONVIVENCIA), `descripcion`, `estado`.
* **Certificado:** `id`, `id_estudiante`, `tipo` (ESTUDIO, NOTAS), `codigo_verificacion` (string, unique), `estado` (PENDIENTE, APROBADO), `fecha_solicitud`, `fecha_aprobacion`.

---

## 3. Plan de Ejecución Backend (NestJS)
**REGLA PARA EL AGENTE:** Debes implementar y probar cada módulo secuencialmente. No pases al siguiente módulo sin terminar el anterior.

* **Paso 1: Setup e Infraestructura.** Generar `docker-compose.yml` para Postgres. Configurar `@nestjs/config` y `@nestjs/typeorm` en `AppModule`.
* **Paso 2: AuthModule & UsersModule.** * Implementar autenticación JWT. Login usando `documento_identidad` y `password`.
    * Crear Decoradores y Guards: `@Roles(Role.ADMIN)`, `@Roles(Role.TEACHER)`.
    * CRUD de Usuarios.
* **Paso 3: AcademicModule.**
    * CRUD de Grados y Asignaturas.
    * Endpoints para matricular estudiantes (solo si el grado existe).
    * Endpoints para vincular materias a grados, y luego asignar docentes a esa vinculación.
* **Paso 4: GradesModule (Reglas Críticas).**
    * Rango de notas: 0.0 a 5.0. Mínimo aprobatorio: 3.0.
    * Lógica de Nivelación: Si la `nota_original` es <= 2.9, habilitar registro de `nota_nivelacion`. El endpoint de cálculo de promedios debe priorizar la `nota_nivelacion` si existe.
    * Configuración global de número de periodos y endpoint "Cerrar Periodo" (Admin) que impida modificaciones posteriores de notas.
* **Paso 5: DisciplineModule.**
    * Endpoint docente: Crear observación.
    * Endpoint Admin/Estudiante: Leer observaciones filtradas por categoría.
* **Paso 6: CertificatesModule.**
    * Endpoint estudiante: Solicitar certificado.
    * Endpoint admin: Aprobar y autogenerar `codigo_verificacion`.
    * **Endpoint Público:** GET `/certificates/verify/:codigo` (Sin JWT). Retorna validez y datos del alumno.

---

## 4. Plan de Ejecución Frontend (Angular)
**REGLA PARA EL AGENTE:** Usar arquitectura orientada a *features*. Separar lógica de estado en Servicios, vistas en Componentes Standalone e implementar Guards de enrutamiento basados en el rol del JWT.

* **Paso 1: Core & Shared.**
    * Configurar Tailwind CSS.
    * Crear `AuthService`, interceptor para inyectar JWT en headers HTTP, e interceptor para manejo global de errores (401, 403, 500).
* **Paso 2: Módulo Público / Auth.**
    * Ruta `/login`: Formulario (Documento y Contraseña).
    * Ruta `/verify-certificate`: Formulario público para ingresar código alfanumérico y ver respuesta del backend.
* **Paso 3: Portal Administrador (Guard: Admin).**
    * `/admin/dashboard`: Estadísticas rápidas.
    * `/admin/users`: Tabla para registrar/editar roles.
    * `/admin/academic`: Drag & drop o selectores anidados para: Crear Grados -> Añadir Asignaturas -> Asignar Profesor.
    * `/admin/certificates`: Tabla de solicitudes pendientes con botón "Aprobar".
* **Paso 4: Portal Docente (Guard: Teacher).**
    * `/teacher/classes`: Muestra solo las asignaturas/grados asignados al docente autenticado.
    * `/teacher/grades/:id_plan`: Vista de tabla de estudiantes matriculados para ingresar notas. Validar inputs (0.0 - 5.0).
    * `/teacher/discipline`: Formulario para registrar falta seleccionando estudiante y categoría.
* **Paso 5: Portal Estudiante (Guard: Student).**
    * `/student/grades`: Tabla de solo lectura con notas por periodo, definitiva y estado (Aprobado/Reprobado).
    * `/student/discipline`: Historial de faltas con semaforización de colores según gravedad.
    * `/student/certificates`: Botón para solicitar y botón para descargar/ver código de los aprobados.

---

## 5. Protocolo de Ejecución para el Agente (Obligatorio)
1.  **Iteración Cero:** Confirma que has leído este documento y genera la estructura de carpetas inicial. No escribas código de aplicación aún.
2.  **Verificación Constante:** Después de generar el código de un Módulo del Backend, debes actualizar los archivos para exportar las variables y servicios necesarios antes de continuar con el siguiente.
3.  **No Mocks Permanentes:** Genera las conexiones reales a TypeORM. Si necesitas datos iniciales, crea un archivo *seeder* para el Admin principal.
4.  **Tipado Estricto:** Prohibido el uso de `any` en TypeScript. Todas las peticiones HTTP en Angular deben tener una interfaz (`interface`) correspondiente que haga match con los DTOs de NestJS.