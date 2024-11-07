// /static/js/createShow.js

document
  .getElementById("showForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const duration = document.getElementById("duration").value;
    const message = document.getElementById("message");

    // Validar que todos los campos estén completos
    if (!startDate || !startTime || !duration) {
      message.textContent = "Por favor, completa todos los campos.";
      message.className = "error";
      return;
    }

    // Crear el objeto de fecha y hora
    const startDateTime = new Date(`${startDate}T${startTime}:00`);

    // Datos del show
    const showData = {
      startTime: startDateTime,
      duration: parseInt(duration),
    };

    try {
      const response = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showData),
      });

      if (response.ok) {
        message.textContent = "Show creado exitosamente.";
        message.className = "success";
        document.getElementById("showForm").reset();
      } else {
        const errorData = await response.json();
        message.textContent = `Error: ${
          errorData.message || "No se pudo crear el show."
        }`;
        message.className = "error";
      }
    } catch (error) {
      message.textContent = `Error de conexión: ${error.message}`;
      message.className = "error";
    }
  });
