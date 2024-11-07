// /static/js/createUser.js

document
  .getElementById("userForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const energy = document.getElementById("energy").value;
    const element = document.getElementById("element").value;
    const essence = document.getElementById("essence").value;
    const emailError = document.getElementById("emailError");
    const message = document.getElementById("message");

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailError.classList.remove("hidden");
      return;
    } else {
      emailError.classList.add("hidden");
    }

    // Datos del usuario
    const userData = { name, email, energy, element, essence };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        message.textContent = "Usuario creado exitosamente.";
        message.className = "success";
        document.getElementById("userForm").reset();
      } else {
        const errorData = await response.json();
        message.textContent = `Error: ${errorData.message}`;
        message.className = "error";
      }
    } catch (error) {
      message.textContent = `Error de conexión: ${error.message}`;
      message.className = "error";
    }
  });
