import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private dataService: DataService) {}

  getTasks(employeeId: string) {
    return this.dataService.get(`tasks?assignee=${employeeId}`);
  }

  getTasksInADate(date: string) {
    return this.dataService.get(`tasks?date=${date}`);
  }

  getTask(taskId: string) {
    return this.dataService.get(`tasks/${taskId}`);
  }

  deleteTask(taskId: string) {
    return this.dataService.delete(`tasks/${taskId}`);
  }

  createTask(task: { description: string; date: string; assignee: string }) {
    return this.dataService.post('tasks', task);
  }

  updateTask(
    taskId: string,
    task: { description: string; date: string; assignee: string }
  ) {
    return this.dataService.put(`tasks/${taskId}`, task);
  }

  changeTaskStatus(taskId: string, task: { status: string }) {
    return this.dataService.patch(`tasks/${taskId}`, task);
  }
}
