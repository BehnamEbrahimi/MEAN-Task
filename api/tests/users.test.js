const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../build/app");
const { User } = require("../build/models/User");
const { Task } = require("../build/models/Task");
const {
  manager1,
  manager2,
  employee1OfManager1,
  employee1OfManager2,
  tokenManager1,
  tokenManager2,
  tokenEmployee1Manager1,
  tokenEmployee2Manager1,
  setupDatabase,
} = require("./fixtures/db");

jest.setTimeout(30000);

describe("/api/users", () => {
  beforeEach(async () => {
    await setupDatabase();
  });

  describe("POST /", () => {
    it("should signup a new manager", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "12345",
          isManager: true,
        })
        .expect(201);

      const user = await User.findById(res.body.user._id);
      expect(user).not.toBeNull();

      expect(res.body).toMatchObject({
        user: {
          name: "ben",
          employeeId: 7,
          isManager: true,
        },
      });

      // Password should be hashed
      expect(user.password).not.toBe("12345");
    });

    it("should signup a new employee", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "12345",
          isManager: false,
          reportTo: manager1._id,
        })
        .expect(201);
    });

    it("should return 400 if employeeId is already registered", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 1,
          password: "12345",
          isManager: true,
        })
        .expect(400);
    });

    it("should return 400 if the user is not a manager and the manager is (reportTo) is missing", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "12345",
          isManager: false,
        })
        .expect(400);
    });

    it("should return 400 if the user is not a manager and the manager is (reportTo) is invalid", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "12345",
          isManager: false,
          reportTo: mongoose.Types.ObjectId(),
        })
        .expect(400);
    });

    it("should return 400 if the user is not a manager and the manager is (reportTo) is not a manager", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "12345",
          isManager: false,
          reportTo: employee1OfManager1._id,
        })
        .expect(400);
    });

    it("should return 400 if 'name' is missing", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          employeeId: 7,
          password: "12345",
          isManager: false,
          reportTo: manager1._id,
        })
        .expect(400);
    });

    it("should return 400 if 'password' is less than 5 chars", async () => {
      const res = await request(app.default)
        .post("/api/users")
        .send({
          name: "Ben",
          employeeId: 7,
          password: "1234",
          isManager: false,
          reportTo: manager1._id,
        })
        .expect(400);
    });
  });

  describe("POST /login", () => {
    it("should login an existing manager", async () => {
      const res = await request(app.default)
        .post("/api/users/login")
        .send({
          employeeId: manager1.employeeId,
          password: manager1.password,
        })
        .expect(200);
    });

    it("should login an existing employee", async () => {
      const res = await request(app.default)
        .post("/api/users/login")
        .send({
          employeeId: employee1OfManager1.employeeId,
          password: employee1OfManager1.password,
        })
        .expect(200);
    });

    it("should not login a user with wrong password", async () => {
      const res = await request(app.default)
        .post("/api/users/login")
        .send({
          employeeId: manager1.employeeId,
          password: "wrong_password",
        })
        .expect(400);
    });
  });

  describe("GET /me", () => {
    it("should get profile of a manager", async () => {
      const res = await request(app.default)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.name).toBe("manager1");
    });

    it("should get profile of an employee", async () => {
      const res = await request(app.default)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.name).toBe(employee1OfManager1.name.toLocaleLowerCase());
    });

    it("should return 401 if the Authorization header is not provided", async () => {
      const res = await request(app.default)
        .get("/api/users/me")
        .send()
        .expect(401);
    });
  });

  describe("GET /", () => {
    it("should list all employees of a manager", async () => {
      const res = await request(app.default)
        .get("/api/users")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.length).toBe(3);

      res.body.forEach((employee) => {
        expect(employee.reportTo).toBe(manager1._id.toHexString());
      });
    });

    it("should return an array with one employee if the employee himself calls this endpoint", async () => {
      const res = await request(app.default)
        .get("/api/users")
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.length).toBe(1);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .get("/api/users")
        .send()
        .expect(401);
    });
  });

  describe("GET /:id", () => {
    it("should return the profile of an employee when called by his manager", async () => {
      const res = await request(app.default)
        .get(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.name).toBe(employee1OfManager1.name.toLocaleLowerCase());
    });

    it("should return the profile of an employee when called by himself", async () => {
      const res = await request(app.default)
        .get(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.name).toBe(employee1OfManager1.name.toLocaleLowerCase());
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .get(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send()
        .expect(403);
    });

    it("should return 403 when called by another employee", async () => {
      const res = await request(app.default)
        .get(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send()
        .expect(403);
    });

    it("should return 403 when the id is not valid", async () => {
      const res = await request(app.default)
        .get(`/api/users/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(403);
    });
  });

  describe("PUT /:id", () => {
    it("should update the profile of an employee when called by his manager", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: "employee1OfManager1Modified",
          employeeId: employee1OfManager1.employeeId,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(200);

      expect(res.body.name).toBe("employee1ofmanager1modified");
    });

    it("should update the profile of an employee when called by himself", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send({
          name: "employee1OfManager1Modified",
          employeeId: employee1OfManager1.employeeId,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(200);

      expect(res.body.name).toBe("employee1ofmanager1modified");
    });

    it("should update the profile of a manager when called by himself", async () => {
      const res = await request(app.default)
        .put(`/api/users/${manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: "manager1Modified",
          employeeId: manager1.employeeId,
          password: manager1.password,
          isManager: manager1.isManager,
          reportTo: manager1.reportTo,
        })
        .expect(200);

      expect(res.body.name).toBe("manager1modified");
    });

    it("should update the reportTo of an employee to another manager", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: employee1OfManager1.name,
          employeeId: employee1OfManager1.employeeId,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: manager2._id,
        })
        .expect(200);

      expect(res.body.reportTo).toBe(manager2._id.toHexString());
    });

    it("should not update the reportTo of a manager to another manager", async () => {
      const res = await request(app.default)
        .put(`/api/users/${manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: manager1.name,
          employeeId: manager1.employeeId,
          password: manager1.password,
          isManager: manager1.isManager,
          reportTo: manager2._id,
        })
        .expect(200);

      expect(res.body.reportTo).toBe(manager1._id.toHexString());
    });

    it("should return 400 when changing employeeId to what is already registered", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: employee1OfManager1.name,
          employeeId: 6,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(400);
    });

    it("should return 400 when changing isManager to false", async () => {
      const res = await request(app.default)
        .put(`/api/users/${manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: manager1.name,
          employeeId: manager1._id,
          password: manager1.password,
          isManager: !manager1.isManager,
          reportTo: manager1.reportTo,
        })
        .expect(400);
    });

    it("should return 400 when changing isManager to true", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: employee1OfManager1.name,
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: !employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(400);
    });

    it("should return 400 when changing reportTo to another employeeId", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: employee1OfManager1.name,
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager2._id,
        })
        .expect(400);
    });

    it("should return 400 when changing reportTo to an invalid Id", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          name: employee1OfManager1.name,
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: mongoose.Types.ObjectId(),
        })
        .expect(400);
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send({
          name: "employee1OfManager1Modified",
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(403);
    });

    it("should return 403 when called by another employee", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send({
          name: "employee1OfManager1Modified",
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(403);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .put(`/api/users/${employee1OfManager1._id}`)
        .send({
          name: "employee1OfManager1Modified",
          employeeId: employee1OfManager1._id,
          password: employee1OfManager1.password,
          isManager: employee1OfManager1.isManager,
          reportTo: employee1OfManager1.reportTo,
        })
        .expect(401);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete the profile of an employee and all his tasks when called by his manager", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      const userInDb = await User.findById(employee1OfManager1._id);
      const usersNo = await User.find().count();
      const userTasks = await Task.find({ assignee: employee1OfManager1._id });
      const tasksNo = await Task.find().count();

      expect(userInDb).toBeNull();
      expect(usersNo).toBe(5);
      expect(userTasks.length).toBe(0);
      expect(tasksNo).toBe(10);
    });

    it("should delete the profile of an employee and all his tasks when called by himself", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      const userInDb = await User.findById(employee1OfManager1._id);
      const usersNo = await User.find().count();
      const userTasks = await Task.find({ assignee: employee1OfManager1._id });
      const tasksNo = await Task.find().count();

      expect(userInDb).toBeNull();
      expect(usersNo).toBe(5);
      expect(userTasks.length).toBe(0);
      expect(tasksNo).toBe(10);
    });

    it("should delete the profile of a manager, his employees, all his tasks, and all his employees' tasks when called by himself", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      const userInDb = await User.findById(manager1._id);
      const usersNo = await User.find().count();
      const userTasks = await Task.find({ assignee: manager1._id });
      const tasksNo = await Task.find().count();

      expect(userInDb).toBeNull();
      expect(usersNo).toBe(3);
      expect(userTasks.length).toBe(0);
      expect(tasksNo).toBe(6);
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send()
        .expect(403);
    });

    it("should return 403 when called by another employee", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send()
        .expect(403);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .delete(`/api/users/${employee1OfManager1._id}`)
        .send()
        .expect(401);
    });
  });
});
