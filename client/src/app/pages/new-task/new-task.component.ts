import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit {
  error: string;
  assignee: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.assignee = params['employeeId'];
    });
  }

  createTask(newTask) {
    this.taskService
      .createTask({
        ...newTask,
        assignee: this.assignee,
      })
      .subscribe(
        (newTask: Task) => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        (error) => {
          this.error = error.error;
        }
      );
  }
}
