// Variables de elementos del DOM
const showSelect = document.getElementById("showSelect");
const usersAssigned = document.getElementById("usersAssigned");
const playButton = document.getElementById("playButton");
const message = document.getElementById("message");

// Cargar todos los shows al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await loadAllShows();
});

// Función para cargar todos los shows
async function loadAllShows() {
  try {
    console.log("Cargando todos los shows");
    const response = await fetch(`/api/shows`);
    const shows = await response.json();

    console.log("Shows obtenidos:", shows);

    showSelect.innerHTML = '<option value="">Seleccione un show</option>';
    usersAssigned.classList.add("hidden");
    playButton.disabled = true;

    if (shows.length > 0) {
      showSelect.disabled = false;
      shows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show._id;
        option.textContent = `Show - ${new Date(
          show.startTime
        ).toLocaleTimeString()} (${show.clients.length} usuarios)`;
        option.dataset.clients = JSON.stringify(show.clients);
        showSelect.appendChild(option);
      });
    } else {
      showSelect.disabled = true;
      displayMessage("No hay shows disponibles.", "red");
    }
  } catch (error) {
    console.error("Error al cargar los shows:", error);
    displayMessage("Error al cargar los shows. Revisa tu conexión.", "red");
  }
}

// Función para enviar la señal OSC de "play"
async function sendOscPlaySignal() {
  try {
    console.log("Enviando señal OSC para iniciar el show.");
    await fetch("/api/osc/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    displayMessage("Señal de inicio enviada correctamente.", "green");
  } catch (error) {
    displayMessage("Error al enviar señal de inicio.", "red");
    console.error("Error en sendOscPlaySignal:", error);
  }
}

async function updateShowStatus(showId) {
  try {
    console.log(
      `Actualizando el estado del show ${showId} a 'ha sido reproducido'`
    );
    const response = await fetch(`/api/shows/${showId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ha sido reproducido" }),
    });

    if (response.ok) {
      displayMessage("Estado del show actualizado correctamente.", "green");
    } else {
      const errorData = await response.json();
      console.error(
        "Error en la respuesta de actualización del estado:",
        errorData
      );
      displayMessage("Error al actualizar el estado del show.", "red");
    }
  } catch (error) {
    console.error("Error de conexión al actualizar el estado del show:", error);
    displayMessage(`Error de conexión: ${error.message}`, "red");
  }
}

// Función para mostrar mensajes de éxito o error
function displayMessage(text, color) {
  message.textContent = text;
  message.className = `text-${color}-500`;
}

// Escuchar el clic en el botón Play
playButton.addEventListener("click", async () => {
  const selectedShow = showSelect.value;
  if (!selectedShow) {
    displayMessage("Por favor selecciona un show.", "red");
    return;
  }

  // Enviar la señal de inicio OSC
  await sendOscPlaySignal();

  // Cambiar el estado del show a "ha sido reproducido"
  await updateShowStatus(selectedShow);
});

// Escuchar cambios en el selector de show para mostrar los usuarios asignados
showSelect.addEventListener("change", () => {
  const selectedShow = showSelect.value;
  const clients = JSON.parse(
    showSelect.selectedOptions[0]?.dataset.clients || "[]"
  );

  if (selectedShow && clients.length > 0) {
    usersAssigned.innerHTML = ""; // Limpiar la lista de usuarios
    clients.forEach((client) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${client.name} - ${client.email} - ${client.energy} - ${client.element} - ${client.essence}`;
      usersAssigned.appendChild(listItem);
    });
    usersAssigned.classList.remove("hidden");
    playButton.disabled = false;
  } else {
    usersAssigned.classList.add("hidden");
    playButton.disabled = true;
  }
});