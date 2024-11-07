Proyecto API para Gestión de Usuarios, Shows y Fotos
Este proyecto es una API RESTful desarrollada en Node.js y Express.js, que permite gestionar Usuarios, Shows y Fotos en una base de datos MongoDB. Las entidades se relacionan entre sí para crear una experiencia completa de registro y asignación de usuarios a shows, además de capturar y almacenar fotos asociadas a shows y usuarios específicos.

Tabla de Contenidos
Características
Requisitos Previos
Instalación
Configuración
Ejecución
Rutas de la API
Usuarios
Shows
Fotos
Estructura del Proyecto
Consideraciones Adicionales
Contribuciones

Características
Gestión de Usuarios: Crea, actualiza y elimina usuarios, asignándolos a shows según su disponibilidad y capacidad.
Gestión de Shows: Crea shows, visualiza shows por orden cronológico y asigna usuarios a estos según la capacidad.
Gestión de Fotos: Captura fotos asociadas a un show y a los usuarios que participaron, con las funciones CRUD completas.
Base de Datos Relacional: Cada usuario y foto están relacionados con shows específicos.
Estructura Modular: El proyecto está estructurado en módulos para facilitar su escalabilidad y mantenimiento.

Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:

Node.js (versión 12 o superior)
MongoDB (instalación local o acceso a una base de datos remota)
Git para clonar el repositorio
Instalación
Clona el repositorio e instala las dependencias:

git clone <URL_DEL_REPOSITORIO>
cd <nombre_del_directorio>
npm install

Configuración
Configura las variables de entorno para conectar con la base de datos MongoDB. Crea un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/miBaseDeDatos

Ejecución
Para ejecutar el servidor de desarrollo:

bash

npm start
La API estará disponible en http://localhost:5000.

Rutas de la API
Usuarios
Crear Usuario: POST /api/users
Obtener Usuarios en Espera: GET /api/users/waiting
Obtener Todos los Usuarios: GET /api/users
Obtener Usuario por ID: GET /api/users/:id
Actualizar Estado del Usuario: PATCH /api/users/:id/status
Asignar Usuario a Show: PATCH /api/users/:id/show
Eliminar Usuario: DELETE /api/users/:id

Shows
Crear Show: POST /api/shows
Obtener Todos los Shows: GET /api/shows
Obtener Show por ID: GET /api/shows/:id
Actualizar Usuarios de un Show: PATCH /api/shows/:id
Eliminar Show: DELETE /api/shows/:id
Fotos

Crear Foto: POST /api/photos
Obtener Todas las Fotos: GET /api/photos
Obtener Foto por ID: GET /api/photos/:id
Actualizar Foto: PATCH /api/photos/:id
Eliminar Foto: DELETE /api/photos/:id

Estructura del Proyecto
plaintext

├── config
│ └── db.js # Conexión a MongoDB
├── controllers
│ ├── userController.js # Controlador de Usuarios
│ ├── showController.js # Controlador de Shows
│ └── photoController.js # Controlador de Fotos
├── models
│ ├── User.js # Modelo de Usuario
│ ├── Show.js # Modelo de Show
│ └── Photo.js # Modelo de Foto
├── routes
│ ├── userRoutes.js # Rutas de Usuarios
│ ├── showRoutes.js # Rutas de Shows
│ └── photoRoutes.js # Rutas de Fotos
├── .env # Variables de entorno
├── .gitignore
├── package.json
└── server.js # Configuración del servidor principal

Consideraciones Adicionales
Middleware: El proyecto incluye middleware de manejo de errores y verificación de rutas no existentes.
Populate en Mongoose: Se utilizan métodos de populate en Mongoose para incluir automáticamente la información de shows y usuarios asociados en las consultas de fotos y viceversa.

Lógica de Negocio: El sistema permite que cada show tenga un límite de 4 usuarios y que cada foto esté asociada a un show y a usuarios específicos.

Contribuciones
Este proyecto está abierto a contribuciones. Para contribuir:

Crea una rama (git checkout -b feature-nueva)
Realiza tus cambios y haz commits (git commit -m 'Agrega nueva funcionalidad')
Sube tu rama (git push origin feature-nueva)
Abre un Pull Request
