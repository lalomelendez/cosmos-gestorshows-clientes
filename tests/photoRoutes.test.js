// tests/photoRoutes.test.js

const request = require("supertest");
const app = require("../server"); // Asegúrate de exportar tu app en server.js
const Photo = require("../models/Photo");
const User = require("../models/User");
const Show = require("../models/Show");

let userId, showId;

beforeAll(async () => {
  await Photo.deleteMany({});
  await User.deleteMany({});
  await Show.deleteMany({});

  // Crea un usuario para asociar con la foto
  const user = new User({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    energy: "solar",
    element: "fuego",
    essence: "guerrero",
  });
  const savedUser = await user.save();
  userId = savedUser._id;

  // Crea un show para asociar con la foto
  const show = new Show({
    start_time: new Date(),
    duration: 30,
    clients: [userId],
    photos: [],
  });
  const savedShow = await show.save();
  showId = savedShow._id;
});

afterAll(async () => {
  await Photo.deleteMany({});
  await User.deleteMany({});
  await Show.deleteMany({});
});

describe("Photo Routes", () => {
  it("should create a new photo", async () => {
    const res = await request(app).post("/api/photos").send({
      file_path: "/path/to/photo.jpg",
      photo_type: "espontánea",
      user: userId,
      show: showId,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should get all photos", async () => {
    const res = await request(app).get("/api/photos");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy(); // Debe devolver un array
  });

  it("should get a photo by ID", async () => {
    const photo = await Photo.findOne();

    const res = await request(app).get(`/api/photos/${photo._id}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should update a photo", async () => {
    const photo = await Photo.findOne();

    const res = await request(app)
      .patch(`/api/photos/${photo._id}`)
      .send({ photo_type: "posada" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.photo_type).toEqual("posada");
  });

  it("should delete a photo", async () => {
    const photo = await Photo.findOne();

    const res = await request(app).delete(`/api/photos/${photo._id}`);

    expect(res.statusCode).toEqual(204);

    const deletedPhoto = await Photo.findById(photo._id);
    expect(deletedPhoto).toBeNull(); // La foto ya no debe existir
  });
});
