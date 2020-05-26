import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {}

  login(user) {
    this.authService.login(user).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.communicationService.emitChange(res.body.user);

          if (res.body.user.isManager) this.router.navigate(['/employees']);
          else this.router.navigate([`/employees/${res.body.user._id}`]);
        }
      },
      (error) => {
        this.error = error.error;
      }
    );
  }
}
