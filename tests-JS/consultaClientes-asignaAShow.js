const axios = require("axios");

// Configuración de URLs
const userUrl = "http://localhost:5000/api/users";
const showUrl = "http://localhost:5000/api/shows";

// Función para obtener todos los usuarios en estado "en espera"
async function obtenerUsuariosEnEspera() {
  try {
    const response = await axios.get(`${userUrl}/waiting`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener usuarios en espera:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

// Función para obtener todos los shows
async function obtenerShows() {
  try {
    const response = await axios.get(showUrl);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener shows:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
}

// Función para actualizar el estado de un usuario y asignarlo a un show
async function actualizarUsuarioEstadoYShow(userId, showId) {
  try {
    const url = `${userUrl}/${userId}/status`;
    console.log(`Actualizando usuario en URL: ${url} con showId: ${showId}`);

    await axios.patch(url, {
      status: "asignado a show",
      show: showId,
    });
    console.log(`Usuario ${userId} asignado al show ${showId}`);
  } catch (error) {
    console.error(
      `Error al actualizar el usuario ${userId}:`,
      error.response ? error.response.data : error.message
    );
  }
}

// Función para actualizar el show con los usuarios asignados
async function actualizarShowConUsuarios(showId, usuariosAsignados) {
  try {
    const url = `${showUrl}/${showId}`; // URL corregida
    console.log(
      `Actualizando show en URL: ${url} con usuarios: ${usuariosAsignados}`
    );

    await axios.patch(url, { clients: usuariosAsignados });
    console.log(
      `Show ${showId} actualizado con los usuarios: ${usuariosAsignados.join(
        ", "
      )}`
    );
  } catch (error) {
    console.error(
      `Error al actualizar el show ${showId}:`,
      error.response ? error.response.data : error.message
    );
  }
}

// Función principal para asignar usuarios a shows
async function asignarUsuariosAShows() {
  const usuariosEnEspera = await obtenerUsuariosEnEspera();
  const shows = await obtenerShows();

  for (const usuario of usuariosEnEspera) {
    // Filtrar shows que tengan menos de 4 usuarios asignados
    const showsDisponibles = shows.filter(
      (show) => show.clients && show.clients.length < 4
    );

    if (showsDisponibles.length === 0) {
      console.log(
        "No hay shows disponibles con espacio para asignar al usuario."
      );
      return;
    }

    // Elegir un show aleatorio con espacio disponible
    const showAsignado =
      showsDisponibles[Math.floor(Math.random() * showsDisponibles.length)];

    // Agregar el usuario a la lista de clientes del show
    showAsignado.clients.push(usuario._id);

    // Actualizar el usuario y el show en la base de datos
    await actualizarUsuarioEstadoYShow(usuario._id, showAsignado._id);
    await actualizarShowConUsuarios(showAsignado._id, showAsignado.clients);
  }
}

// Ejecutar la función principal
asignarUsuariosAShows();
