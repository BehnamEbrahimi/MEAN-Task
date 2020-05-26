import { EmployeeService } from 'src/app/employee.service';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Employee } from 'src/app/models/employee.model';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  assignee: string;
  taskId: string;
  task: Task;
  employees: Employee[];
  user: Employee;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private router: Router,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    this.user = this.communicationService.user;

    this.route.params.subscribe((params: Params) => {
      this.taskId = params.taskId;
      this.assignee = params.employeeId;
    });

    this.taskService.getTask(this.taskId).subscribe((task: Task) => {
      task = { ...task, date: task.date.split('T')[0] };
      this.task = task;
    });

    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  updateTask(updatedTask) {
    if (this.user.isManager) {
      this.taskService.updateTask(this.taskId, updatedTask).subscribe(
        (updatedTask: Task) => {
          this.router.navigate(['/employees', updatedTask.assignee]);
        },
        (error) => {
          this.error = error.error;
        }
      );
    } else {
      this.taskService.changeTaskStatus(this.taskId, updatedTask).subscribe(
        (updatedTask: Task) => {
          this.router.navigate(['/employees', updatedTask.assignee]);
        },
        (error) => {
          this.error = error.error;
        }
      );
    }
  }
}
