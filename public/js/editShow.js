// DOM Elements
const showSelect = document.getElementById("showSelect");
const usersAssigned = document.getElementById("usersAssigned");
const deleteShowButton = document.getElementById("deleteShowButton");
const message = document.getElementById("message");

// Load shows with "creado" status on page load
document.addEventListener("DOMContentLoaded", async () => {
  await loadAvailableShows();
});

// Function to load shows with status "creado"
async function loadAvailableShows() {
  try {
    const response = await fetch(`/api/shows/available`);
    const shows = await response.json();

    showSelect.innerHTML = '<option value="">Seleccione un show</option>';
    usersAssigned.classList.add("hidden");
    deleteShowButton.disabled = true;

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
      displayMessage("No hay shows disponibles para editar.", "red");
    }
  } catch (error) {
    console.error("Error al cargar los shows:", error);
    displayMessage("Error al cargar los shows. Revisa tu conexión.", "red");
  }
}

// Function to display assigned users when a show is selected
showSelect.addEventListener("change", () => {
  const selectedShowId = showSelect.value;
  const clients = JSON.parse(
    showSelect.selectedOptions[0]?.dataset.clients || "[]"
  );

  if (selectedShowId && clients.length > 0) {
    usersAssigned.innerHTML = ""; // Clear user list
    clients.forEach((client) => {
      const listItem = document.createElement("li");
      listItem.className = "flex justify-between items-center";
      listItem.textContent = `${client.name} - ${client.email} - ${client.energy} - ${client.element} - ${client.essence}`;

      // Remove button for each user
      const removeButton = document.createElement("button");
      removeButton.className = "text-red-500 ml-4";
      removeButton.textContent = "Eliminar";
      removeButton.onclick = () =>
        removeUserFromShow(selectedShowId, client._id);

      listItem.appendChild(removeButton);
      usersAssigned.appendChild(listItem);
    });
    usersAssigned.classList.remove("hidden");
    deleteShowButton.disabled = false;
  } else {
    usersAssigned.classList.add("hidden");
    deleteShowButton.disabled = true;
  }
});

// Function to remove a user from the show
async function removeUserFromShow(showId, userId) {
  try {
    const response = await fetch(`/api/shows/${showId}/remove-user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      displayMessage("Usuario eliminado del show.", "green");
      await loadAvailableShows(); // Refresh the show list
    } else {
      console.error("Error al eliminar usuario del show");
      displayMessage("Error al eliminar usuario del show.", "red");
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    displayMessage("Error al eliminar usuario.", "red");
  }
}

// Function to delete a show
deleteShowButton.addEventListener("click", async () => {
  const selectedShowId = showSelect.value;
  if (!selectedShowId) return;

  try {
    const response = await fetch(`/api/shows/${selectedShowId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      displayMessage("Show eliminado correctamente.", "green");
      await loadAvailableShows(); // Refresh the show list
    } else {
      console.error("Error al eliminar el show.");
      displayMessage("Error al eliminar el show.", "red");
    }
  } catch (error) {
    console.error("Error al eliminar el show:", error);
    displayMessage("Error al eliminar el show.", "red");
  }
});

// Utility function to display messages
function displayMessage(text, color) {
  message.textContent = text;
  message.className = `text-${color}-500`;
}
