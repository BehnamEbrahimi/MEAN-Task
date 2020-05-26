import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private dataService: DataService, private router: Router) {}

  login(credentials: { employeeId: string; password: string }) {
    return this.dataService.login(credentials).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body.user._id,
          res.body.user.name,
          res.body.user.isManager,
          res.body.token
        );
      })
    );
  }

  register(user: {
    name: string;
    employeeId: number;
    password: string;
    isManager: boolean;
    reportTo: string;
  }) {
    return this.dataService.register(user).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body.user._id,
          res.body.user.name,
          res.body.user.isManager,
          res.body.token
        );
      })
    );
  }

  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return {
      _id: localStorage.getItem('_id'),
      name: localStorage.getItem('name'),
      isManager: localStorage.getItem('isManager') === 'true',
    };
  }

  private setSession(
    _id: string,
    name: string,
    isManager: string,
    token: string
  ) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('name', name);
    localStorage.setItem('isManager', isManager);
    localStorage.setItem('token', token);
  }

  private removeSession() {
    localStorage.removeItem('_id');
    localStorage.removeItem('name');
    localStorage.removeItem('isManager');
    localStorage.removeItem('token');
  }
}
