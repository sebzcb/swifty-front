# Swifty

Swifty se está desarrollando como respuesta a los desafíos de aprobar una asignaturas que enfrentan en ocasiones los estudiantes de educación superior, siendo esta una plataforma web que conectará a los estudiantes para que ellos mismos puedan ayudar a sus compañeros.

## Integrantes

- Sebastián Cahuana
- Gadi Rebolledo

## Requerimientos funcionales

- Registro de usuario
- Inicio sesión
- Verificación de roles
- Filtro y ordenamiento de resultados
- Chat
- Gestión cuenta de usuario
- Gestión de horarios disponibles
- Reporte a usuarios
- Gestión de grupos de estudio
- Gestión de tutorías
- Búsqueda por palabra clave
- Solicitar tutoría
- Notificaciones
- Calificación y comentarios en tutores
- Gestión de panel de administración

## Requerimientos No funcionales

- **RNF-01**: El sistema debe enviar el correo electrónico de restablecimiento de contraseña en menos de 5 segundos.
- **RNF-02**: El sistema debe usar una base de datos relacional PostgreSQL para almacenar los datos del sistema.
- **RNF-03**: Las contraseñas de los usuarios deben almacenarse encriptadas en la base de datos PostgreSQL.
- **RNF-04**: El sistema debe implementar la siguiente paleta de colores:
  - Color Primario: `#4073cb`
  - Color Secundario: `#9DF3C4`
- **RNF-05**: El sistema debe implementar alertas (Snacks) que en caso de éxito tenga un color de fondo: `#2ecc71` y en caso de error el color de fondo sea: `#c40f3c`.
- **RNF-06**: El sistema debe implementar un diseño responsivo que asegure una experiencia de usuario óptima en dispositivos móviles y de escritorio.
- **RNF-07**: El sistema debe tener entornos separados para desarrollo y producción, cada uno con su propio repositorio de código (frontend y backend).

## Pasos para ejecutar el proyecto

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/sebzcb/swifty-front
    ```

2. Acceder al proyecto:
    ```bash
    cd swifty-front
    ```

3. Instalar las dependencias:
    ```bash
    npm install
    ```

4. Ejecutar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

5. Si se quiere construir el proyecto para producción:
    ```bash
    npm run build
    ```

## Al eliminar usuario

Puede ocurrir que el usuario eliminado no pueda ver Swifty. En ese caso, sigue estos pasos:

1. Abre las herramientas de desarrollador (F12).
2. Ve a la pestaña "Aplicación".
3. En la sección "Cookies", selecciona `http://localhost:5173`.
4. Selecciona el objeto que dice "session".
5. Haz clic en la "X" de arriba para eliminar la sesión.
6. Recarga la página.

## Plugins oficiales disponibles

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh