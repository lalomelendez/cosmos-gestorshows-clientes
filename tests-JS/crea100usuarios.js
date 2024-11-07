const axios = require("axios");

// Listas de nombres y apellidos comunes
const nombres = [
  "Carlos",
  "Juan",
  "José",
  "Luis",
  "Miguel",
  "Francisco",
  "David",
  "Antonio",
  "Alejandro",
  "John",
  "Michael",
  "Robert",
  "James",
  "William",
  "Christopher",
  "Daniel",
  "Matthew",
  "Thomas",
  "Nicholas",
  "Mark",
];
const apellidos = [
  "García",
  "Martínez",
  "Rodríguez",
  "López",
  "González",
  "Pérez",
  "Hernández",
  "Sánchez",
  "Ramírez",
  "Torres",
  "Smith",
  "Johnson",
  "Brown",
  "Williams",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Thomas",
];

// Opciones para energy, element y essence
const energies = ["lunar", "solar"];
const elements = ["agua", "fuego", "tierra", "aire"];
const essences = [
  "guerrero",
  "flor",
  "colibri",
  "tortuga",
  "romboDeFuego",
  "maizAzul",
  "aguila",
  "lagartija",
  "flecha",
  "maestro",
  "arbolDeViento",
  "venado",
];

// Función para generar un nombre completo aleatorio
function generarNombreCompleto() {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
  return { nombre, apellido };
}

// Función para generar un email aleatorio basado en el nombre y apellido
function generarEmail(nombre, apellido) {
  const randomDomain = ["gmail", "yahoo", "hotmail", "outlook"][
    Math.floor(Math.random() * 4)
  ];
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}@${randomDomain}.com`;
}

// Función para generar un cliente aleatorio
function generarCliente() {
  const { nombre, apellido } = generarNombreCompleto();
  const email = generarEmail(nombre, apellido);
  const energy = energies[Math.floor(Math.random() * energies.length)];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const essence = essences[Math.floor(Math.random() * essences.length)];

  return {
    name: `${nombre} ${apellido}`,
    email,
    energy,
    element,
    essence,
  };
}

// URL del endpoint para crear clientes
const url = "http://localhost:5000/api/users";

// Función para crear 100 clientes
async function crearClientes(cantidad) {
  const clientes = Array.from({ length: cantidad }, generarCliente);

  for (const cliente of clientes) {
    try {
      const response = await axios.post(url, cliente);
      console.log(
        `Cliente creado: ${response.data.name} - ${response.data.email} | Estado: Agregado correctamente`
      );
    } catch (error) {
      console.error(
        `Error al crear cliente: ${cliente.name} - ${cliente.email} | Error:`,
        error.response ? error.response.data : error.message
      );
    }
  }
}

// Ejecuta la función para crear 100 clientes
crearClientes(100);
