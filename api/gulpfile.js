const gulp = require("gulp");
const mongoose = require("mongoose");
const config = require("config");
const { User } = require("./build/models/User");
const { Task } = require("./build/models/Task");

gulp.task("seed", async () => {
  const db = config.get("db");

  await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const _id1 = mongoose.Types.ObjectId();
  const manager1 = {
    _id: _id1,
    name: "manager1",
    employeeId: 1,
    password: "12345",
    isManager: true,
    reportTo: _id1,
  };

  const _id2 = mongoose.Types.ObjectId();
  const manager2 = {
    _id: _id2,
    name: "manager2",
    employeeId: 2,
    password: "12345",
    isManager: true,
    reportTo: _id2,
  };

  const _id3 = mongoose.Types.ObjectId();
  const employee1OfManager1 = {
    _id: _id3,
    name: "employee1OfManager1",
    employeeId: 3,
    password: "12345",
    isManager: false,
    reportTo: _id1,
  };

  const _id4 = mongoose.Types.ObjectId();
  const employee2OfManager1 = {
    _id: _id4,
    name: "employee2OfManager1",
    employeeId: 4,
    password: "12345",
    isManager: false,
    reportTo: _id1,
  };

  const _id5 = mongoose.Types.ObjectId();
  const employee1OfManager2 = {
    _id: _id5,
    name: "employee1OfManager2",
    employeeId: 5,
    password: "12345",
    isManager: false,
    reportTo: _id2,
  };

  const _id6 = mongoose.Types.ObjectId();
  const employee2OfManager2 = {
    _id: _id6,
    name: "employee2OfManager2",
    employeeId: 6,
    password: "12345",
    isManager: false,
    reportTo: _id2,
  };

  const task1manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1manager1",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: _id1,
  };

  const task2manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2manager1",
    date: new Date("2020-01-02"),
    status: "ongoing",
    assignee: _id1,
  };

  const task1manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1manager2",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: _id2,
  };

  const task2manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2manager2",
    date: new Date("2020-01-02"),
    status: "pending",
    assignee: _id2,
  };

  const task1employee1manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1employee1manager1",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: employee1OfManager1._id,
  };

  const task2employee1manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2employee1manager1",
    date: new Date("2020-01-02"),
    status: "ongoing",
    assignee: employee1OfManager1._id,
  };

  const task1employee2manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1employee2manager1",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: employee2OfManager1._id,
  };

  const task2employee2manager1 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2employee2manager1",
    date: new Date("2020-01-02"),
    status: "pending",
    assignee: employee2OfManager1._id,
  };

  const task1employee1manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1employee1manager2",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: employee1OfManager2._id,
  };

  const task2employee1manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2employee1manager2",
    date: new Date("2020-01-02"),
    status: "ongoing",
    assignee: employee1OfManager2._id,
  };

  const task1employee2manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task1employee2manager2",
    date: new Date("2020-01-01"),
    status: "completed",
    assignee: employee2OfManager2._id,
  };

  const task2employee2manager2 = {
    _id: mongoose.Types.ObjectId(),
    description: "task2employee2manager2",
    date: new Date("2020-01-02"),
    status: "pending",
    assignee: employee2OfManager2._id,
  };

  await User.deleteMany();
  await new User(manager1).save();
  await new User(manager2).save();
  await new User(employee1OfManager1).save();
  await new User(employee2OfManager1).save();
  await new User(employee1OfManager2).save();
  await new User(employee2OfManager2).save();

  await Task.deleteMany();
  await new Task(task1manager1).save();
  await new Task(task2manager1).save();
  await new Task(task1employee1manager1).save();
  await new Task(task2employee1manager1).save();
  await new Task(task1employee2manager1).save();
  await new Task(task2employee2manager1).save();
  await new Task(task1manager2).save();
  await new Task(task2manager2).save();
  await new Task(task1employee1manager2).save();
  await new Task(task2employee1manager2).save();
  await new Task(task1employee2manager2).save();
  await new Task(task2employee2manager2).save();
});
