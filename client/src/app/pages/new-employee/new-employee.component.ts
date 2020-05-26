import { Employee } from './../../models/employee.model';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/employee.service';
import { Router } from '@angular/router';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit {
  error: string;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {}

  createEmployee(newEmployee) {
    newEmployee.confirmPassword = undefined;

    this.employeeService
      .createEmployee({
        ...newEmployee,
        isManager: false,
        reportTo: this.communicationService.user._id,
      })
      .subscribe(
        (response: { user: Employee }) => {
          this.router.navigate(['/employees', response.user._id]);
        },
        (error) => {
          this.error = error.error;
        }
      );
  }
}
