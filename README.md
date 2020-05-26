# Task Manager App with MEAN stack

## Domain Logic

- Users can register, login, and logout.
- Users can have have two roles of **manager** or **employee**.
- Employees must select a manager upon registration.
- Other way to register an employee is that the corresponding manager creates employee with his/her credentials.
- Later on, employees can login to the system and change their passwords.
- Managers can do CRUD operations on their accounts and their employees' accounts.
- Employees can do CRUD operations only on their accounts.
- Managers can create tasks and assign it to one of their employees.
- Managers can re-assign a task to other employee.
- Managers cannot change the status of their employees' tasks (they can only change the status of their own tasks).
- Managers can do CRUD operation on their employees' tasks (except changing the task status).
- Managers do not have access to other managers' employees and their tasks.
- Managers can see a summary of total tasks of their team and can pick a date to filter the summary.
- Employees can login to their systems, see their tasks and change the status oof their tasks.
- By changing the task status, they appear differently:
  - Pending task -> normal.
  - Ongoing task -> bold.
  - Completed task -> line-through.
- When a user is deleted, all of his/her tasks will be deleted as well.

## Installing dependencies

```dos
git clone https://github.com/BehnamEbrahimi/MEAN-Task.git
```

```dos
cd MEAN-Task/api
```

```dos
npm i
```

```dos
cd ../client
```

```dos
npm i
```

## Connection Strings

- The connection string for the development environment is in `./api/config/default.json`, which is a free MongoDB Atlas database. Feel free to change it to a local connection string.
- The connection string for the test environment is in `./api/config/test.json`, which is also for a MongoDB Atlas database. please change it to a local connection string to run tests faster.

## Seeding Database

For seeding the database with the dummy data, I have written a `gulp task` script (`./api/gulpfile.js`). Run the following command in `./api` (make sure the gulp is installed globally on your system `npm i -g gulp`):

```dos
gulp seed
```

## Running API Server in Development

In `./api`, run

```dos
npm start
```

which compiles the TypeScript code from `src` folder to `build` folder and runs the server in watch mode using nodemon.

## Running Angular Development Server

In `./client`, run

```dos
ng serve
```

## Running Tests

In `./api`, run

```dos
npm test
```

The test results are as follows:

```
/api/tasks
    POST /
      √ should create a new task when called by a manager (9268 ms)
      √ should create a new task for the manager when called by himself (6066 ms)
      √ should return 403 when called by an employee (5385 ms)
      √ should return 401 when called anonymously (5224 ms)
      √ should return 400 when called by a manager but the assignee is not one of his employees (5607 ms)
      √ should return 400 when called by a manager but the assignee is not a valid object id (5307 ms)
      √ should return 400 when the task assignee is missing (5422 ms)
      √ should return 400 when the task description is less than 3 chars (5357 ms)
      √ should return 400 when the task date is not a valid date (5414 ms)
    GET /
      √ should list all the tasks of a manager's employees (5906 ms)
      √ should list all the tasks of an employee when called by himself (5832 ms)
      √ should list all the tasks of an employee when called by himself in a specific day (5766 ms)
      √ should list all the tasks of an employee when called by himself but by specifying another assignee (5854 ms)
      √ should list all the tasks of a manager's employees in a specific day (5813 ms)
      √ should list all the tasks of one of the manager's employees (5840 ms)
      √ should list all the tasks of one of the manager's employees in a specific day (5783 ms)
      √ should return 401 when called anonymously (5187 ms)
    GET /:id
      √ should return the details of a task when called by the manager of the task assignee (5854 ms)
      √ should return the details of a task when called by the task assignee (5734 ms)
      √ should return 403 when called by another manager (5783 ms)
      √ should return 403 when called by another employee (5840 ms)
      √ should return 404 when there is no task with the given id (5605 ms)
      √ should return 401 when called anonymously (5100 ms)
    PUT /:id
      √ should update the task when called by the manager of the task assignee (6594 ms)
      √ should change the task assignee when called by the manager of the task assignee (6217 ms)
      √ should update the task when called by the manager who is also the task assignee (6205 ms)
      √ should return 403 when called by the task assignee (5307 ms)
      √ should return 403 when called by another manager (5775 ms)
      √ should return 404 when the task id is not valid (5544 ms)
      √ should return 400 when the assignee id is not valid (6024 ms)
      √ should return 401 when called anonymously (5071 ms)
    PATCH /:id
      √ should change the task status when called by the task assignee (5767 ms)
      √ should return 404 when called by the manager of the task assignee (5552 ms)
      √ should return 404 when called by another manager (5595 ms)
      √ should return 404 when called by another employee (5835 ms)
      √ should return 400 when status is changed to something other than 'pending', 'ongoing', and 'completed' (5356 ms)
      √ should return 401 when called anonymously (5079 ms)
    DELETE /:id
      √ should delete the task when called by the manager of the task assignee (6482 ms)
      √ should delete the task when called by the manager who is also the task assignee (6452 ms)
      √ should return 403 when called by the task assignee who is not a manager (5302 ms)
      √ should return 403 when called by another manager (5836 ms)
      √ should return 404 when the task id is not valid (5527 ms)
      √ should return 401 when called anonymously (5103 ms)

/api/users
    POST /
      √ should signup a new manager (8947 ms)
      √ should signup a new employee (5918 ms)
      √ should return 400 if employeeId is already registered (5410 ms)
      √ should return 400 if the user is not a manager and the manager is (reportTo) is missing (5319 ms)
      √ should return 400 if the user is not a manager and the manager is (reportTo) is invalid (5618 ms)
      √ should return 400 if the user is not a manager and the manager is (reportTo) is not a manager (5539 ms)
      √ should return 400 if 'name' is missing (5163 ms)
      √ should return 400 if 'password' is less than 5 chars (5152 ms)
    POST /login
      √ should login an existing manager (5469 ms)
      √ should login an existing employee (5508 ms)
      √ should not login a user with wrong password (5460 ms)
    GET /me
      √ should get profile of a manager (5358 ms)
      √ should get profile of an employee (5426 ms)
      √ should return 401 if the Authorization header is not provided (5236 ms)
    GET /
      √ should list all employees of a manager (5890 ms)
      √ should return an array with one employee if the employee himself calls this endpoint (5420 ms)
      √ should return 401 when called anonymously (5092 ms)
    GET /:id
      √ should return the profile of an employee when called by his manager (5757 ms)
      √ should return the profile of an employee when called by himself (5582 ms)
      √ should return 403 when called by another manager (5572 ms)
      √ should return 403 when called by another employee (5450 ms)
      √ should return 403 when the id is not valid (5590 ms)
    PUT /:id
      √ should update the profile of an employee when called by his manager (6684 ms)
      √ should update the profile of an employee when called by himself (6542 ms)
      √ should update the profile of a manager when called by himself (6355 ms)
      √ should update the reportTo of an employee to another manager (6857 ms)
      √ should not update the reportTo of a manager to another manager (6805 ms)
      √ should return 400 when changing employeeId to what is already registered (5957 ms)
      √ should return 400 when changing isManager to false (5597 ms)
      √ should return 400 when changing isManager to true (5638 ms)
      √ should return 400 when changing reportTo to another employeeId (5586 ms)
      √ should return 400 when changing reportTo to an invalid Id (5623 ms)
      √ should return 403 when called by another manager (5609 ms)
      √ should return 403 when called by another employee (5405 ms)
      √ should return 401 when called anonymously (5147 ms)
    DELETE /:id
      √ should delete the profile of an employee and all his tasks when called by his manager (7319 ms)
      √ should delete the profile of an employee and all his tasks when called by himself (7162 ms)
      √ should delete the profile of a manager, his employees, all his tasks, and all his employees' tasks when called by himself (7608 ms)
      √ should return 403 when called by another manager (5663 ms)
      √ should return 403 when called by another employee (5384 ms)
      √ should return 401 when called anonymously (5078 ms)

Test Suites: 2 passed, 2 total
Tests:       84 passed, 84 total
Snapshots:   0 total
Time:        504.361 s
Ran all test suites.
```

## Packages

- `@hapi/joi`: to validate the users inputs to the API.
- `bcryptjs`: to hash the password before saving to the db.
- `config`: to store the configuration settings.
- `cors`: to enable CORS headers.
- `express`: to create an express server.
- `express-async-errors`: to add global error handling middleware for async errors.
- `helmet`: to add security headers for the production environment.
- `jsonwebtoken`: to enable authentication.
- `mongoose`: ODM library to talk with MongoDB.
