import { EmployeeService } from 'src/app/employee.service';
import { Employee } from './../../models/employee.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  error: string;
  managers: Employee[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    this.employeeService.getManagers().subscribe((managers: Employee[]) => {
      this.managers = managers;
    });
  }

  register(user) {
    user.confirmPassword = undefined;
    if (typeof user.isManager === 'string') user.isManager = false;

    this.authService.register(user).subscribe(
      (res: HttpResponse<any>) => {
        this.communicationService.emitChange(res.body.user);

        if (res.body.user.isManager) this.router.navigate(['/employees']);
        else this.router.navigate([`/employees/${res.body.user._id}`]);
      },
      (error) => {
        this.error = error.error;
      }
    );
  }
}
