Documentación de Rutas de Usuario (User API)
Esta documentación detalla las rutas disponibles para el recurso User en la API, así como sus interacciones con los recursos Show y Photo.

Rutas de Usuario

1. Crear un Nuevo Usuario
   Método: POST
   URL: /api/users
   Descripción: Crea un nuevo usuario con los datos especificados.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "name": "Nombre del Usuario",
   "email": "usuario@example.com",
   "energy": "lunar | solar",
   "element": "agua | fuego | tierra | aire",
   "essence": "Essence Description"
   }
   Respuesta Exitosa:
   Código: 201 Created
   Cuerpo: El objeto JSON del usuario recién creado.
   Errores:
   400 Bad Request: Error en los datos enviados.

2. Obtener Todos los Usuarios en Estado "En Espera"
   Método: GET
   URL: /api/users/waiting
   Descripción: Obtiene todos los usuarios cuyo estado es "en espera".
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Una lista de objetos JSON de usuarios en estado "en espera".
   Errores:
   500 Internal Server Error: Error en el servidor.

3. Obtener Todos los Usuarios
   Método: GET
   URL: /api/users
   Descripción: Obtiene todos los usuarios registrados en la base de datos.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Una lista de objetos JSON de usuarios.
   Errores:
   500 Internal Server Error: Error en el servidor.

4. Obtener un Usuario por ID
   Método: GET
   URL: /api/users/:id
   Descripción: Obtiene los detalles de un usuario específico mediante su ID.
   Parámetros de URL:
   id: ID del usuario.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON del usuario, incluyendo detalles del show asignado (si existe).
   Errores:
   404 Not Found: Usuario no encontrado.
   500 Internal Server Error: Error en el servidor.

5. Actualizar el Estado de un Usuario
   Método: PATCH
   URL: /api/users/:id/status
   Descripción: Actualiza el estado de un usuario especificado.
   Parámetros de URL:
   id: ID del usuario.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "status": "nuevo estado"
   }
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON del usuario actualizado.
   Errores:
   404 Not Found: Usuario no encontrado.
   400 Bad Request: Error en los datos enviados.

6. Eliminar un Usuario
   Método: DELETE
   URL: /api/users/:id
   Descripción: Elimina un usuario específico mediante su ID.
   Parámetros de URL:
   id: ID del usuario.
   Respuesta Exitosa:
   Código: 204 No Content
   Errores:
   404 Not Found: Usuario no encontrado.
   500 Internal Server Error: Error en el servidor.
7. Asignar un Usuario a un Show
   Método: PATCH
   URL: /api/users/:id/show
   Descripción: Asigna un usuario a un show especificado, verificando si el show tiene capacidad (máximo 4 usuarios).
   Parámetros de URL:
   id: ID del usuario.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "showId": "ID del Show"
   }
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Mensaje de éxito y objeto JSON del usuario actualizado.
   Errores:
   404 Not Found: Usuario o show no encontrado.
   400 Bad Request: El show ha alcanzado su capacidad máxima o error en los datos enviados.
   500 Internal Server Error: Error en el servidor.
   Relaciones con Otros Recursos
   Interacción con el Recurso Show
   Campo show en el modelo User:
   Cada usuario puede estar asociado a un solo show, representado por el campo show, que almacena el ID del show.
   Al asignar un usuario a un show mediante la ruta /api/users/:id/show, el sistema también actualiza el modelo Show agregando el ID del usuario al campo clients de ese show.
   La información del show asignado se incluye en el objeto del usuario al obtener un usuario específico mediante la ruta /api/users/:id.
   Interacción con el Recurso Photo
   Aunque no hay una ruta directa en el controlador de usuario para gestionar fotos, las fotos están relacionadas con el usuario en el modelo Photo, donde cada foto puede incluir referencias a usuarios a través del campo clients.
