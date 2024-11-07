Interfaz de Usuario para Gestión de Shows, Usuarios y Fotos
Esta interfaz de usuario (UI) es una colección de páginas diseñadas para interactuar con el sistema de backend de un servidor Node.js para gestionar usuarios, shows y capturar fotos. Las páginas incluidas son:

createUser.html: Crear un nuevo usuario con atributos específicos.
createShow.html: Crear un nuevo show indicando fecha, hora y duración.
capturePhoto.html: Capturar una foto de un show específico con usuarios asignados.
assignUserToShow.html: Asignar un usuario en espera a un show existente.
Cada página está diseñada usando Tailwind CSS para una interfaz clara y responsive.

Archivos HTML
Cada página HTML contiene un formulario diseñado para realizar una operación específica:

createUser.html: Formulario para crear un nuevo usuario, con opciones de selección para energy, element, y essence.
createShow.html: Formulario para crear un nuevo show indicando la fecha, hora y duración.
capturePhoto.html: Interfaz para seleccionar un show existente con usuarios asignados y capturar una foto (simulada) de ese show.
assignUserToShow.html: Selección de un usuario en espera y asignación a un show existente.
Cada archivo HTML tiene un archivo de JavaScript asociado en public/js que gestiona la lógica de interacción con el backend.

Requisitos Previos
Node.js y NPM: Asegúrate de tener Node.js instalado en tu sistema.
Tailwind CSS: Está integrado a través de un archivo CSS común (styles.css).
Servidor Node.js con API REST: Configura el backend en localhost:5000 (o ajusta según tus necesidades).
Configuración y Uso
Instalar Dependencias del Servidor

bash
Copiar código
npm install
Iniciar el Servidor El servidor debe configurarse para servir el directorio public para que los archivos estáticos (HTML, CSS y JS) puedan ser accesibles. Agrega esta línea en el archivo server.js:

javascript
Copiar código
app.use(express.static('public'));
Abrir las Interfaces de Usuario

Asegúrate de que el servidor esté corriendo en http://localhost:5000.

Accede a cada interfaz de usuario visitando las siguientes URL en tu navegador:

Crear Usuario: http://localhost:5000/create-user
Crear Show: http://localhost:5000/create-show

Asignar Usuario a Show: http://localhost:5000/assign-user-to-show
SHOW PLAYBACK http://localhost:5000/show-playback

Capturar Foto: http://localhost:5000/capture-photo


Descripción de cada página
Crear Usuario (createUser.html)

Permite ingresar los detalles de un nuevo usuario, como nombre, email, energía, elemento, y esencia.
Envía una solicitud POST al endpoint /api/users.
Crear Show (createShow.html)

Permite definir un nuevo show con una fecha, hora de inicio y duración en minutos.
Envía una solicitud POST al endpoint /api/shows.
Capturar Foto (capturePhoto.html)

Selecciona un show que ya tenga usuarios asignados.
Captura una foto (simulada) y envía los datos a /api/photos para enlazar el show con los usuarios.
Asignar Usuario a Show (assignUserToShow.html)

Muestra usuarios en espera y shows existentes.
Permite seleccionar un usuario y asignarlo a un show.
Envía solicitudes GET y PATCH a los endpoints /api/users y /api/shows.
Detalles de Integración
Cada página utiliza JavaScript para manejar la validación de datos, la lógica de selección y la interacción con el backend mediante fetch. Las solicitudes AJAX enviadas a los endpoints REST del servidor gestionan las operaciones CRUD necesarias.

Notas
CORS: Asegúrate de que CORS esté configurado en el backend si planeas acceder a esta UI desde un origen diferente.
Estilos: Puedes modificar styles.css en la carpeta public/css para personalizar los estilos.
Ejemplo de Uso
Crear un Usuario: Abre http://localhost:5000/createUser.html, completa el formulario y haz clic en "Crear Usuario".
Crear un Show: Abre http://localhost:5000/createShow.html, elige la fecha, hora y duración, y haz clic en "Crear Show".
Asignar Usuario a Show: Ve a http://localhost:5000/assignUserToShow.html, selecciona un usuario en espera y un show, y realiza la asignación.
Capturar Foto: Ve a http://localhost:5000/capturePhoto.html, elige el show con usuarios asignados, y captura la foto.
Contacto y Soporte
Para más detalles o asistencia, por favor contacta al equipo de desarrollo o revisa la documentación del backend para los endpoints disponibles y la estructura de datos.

Este README proporciona una guía completa para acceder y usar la interfaz de usuario del sistema, incluyendo los pasos necesarios para iniciar el servidor y acceder a cada una de las funcionalidades en el navegador.
