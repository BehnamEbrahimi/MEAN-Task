import { DataService } from './data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private dataService: DataService) {}

  getEmployees() {
    return this.dataService.get('users');
  }

  getManagers() {
    return this.dataService.get('users/managers');
  }

  createEmployee(employee: {
    name: string;
    employeeId: number;
    password: string;
    isManager: boolean;
    reportTo: string;
  }) {
    return this.dataService.post('users', employee);
  }

  deleteEmployee(id: string) {
    return this.dataService.delete(`users/${id}`);
  }

  getEmployee(id: string) {
    return this.dataService.get(`users/${id}`);
  }

  updateEmployee(
    id: string,
    employee: {
      name: string;
      employeeId: number;
      password: string;
      isManager: boolean;
      reportTo: string;
    }
  ) {
    return this.dataService.put(`users/${id}`, employee);
  }
}
