import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeId: string;
  employee: Employee;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.employeeId = params.employeeId;
    });

    this.employeeService
      .getEmployee(this.employeeId)
      .subscribe((employee: Employee) => {
        this.employee = employee;
      });
  }

  updateEmployee(updatedEmployee) {
    updatedEmployee.confirmPassword = undefined;

    this.employeeService
      .updateEmployee(this.employeeId, {
        ...updatedEmployee,
        isManager: this.employee.isManager,
        reportTo: this.employee.reportTo,
      })
      .subscribe(
        (response: { user: Employee }) => {
          this.router.navigate(['/employees', this.employeeId]);
        },
        (error) => {
          this.error = error.error;
        }
      );
  }
}
