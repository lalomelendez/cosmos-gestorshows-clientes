// Variables de elementos del DOM
const showSelect = document.getElementById("showSelect");
const usersAssigned = document.getElementById("usersAssigned");
const playButton = document.getElementById("playButton");
const message = document.getElementById("message");

// Cargar shows que aún no han sido reproducidos al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await loadAvailableShows();
});

// Función para cargar solo los shows que no han sido reproducidos
async function loadAvailableShows() {
  try {
    console.log("Cargando shows disponibles");
    const response = await fetch(`/api/shows/available`); // Updated endpoint to fetch only "created" shows
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

// Función para enviar la señal de inicio OSC de /play
async function sendOscPlaySignal() {
  try {
    const response = await fetch("http://192.168.1.12:5000/api/osc/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Play signal sent successfully.");
    } else {
      console.error("Error sending play signal.");
    }
  } catch (error) {
    console.error("Connection error:", error);
  }
}

// Función para enviar los detalles de los usuarios asignados
async function sendUserDetails(showId, clients) {
  try {
    const response = await fetch(
      "http://192.168.1.12:5000/api/osc/send-users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showId: showId,
          users: clients,
        }),
      }
    );
    if (response.ok) {
      console.log("User details sent successfully.");
    } else {
      console.error("Error sending user details.");
    }
  } catch (error) {
    console.error("Connection error while sending user details:", error);
  }
}

// Función para actualizar el estado del show
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
  const selectedShowId = showSelect.value;
  const clients = JSON.parse(
    showSelect.selectedOptions[0]?.dataset.clients || "[]"
  );

  if (!selectedShowId || clients.length === 0) {
    displayMessage(
      "Por favor selecciona un show con usuarios asignados.",
      "red"
    );
    return;
  }

  // Enviar detalles de los usuarios asignados
  await sendUserDetails(selectedShowId, clients);

  // Enviar la señal de inicio OSC
  await sendOscPlaySignal();

  // Cambiar el estado del show a "ha sido reproducido"
  await updateShowStatus(selectedShowId);
});

// Escuchar cambios en el selector de show para mostrar los usuarios asignados
showSelect.addEventListener("change", () => {
  const selectedShowId = showSelect.value;
  const clients = JSON.parse(
    showSelect.selectedOptions[0]?.dataset.clients || "[]"
  );

  if (selectedShowId && clients.length > 0) {
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
