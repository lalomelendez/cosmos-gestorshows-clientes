// tests/showRoutes.test.js

const request = require("supertest");
const app = require("../server"); // Asegúrate de exportar tu app en server.js
const Show = require("../models/Show");
const User = require("../models/User");

let userId;

beforeAll(async () => {
  // Limpia la colección de shows y usuarios antes de las pruebas
  await Show.deleteMany({});
  await User.deleteMany({});

  // Crea un usuario para asociar con el show
  const user = new User({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    energy: "solar",
    element: "fuego",
    essence: "guerrero",
  });
  const savedUser = await user.save();
  userId = savedUser._id;
});

afterAll(async () => {
  await Show.deleteMany({});
  await User.deleteMany({});
});

describe("Show Routes", () => {
  it("should create a new show", async () => {
    const res = await request(app)
      .post("/api/shows")
      .send({
        start_time: new Date(),
        duration: 30,
        clients: [userId],
        photos: [],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should get all shows", async () => {
    const res = await request(app).get("/api/shows");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy(); // Debe devolver un array
  });

  it("should get a show by ID", async () => {
    const show = await Show.findOne();

    const res = await request(app).get(`/api/shows/${show._id}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should update a show", async () => {
    const show = await Show.findOne();

    const res = await request(app)
      .patch(`/api/shows/${show._id}`)
      .send({ duration: 45 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.duration).toEqual(45);
  });

  it("should delete a show", async () => {
    const show = await Show.findOne();

    const res = await request(app).delete(`/api/shows/${show._id}`);

    expect(res.statusCode).toEqual(204);

    const deletedShow = await Show.findById(show._id);
    expect(deletedShow).toBeNull(); // El show ya no debe existir
  });
});
