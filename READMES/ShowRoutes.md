Documentación de Rutas de Show (Show API)
Este documento describe todas las rutas disponibles para el recurso Show en la API, junto con sus interacciones con los recursos User y Photo.

Rutas de Show

1. Crear un Nuevo Show
   Método: POST
   URL: /api/shows
   Descripción: Crea un nuevo show en la base de datos.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "startTime": "2024-10-01T12:00:00Z",
   "duration": 60,
   "clients": ["ID_Usuario1", "ID_Usuario2"]
   }
   Respuesta Exitosa:
   Código: 201 Created
   Cuerpo: El objeto JSON del show recién creado, con endTime calculado automáticamente.
   Errores:
   400 Bad Request: Error en los datos enviados.
2. Obtener Todos los Shows
   Método: GET
   URL: /api/shows
   Descripción: Recupera todos los shows, incluyendo los usuarios asignados a cada uno.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Una lista de objetos JSON de shows, con detalles de cada usuario asignado (clientes).
   Errores:
   500 Internal Server Error: Error en el servidor.
3. Obtener un Show por ID
   Método: GET
   URL: /api/shows/:id
   Descripción: Recupera un show específico mediante su ID, incluyendo los usuarios asignados y las fotos relacionadas.
   Parámetros de URL:
   id: ID del show.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON del show, con detalles de los usuarios asignados y fotos relacionadas.
   Errores:
   404 Not Found: Show no encontrado.
   500 Internal Server Error: Error en el servidor.
4. Actualizar un Show con Usuarios Asignados
   Método: PATCH
   URL: /api/shows/:id
   Descripción: Actualiza la lista de usuarios asignados a un show específico.
   Parámetros de URL:
   id: ID del show.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "clients": ["ID_Usuario1", "ID_Usuario3"]
   }
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON del show actualizado con la lista actualizada de usuarios.
   Errores:
   404 Not Found: Show no encontrado.
   400 Bad Request: Error en los datos enviados.
   500 Internal Server Error: Error en el servidor.
5. Eliminar un Show
   Método: DELETE
   URL: /api/shows/:id
   Descripción: Elimina un show específico de la base de datos mediante su ID.
   Parámetros de URL:
   id: ID del show.
   Respuesta Exitosa:
   Código: 204 No Content
   Errores:
   404 Not Found: Show no encontrado.
   500 Internal Server Error: Error en el servidor.
   Relaciones con Otros Recursos
   Interacción con el Recurso User
   Campo clients en el modelo Show:
   Un show puede tener hasta cuatro usuarios asignados, almacenados en el campo clients como un arreglo de IDs de usuarios.
   La asignación de usuarios a un show se gestiona a través de la ruta /api/users/:id/show en el controlador de usuario.
   Al recuperar los detalles de un show (/api/shows/:id), el campo clients contiene los detalles de los usuarios asignados.
   Interacción con el Recurso Photo
   Campo photos en el modelo Show:
   Cada show puede tener múltiples fotos relacionadas, referenciadas en el campo photos, que almacena un arreglo de IDs de fotos.
   Las fotos pueden ser agregadas mediante la funcionalidad en el controlador de fotos, especificando el showId y los clientIds.
   Al recuperar los detalles de un show (/api/shows/:id), el campo photos incluye información sobre las fotos relacionadas con el show.
