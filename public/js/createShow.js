// Select elements from the DOM
const createShowForm = document.getElementById("createShowForm");
const showFormContainer = document.getElementById("showFormContainer");
const nextButtonContainer = document.getElementById("nextButtonContainer");
const nextButton = document.getElementById("nextButton");
const message = document.getElementById("message");

// Handle form submission to create a show
createShowForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather form data
  const startTime = document.getElementById("startTime").value;
  const duration = 15; // Set default duration to 15 minutes

  try {
    // Send request to create the show
    const response = await fetch("/api/shows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startTime, duration }),
    });

    // If the show is created successfully
    if (response.ok) {
      message.textContent = "Show creado exitosamente.";
      message.classList.add("text-green-500");

      // Hide the show creation form and show the 'Siguiente' button
      showFormContainer.classList.add("hidden");
      nextButtonContainer.classList.remove("hidden");
    } else {
      const errorData = await response.json();
      message.textContent = `Error: ${errorData.message}`;
      message.classList.add("text-red-500");
    }
  } catch (error) {
    message.textContent = `Error de conexión: ${error.message}`;
    message.classList.add("text-red-500");
  }
});

// Redirect to the Assign User to Show page when 'Siguiente' is clicked
nextButton.addEventListener("click", () => {
  window.location.href = "/assign-user-to-show";
});
