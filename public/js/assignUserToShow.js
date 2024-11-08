// Variables para la selección de usuario y show
let selectedUserId = null;
let selectedShowId = null;

// Cargar usuarios en espera y shows disponibles al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  await loadShows();
});

// Función para cargar usuarios en espera
async function loadUsers() {
  try {
    const response = await fetch("/api/users/waiting");
    const users = await response.json();

    const userContainer = document.getElementById("userContainer");
    userContainer.innerHTML = ""; // Limpiar el contenedor de usuarios

    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className =
        "bg-white shadow-md rounded-lg p-4 w-48 text-center cursor-pointer border";
      userCard.innerHTML = `
                <div class="text-blue-500 font-bold mb-2">👤 ${user.name}</div>
                <p class="text-sm text-gray-500">${user.email}</p>
            `;
      userCard.addEventListener("click", () => selectUser(user._id, userCard));
      userContainer.appendChild(userCard);
    });
  } catch (error) {
    displayMessage(
      "Error al cargar usuarios en espera. Revisa tu conexión.",
      "red"
    );
  }
}

// Función para cargar shows disponibles con estado 'creado'
async function loadShows() {
  try {
    const response = await fetch("/api/shows/available");
    const shows = await response.json();

    const showContainer = document.getElementById("showContainer");
    showContainer.innerHTML = ""; // Limpiar el contenedor de shows

    shows.forEach((show) => {
      const showCard = document.createElement("div");
      showCard.className =
        "bg-white shadow-md rounded-lg p-4 w-48 text-center cursor-pointer border";
      showCard.innerHTML = `
                <div class="text-green-500 font-bold mb-2">🎥 Show</div>
                <p class="text-sm text-gray-500">${new Date(
                  show.startTime
                ).toLocaleString()}</p>
                <p class="text-xs text-gray-400">(${
                  show.clients.length
                }/4 usuarios asignados)</p>
            `;
      showCard.addEventListener("click", () => selectShow(show._id, showCard));
      showContainer.appendChild(showCard);
    });
  } catch (error) {
    displayMessage("Error al cargar shows. Revisa tu conexión.", "red");
  }
}

// Función para seleccionar usuario
function selectUser(userId, userCard) {
  const userContainer = document.getElementById("userContainer");
  Array.from(userContainer.children).forEach((card) =>
    card.classList.remove("border-blue-500")
  );
  userCard.classList.add("border-blue-500");
  selectedUserId = userId;
}

// Función para seleccionar show
function selectShow(showId, showCard) {
  const showContainer = document.getElementById("showContainer");
  Array.from(showContainer.children).forEach((card) =>
    card.classList.remove("border-green-500")
  );
  showCard.classList.add("border-green-500");
  selectedShowId = showId;
}

// Función para asignar el usuario seleccionado al show seleccionado
document.getElementById("assignButton").addEventListener("click", async () => {
  if (!selectedUserId || !selectedShowId) {
    displayMessage("Por favor, selecciona un usuario y un show.", "red");
    return;
  }

  try {
    const response = await fetch(`/api/users/${selectedUserId}/show`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showId: selectedShowId }),
    });

    if (response.ok) {
      displayMessage("Usuario asignado al show exitosamente.", "green");
      await loadUsers(); // Recargar usuarios en espera
      await loadShows(); // Recargar shows para ver los cambios en capacidad
      selectedUserId = null;
      selectedShowId = null;
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
