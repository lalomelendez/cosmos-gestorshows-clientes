// /static/js/assignUserToShow.js

// Cargar usuarios en espera y shows al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  await loadShows();
});

// Función para cargar usuarios en espera
async function loadUsers() {
  try {
    const response = await fetch("/api/users/waiting");
    const users = await response.json();

    const userSelect = document.getElementById("userSelect");
    userSelect.innerHTML = ""; // Limpiar el select para recargar

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user._id;
      option.textContent = `${user.name} - ${user.email}`;
      userSelect.appendChild(option);
    });
  } catch (error) {
    displayMessage(
      "Error al cargar usuarios en espera. Revisa tu conexión.",
      "red"
    );
  }
}

// Función para cargar shows disponibles
async function loadShows() {
  try {
    const response = await fetch("/api/shows");
    const shows = await response.json();

    const showSelect = document.getElementById("showSelect");
    showSelect.innerHTML = ""; // Limpiar el select para recargar

    shows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show._id;
      option.textContent = `Show - ${new Date(
        show.startTime
      ).toLocaleString()} (${show.clients.length}/4 usuarios asignados)`;
      showSelect.appendChild(option);
    });
  } catch (error) {
    displayMessage("Error al cargar shows. Revisa tu conexión.", "red");
  }
}

// Función para asignar el usuario seleccionado al show seleccionado
document.getElementById("assignButton").addEventListener("click", async () => {
  const userId = document.getElementById("userSelect").value;
  const showId = document.getElementById("showSelect").value;

  if (!userId || !showId) {
    displayMessage("Por favor, selecciona un usuario y un show.", "red");
    return;
  }

  try {
    const response = await fetch(`/api/users/${userId}/show`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showId }),
    });

    if (response.ok) {
      displayMessage("Usuario asignado al show exitosamente.", "green");
      await loadUsers(); // Recargar usuarios en espera
      await loadShows(); // Recargar shows para ver los cambios en capacidad
    } else {
      const errorData = await response.json();
      displayMessage(`Error: ${errorData.message}`, "red");
    }
  } catch (error) {
    displayMessage(`Error de conexión: ${error.message}`, "red");
  }
});

// Función para mostrar mensajes de éxito o error
function displayMessage(message, color) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `text-${color}-500`;
}
