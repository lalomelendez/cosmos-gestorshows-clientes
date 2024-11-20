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

  // First, clear and hide the users list
  usersAssigned.innerHTML = "";
  usersAssigned.classList.add("hidden");

  // Enable delete button if a show is selected, regardless of clients
  if (selectedShowId) {
    deleteShowButton.disabled = false;

    // Only show users list if there are clients
    if (clients.length > 0) {
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
    }
  } else {
    // No show selected, disable delete button
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
      window.location.reload();
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
  console.log("Attempting to delete show:", selectedShowId);

  try {
    const response = await fetch(`/api/shows/${selectedShowId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle response without requiring JSON parsing
    if (response.status === 200) {
      console.log("Show deleted successfully");
      displayMessage("Show eliminado correctamente.", "green");
      showSelect.value = ""; // Reset select
      usersAssigned.innerHTML = ""; // Clear users list
      usersAssigned.classList.add("hidden");
      await loadAvailableShows(); // Refresh shows list
    } else {
      console.error("Delete failed with status:", response.status);
      displayMessage("Error al eliminar el show.", "red");
    }
  } catch (error) {
    console.error("Delete error:", error);
    displayMessage("Error al eliminar el show.", "red");
  }
});

// Utility function to display messages
function displayMessage(text, color) {
  message.textContent = text;
  message.className = `text-${color}-500`;
}
