//userController.js

const User = require("../models/User");
const Show = require("../models/Show");

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, email, energy, element, essence } = req.body;
    const user = new User({ name, email, energy, element, essence });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Error al crear el usuario" });
  }
};

// Obtener todos los usuarios en espera
const getUsersByStatus = async (req, res) => {
  try {
    const users = await User.find({ status: "en espera" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error al obtener usuarios en espera",
    });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("show"); // Populate para incluir detalles del show
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener el usuario" });
  }
};

// Actualizar el estado de un usuario
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Error al actualizar el usuario" });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al eliminar el usuario" });
  }
};

// Asignar un usuario a un show, verificando capacidad
const assignUserToShow = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { showId } = req.body; // ID del show al que se asociará el usuario

    // Verificar que el show existe y que tiene menos de 4 usuarios
    const show = await Show.findById(showId).populate("clients");
    if (!show) return res.status(404).json({ message: "Show no encontrado" });

    // Verificar la capacidad del show
    if (show.clients.length >= 4) {
      return res
        .status(400)
        .json({ message: "El show ya tiene la capacidad máxima de usuarios" });
    }

    // Asignar el usuario al show y actualizar ambos
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { show: showId, status: "asignado a show" }, // Cambia el estado a "asignado a show"
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualizar el show con el nuevo cliente
    show.clients.push(updatedUser._id);
    await show.save();

    res
      .status(200)
      .json({ message: "Usuario asignado al show exitosamente", updatedUser });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error al asignar el usuario al show",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUsersByStatus,
  assignUserToShow,
};
