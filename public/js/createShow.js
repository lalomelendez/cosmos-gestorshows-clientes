// Populate time picker with 15-minute intervals
function populateTimePicker() {
  const timePicker = document.getElementById("timePicker");
  const intervals = ["00", "15", "30", "45"];

  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    intervals.forEach((minute) => {
      const timeOption = `${formattedHour}:${minute}`;
      const option = document.createElement("option");
      option.value = timeOption;
      option.textContent = timeOption;
      timePicker.appendChild(option);
    });
  }
}

// Initialize the time picker on page load
document.addEventListener("DOMContentLoaded", () => {
  populateTimePicker();
});

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
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;

  if (!date || !time) {
    message.textContent = "Seleccione una fecha y una hora válidas.";
    message.classList.add("text-red-500");
    return;
  }

  const startTime = `${date}T${time}:00`;
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
