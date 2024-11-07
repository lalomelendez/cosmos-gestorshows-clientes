const axios = require("axios");

// Configuración de URLs
const showUrl = "http://localhost:5000/api/shows";
const photoUrl = "http://localhost:5000/api/photos";

// Función para obtener todos los shows en orden de tiempo
async function obtenerShowsOrdenados() {
  try {
    const response = await axios.get(showUrl, {
      params: {
        sort: "startTime", // Parámetro de orden en función del tiempo
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener los shows en orden de tiempo:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

// Función para obtener los usuarios asignados a un show
async function obtenerUsuariosDelShow(showId) {
  try {
    const response = await axios.get(`${showUrl}/${showId}`);
    return response.data.clients || [];
  } catch (error) {
    console.error(
      `Error al obtener los usuarios del show ${showId}:`,
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

// Función para hacer un POST de la foto con el ID del show y los IDs de los usuarios
async function postearFoto(showId, userIds) {
  try {
    const response = await axios.post(photoUrl, {
      showId,
      clientIds: userIds,
      url: `http://mi-servidor.com/fotos/${showId}`, // URL ficticia de la foto
    });
    console.log(`Foto para el show ${showId} creada con éxito:`, response.data);
  } catch (error) {
    console.error(
      `Error al postear la foto para el show ${showId}:`,
      error.response ? error.response.data : error.message
    );
  }
}

// Función principal para ejecutar las tareas
async function ejecutarTareas() {
  // Obtener los shows en orden de tiempo
  const showsOrdenados = await obtenerShowsOrdenados();

  for (const show of showsOrdenados) {
    // Obtener los usuarios asignados al show
    const usuariosAsignados = await obtenerUsuariosDelShow(show._id);

    if (usuariosAsignados.length === 0) {
      console.log(`El show ${show._id} no tiene usuarios asignados.`);
      continue;
    }

    // Extraer los IDs de los usuarios
    const userIds = usuariosAsignados.map((usuario) => usuario._id);

    // Hacer POST de la foto con el ID del show y los IDs de los usuarios
    await postearFoto(show._id, userIds);
  }
}

// Ejecutar la función principal
ejecutarTareas();
