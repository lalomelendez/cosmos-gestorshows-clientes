// controllers/photoController.js

const Photo = require("../models/Photo");
const Show = require("../models/Show");
const User = require("../models/User");

// Capturar una foto
const capturePhoto = async (req, res) => {
  try {
    const { url, showId, clientIds } = req.body;

    // Verificar que el show exista
    const showExists = await Show.exists({ _id: showId });
    if (!showExists) {
      return res
        .status(400)
        .json({ message: "El show especificado no existe" });
    }

    // Verificar que todos los clientes existan
    const existingClients = await User.find({ _id: { $in: clientIds } });
    if (existingClients.length !== clientIds.length) {
      return res.status(400).json({ message: "Uno o más clientes no existen" });
    }

    // Crear la nueva foto con las relaciones a show y clientes
    const photo = new Photo({
      url,
      show: showId,
      clients: clientIds,
    });

    const savedPhoto = await photo.save();

    // Actualizar el show y los clientes para asociar la foto
    await Show.findByIdAndUpdate(showId, { $push: { photos: savedPhoto._id } });
    await User.updateMany(
      { _id: { $in: clientIds } },
      { $push: { photos: savedPhoto._id } }
    );

    res.status(201).json(savedPhoto); // Devolver la foto guardada
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al capturar la foto" });
  }
};

// Obtener todas las fotos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate("show").populate("clients");

    res.status(200).json(photos);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener las fotos" });
  }
};

// Obtener una foto por ID
const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("show")
      .populate("clients");

    if (!photo) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    res.status(200).json(photo);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener la foto" });
  }
};

// Modificar una foto
const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, showId, clientIds } = req.body;

    // Verificar que el show y los clientes existan
    if (showId) {
      const showExists = await Show.exists({ _id: showId });
      if (!showExists) {
        return res
          .status(400)
          .json({ message: "El show especificado no existe" });
      }
    }
    if (clientIds) {
      const existingClients = await User.find({ _id: { $in: clientIds } });
      if (existingClients.length !== clientIds.length) {
        return res
          .status(400)
          .json({ message: "Uno o más clientes no existen" });
      }
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      { url, show: showId, clients: clientIds },
      { new: true }
    );

    if (!updatedPhoto) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    res.status(200).json(updatedPhoto);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al actualizar la foto" });
  }
};

// Eliminar una foto
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPhoto = await Photo.findByIdAndDelete(id);

    if (!deletedPhoto) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    // Eliminar la referencia de la foto en Show y en los clientes
    await Show.findByIdAndUpdate(deletedPhoto.show, { $pull: { photos: id } });
    await User.updateMany(
      { _id: { $in: deletedPhoto.clients } },
      { $pull: { photos: id } }
    );

    res.status(200).json({ message: "Foto eliminada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al eliminar la foto" });
  }
};

module.exports = {
  capturePhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
};
