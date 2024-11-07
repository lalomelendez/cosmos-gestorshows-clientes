// tests/userRoutes.test.js

const request = require("supertest");
const { app } = require("../server"); // Asegúrate de importar app correctamente
const User = require("../models/User");

beforeAll(async () => {
  await User.deleteMany({}); // Limpia la colección de usuarios antes de las pruebas
});

afterAll(async () => {
  await User.deleteMany({}); // Limpia la colección de usuarios después de las pruebas
});

describe("User Routes", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      energy: "solar",
      element: "fuego",
      essence: "guerrero",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual("Juan Pérez");
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/users");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy(); // Debe devolver un array
  });

  it("should get a user by ID", async () => {
    const user = await User.findOne({ email: "juan.perez@example.com" });

    const res = await request(app).get(`/api/users/${user._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Juan Pérez");
  });

  it("should update a user", async () => {
    const user = await User.findOne({ email: "juan.perez@example.com" });

    const res = await request(app)
      .patch(`/api/users/${user._id}`)
      .send({ status: "asignado" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("asignado");
  });

  it("should delete a user", async () => {
    const user = await User.findOne({ email: "juan.perez@example.com" });

    const res = await request(app).delete(`/api/users/${user._id}`);

    expect(res.statusCode).toEqual(204);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull(); // El usuario ya no debe existir
  });
});
