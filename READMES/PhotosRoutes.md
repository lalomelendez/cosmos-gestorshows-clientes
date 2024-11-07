Documentación de Rutas de Photo (Photo API)
Este documento describe todas las rutas disponibles para el recurso Photo en la API, junto con sus interacciones con los recursos Show y User.

Rutas de Photo

1. Crear una Nueva Foto
   Método: POST
   URL: /api/photos
   Descripción: Crea una nueva foto y la asocia a un show y a los usuarios correspondientes.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "url": "https://example.com/photo.jpg",
   "showId": "ID_Show",
   "clientIds": ["ID_Usuario1", "ID_Usuario2"]
   }
   Respuesta Exitosa:
   Código: 201 Created
   Cuerpo: El objeto JSON de la foto recién creada, con referencias al show y a los clientes asignados.
   Errores:
   400 Bad Request: Uno o más de los IDs de show o cliente no existen.
   500 Internal Server Error: Error en el servidor.
2. Obtener Todas las Fotos
   Método: GET
   URL: /api/photos
   Descripción: Recupera todas las fotos, incluyendo los shows y los clientes asociados a cada una.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Una lista de objetos JSON de fotos, con detalles de los shows y los usuarios relacionados.
   Errores:
   500 Internal Server Error: Error en el servidor.
3. Obtener una Foto por ID
   Método: GET
   URL: /api/photos/:id
   Descripción: Recupera una foto específica mediante su ID, incluyendo los detalles del show y de los usuarios asociados.
   Parámetros de URL:
   id: ID de la foto.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON de la foto, con detalles del show y los clientes.
   Errores:
   404 Not Found: Foto no encontrada.
   500 Internal Server Error: Error en el servidor.
4. Modificar una Foto
   Método: PATCH
   URL: /api/photos/:id
   Descripción: Actualiza la URL de una foto, o asocia la foto a un nuevo show o a diferentes usuarios.
   Parámetros de URL:
   id: ID de la foto.
   Cuerpo de la Solicitud:
   json
   Copiar código
   {
   "url": "https://example.com/updated-photo.jpg",
   "showId": "Nuevo_ID_Show",
   "clientIds": ["Nuevo_ID_Usuario1", "Nuevo_ID_Usuario2"]
   }
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: Objeto JSON de la foto actualizada.
   Errores:
   400 Bad Request: Uno o más de los IDs de show o cliente no existen.
   404 Not Found: Foto no encontrada.
   500 Internal Server Error: Error en el servidor.
5. Eliminar una Foto
   Método: DELETE
   URL: /api/photos/:id
   Descripción: Elimina una foto específica de la base de datos y elimina sus referencias en el show y en los clientes asociados.
   Parámetros de URL:
   id: ID de la foto.
   Respuesta Exitosa:
   Código: 200 OK
   Cuerpo: { "message": "Foto eliminada con éxito" }
   Errores:
   404 Not Found: Foto no encontrada.
   500 Internal Server Error: Error en el servidor.
   Relaciones con Otros Recursos
   Interacción con el Recurso Show
   Campo show en el modelo Photo:
   Cada foto está asociada a un show específico mediante una referencia al ID de dicho show.
   La verificación de existencia de un show se realiza al crear o modificar una foto.
   Al eliminar una foto, la referencia se elimina automáticamente del show correspondiente.
   Interacción con el Recurso User
   Campo clients en el modelo Photo:
   Cada foto puede incluir varios usuarios, referenciados en el campo clients como un arreglo de IDs de usuario.
   La verificación de la existencia de cada cliente se realiza al crear o modificar una foto.
   Al eliminar una foto, las referencias se eliminan automáticamente de los usuarios asociados.
