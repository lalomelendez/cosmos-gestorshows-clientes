// /static/js/capturePhoto.js

// Cargar shows al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await loadShows();
});

// Función para cargar shows con usuarios asignados
async function loadShows() {
  try {
    const response = await fetch("/api/shows");
    const shows = await response.json();

    const showSelect = document.getElementById("showSelect");
    showSelect.innerHTML = ""; // Limpiar el select para recargar

    shows.forEach((show) => {
      if (show.clients && show.clients.length > 0) {
        const option = document.createElement("option");
        option.value = show._id;
        option.textContent = `Show - ${new Date(
          show.startTime
        ).toLocaleString()} (${show.clients.length} usuarios asignados)`;
        option.dataset.clients = JSON.stringify(show.clients); // Añadir usuarios como atributo de datos
        showSelect.appendChild(option);
      }
    });
  } catch (error) {
    displayMessage("Error al cargar los shows. Revisa tu conexión.", "red");
  }
}

// Función para capturar la foto del show seleccionado
document
  .getElementById("capturePhotoBtn")
  .addEventListener("click", async () => {
    const showSelect = document.getElementById("showSelect");
    const showId = showSelect.value;
    const clients = JSON.parse(showSelect.selectedOptions[0].dataset.clients);

    if (clients.length === 0) {
      displayMessage("Este show no tiene usuarios asignados.", "red");
      return;
    }

    // Datos de la foto (simulación de URL para ejemplo)
    const photoData = {
      url: "https://example.com/photo.jpg", // Cambia esto a la URL real o a un método de captura de foto en producción
      showId: showId,
      clientIds: clients.map((client) => client._id),
    };

    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoData),
      });

      if (response.ok) {
        displayMessage(
          "Foto capturada y relaciones creadas correctamente.",
          "green"
        );
      } else {
        displayMessage("Error al capturar la foto.", "red");
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
