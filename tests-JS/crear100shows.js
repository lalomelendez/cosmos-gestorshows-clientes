const axios = require("axios");

// Configuración
const url = "http://localhost:5000/api/shows";
const horarioInicio = new Date();
horarioInicio.setHours(10, 0, 0, 0); // 10:00 AM
const duracionShow = 15 * 60 * 1000; // 15 minutos en milisegundos
const cantidadShows = 100;

// Función para crear un show con el horario especificado
async function crearShow(horario) {
  const show = {
    startTime: horario.toISOString(),
    duration: 15, // Duración en minutos
  };

  try {
    const response = await axios.post(url, show);
    console.log(
      `Show creado: Inicio ${horario.toLocaleTimeString()} | Estado: Creado exitosamente`
    );
  } catch (error) {
    console.error(
      `Error al crear show de inicio ${horario.toLocaleTimeString()}:`,
      error.response ? error.response.data : error.message
    );
  }
}

// Función para crear 100 shows consecutivos
async function crearShowsConsecutivos() {
  let horario = new Date(horarioInicio); // Clonamos el horario de inicio

  for (let i = 0; i < cantidadShows; i++) {
    await crearShow(horario);
    horario = new Date(horario.getTime() + duracionShow); // Incrementar 15 minutos para el siguiente show
  }
}

// Ejecutar la creación de shows consecutivos
crearShowsConsecutivos();
