import { EmployeeService } from './../../employee.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employees: Employee[];
  tasks: Task[] = [];
  user: Employee;
  selectedEmployeeId: string;
  selectedDate: string = '';
  totalTasks: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    this.user = this.communicationService.user;

    this.route.params.subscribe((params: Params) => {
      if (params.employeeId) {
        this.selectedEmployeeId = params.employeeId;

        this.taskService
          .getTasks(params.employeeId)
          .subscribe((response: { items: Task[] }) => {
            response.items.forEach((item) => {
              item.date = item.date.split('T')[0];
            });

            this.tasks = response.items;
          });
      } else {
        this.tasks = [];

        this.taskService
          .getTasks('')
          .subscribe((response: { totalItems: string }) => {
            this.totalTasks = parseInt(response.totalItems);
          });
      }
    });

    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  onDateChange() {
    this.taskService
      .getTasksInADate(this.selectedDate)
      .subscribe((response: { totalItems: string }) => {
        this.totalTasks = parseInt(response.totalItems);
      });
  }

  onDeleteEmployeeClick() {
    this.employeeService
      .deleteEmployee(this.selectedEmployeeId)
      .subscribe((res: Employee) => {
        this.router.navigate(['/employees']);
      });
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(id).subscribe((res: Task) => {
      this.tasks = this.tasks.filter((task) => task._id !== id);
    });
  }
}
