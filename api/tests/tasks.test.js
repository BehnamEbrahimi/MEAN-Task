const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../build/app");
const { User } = require("../build/models/User");
const { Task } = require("../build/models/Task");
const {
  manager1,
  employee1OfManager1,
  employee2OfManager1,
  employee1OfManager2,
  task1manager1,
  task1employee1manager1,
  tokenManager1,
  tokenManager2,
  tokenEmployee1Manager1,
  tokenEmployee2Manager1,
  setupDatabase,
} = require("./fixtures/db");

jest.setTimeout(30000);

describe("/api/tasks", () => {
  beforeEach(async () => {
    await setupDatabase();
  });

  describe("POST /", () => {
    it("should create a new task when called by a manager", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(200);

      const task = await Task.findById(res.body._id);
      expect(task).not.toBeNull();

      expect(res.body).toMatchObject({
        description: "task3employee1manager1",
        date: "2020-01-03T00:00:00.000Z",
        status: "pending",
        assignee: employee1OfManager1._id.toHexString(),
      });
    });

    it("should create a new task for the manager when called by himself", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3manager1",
          date: "2020-01-03",
          assignee: manager1._id,
        })
        .expect(200);

      const task = await Task.findById(res.body._id);
      expect(task).not.toBeNull();

      expect(res.body).toMatchObject({
        description: "task3manager1",
        date: "2020-01-03T00:00:00.000Z",
        status: "pending",
        assignee: manager1._id.toHexString(),
      });
    });

    it("should return 403 when called by an employee", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(403);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(401);
    });

    it("should return 400 when called by a manager but the assignee is not one of his employees", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(400);
    });

    it("should return 400 when called by a manager but the assignee is not a valid object id", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
          assignee: "1",
        })
        .expect(400);
    });

    it("should return 400 when the task assignee is missing", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3employee1manager1",
          date: "2020-01-03",
        })
        .expect(400);
    });

    it("should return 400 when the task description is less than 3 chars", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "3",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(400);
    });

    it("should return 400 when the task date is not a valid date", async () => {
      const res = await request(app.default)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3employee1manager1",
          date: "A",
          assignee: employee1OfManager1._id,
        })
        .expect(400);
    });
  });

  describe("GET /", () => {
    it("should list all the tasks of a manager's employees", async () => {
      const res = await request(app.default)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(6);
      expect(res.body.totalItems).toBe(6);

      res.body.items.forEach((task) => {
        expect(task.assignee.reportTo).toBe(manager1._id.toHexString());
      });
    });

    it("should list all the tasks of an employee when called by himself", async () => {
      const res = await request(app.default)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);

      res.body.items.forEach((task) => {
        expect(task.assignee._id).toBe(employee1OfManager1._id.toHexString());
      });
    });

    it("should list all the tasks of an employee when called by himself in a specific day", async () => {
      const res = await request(app.default)
        .get("/api/tasks?date=2020-01-01")
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);

      res.body.items.forEach((task) => {
        expect(task.assignee._id).toBe(employee1OfManager1._id.toHexString());
      });
    });

    it("should list all the tasks of an employee when called by himself but by specifying another assignee", async () => {
      const res = await request(app.default)
        .get(`/api/tasks?assignee=${employee1OfManager2._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);

      res.body.items.forEach((task) => {
        expect(task.assignee._id).toBe(employee1OfManager1._id.toHexString());
      });
    });

    it("should list all the tasks of a manager's employees in a specific day", async () => {
      const res = await request(app.default)
        .get("/api/tasks?date=2020-01-01")
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(3);
      expect(res.body.totalItems).toBe(3);

      res.body.items.forEach((task) => {
        expect(task.assignee.reportTo).toBe(manager1._id.toHexString());
      });
    });

    it("should list all the tasks of one of the manager's employees", async () => {
      const res = await request(app.default)
        .get(`/api/tasks?assignee=${employee1OfManager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);

      res.body.items.forEach((task) => {
        expect(task.assignee._id).toBe(employee1OfManager1._id.toHexString());
      });
    });

    it("should list all the tasks of one of the manager's employees in a specific day", async () => {
      const res = await request(app.default)
        .get(`/api/tasks?assignee=${employee1OfManager1._id}&date=2020-01-01`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);

      res.body.items.forEach((task) => {
        expect(task.assignee._id).toBe(employee1OfManager1._id.toHexString());
      });
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .get("/api/tasks")
        .send()
        .expect(401);
    });
  });

  describe("GET /:id", () => {
    it("should return the details of a task when called by the manager of the task assignee", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      expect(res.body.description).toBe(task1employee1manager1.description);
    });

    it("should return the details of a task when called by the task assignee", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(200);

      expect(res.body.description).toBe(task1employee1manager1.description);
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send()
        .expect(403);
    });

    it("should return 403 when called by another employee", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send()
        .expect(403);
    });

    it("should return 404 when there is no task with the given id", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(404);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .get(`/api/tasks/${task1employee1manager1._id}`)
        .send()
        .expect(401);
    });
  });

  describe("PUT /:id", () => {
    it("should update the task when called by the manager of the task assignee", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task1employee1manager1modified",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(200);

      expect(res.body).toMatchObject({
        description: "task1employee1manager1modified",
        date: "2020-01-03T00:00:00.000Z",
        status: "completed",
        assignee: employee1OfManager1._id.toHexString(),
      });
    });

    it("should change the task assignee when called by the manager of the task assignee", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task3employee2manager1",
          date: "2020-01-03",
          assignee: employee2OfManager1._id,
        })
        .expect(200);

      expect(res.body).toMatchObject({
        description: "task3employee2manager1",
        date: "2020-01-03T00:00:00.000Z",
        status: "completed",
        assignee: employee2OfManager1._id.toHexString(),
      });
    });

    it("should update the task when called by the manager who is also the task assignee", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task1manager1modified",
          date: "2020-01-03",
          assignee: manager1._id,
        })
        .expect(200);

      expect(res.body).toMatchObject({
        description: "task1manager1modified",
        date: "2020-01-03T00:00:00.000Z",
        status: "completed",
        assignee: manager1._id.toHexString(),
      });
    });

    it("should return 403 when called by the task assignee", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send({
          description: "task1employee1manager1modified",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(403);
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send({
          description: "task1employee1manager1modified",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(403);
    });

    it("should return 404 when the task id is not valid", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "modified",
          date: "2020-01-01",
          assignee: employee1OfManager1._id,
        })
        .expect(404);
    });

    it("should return 400 when the assignee id is not valid", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          description: "task1employee1manager1modified",
          date: "2020-01-03",
          assignee: mongoose.Types.ObjectId(),
        })
        .expect(400);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .put(`/api/tasks/${task1employee1manager1._id}`)
        .send({
          description: "task1employee1manager1modified",
          date: "2020-01-03",
          assignee: employee1OfManager1._id,
        })
        .expect(401);
    });
  });

  describe("PATCH /:id", () => {
    it("should change the task status when called by the task assignee", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send({
          status: "ongoing",
        })
        .expect(200);

      expect(res.body).toMatchObject({
        description: "task1employee1manager1",
        date: "2020-01-01T00:00:00.000Z",
        status: "ongoing",
        assignee: employee1OfManager1._id.toHexString(),
      });
    });

    it("should return 404 when called by the manager of the task assignee", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send({
          status: "ongoing",
        })
        .expect(404);
    });

    it("should return 404 when called by another manager", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send({
          status: "ongoing",
        })
        .expect(404);
    });

    it("should return 404 when called by another employee", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send({
          status: "ongoing",
        })
        .expect(404);
    });

    it("should return 400 when status is changed to something other than 'pending', 'ongoing', and 'completed'", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee2Manager1}`)
        .send({
          status: "waiting",
        })
        .expect(400);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .patch(`/api/tasks/${task1employee1manager1._id}`)
        .send({
          status: "ongoing",
        })
        .expect(401);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete the task when called by the manager of the task assignee", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      const taskInDb = await Task.findById(task1employee1manager1._id);
      const tasksNo = await Task.find().count();

      expect(taskInDb).toBeNull();
      expect(tasksNo).toBe(11);
    });

    it("should delete the task when called by the manager who is also the task assignee", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${task1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(200);

      const taskInDb = await Task.findById(task1manager1._id);
      const tasksNo = await Task.find().count();

      expect(taskInDb).toBeNull();
      expect(tasksNo).toBe(11);
    });

    it("should return 403 when called by the task assignee who is not a manager", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenEmployee1Manager1}`)
        .send()
        .expect(403);
    });

    it("should return 403 when called by another manager", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${task1employee1manager1._id}`)
        .set("Authorization", `Bearer ${tokenManager2}`)
        .send()
        .expect(403);
    });

    it("should return 404 when the task id is not valid", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${tokenManager1}`)
        .send()
        .expect(404);
    });

    it("should return 401 when called anonymously", async () => {
      const res = await request(app.default)
        .delete(`/api/tasks/${task1employee1manager1._id}`)
        .send()
        .expect(401);
    });
  });
});
