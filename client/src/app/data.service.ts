import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:5000/api';
  }

  get(resource: string) {
    return this.http.get(`${this.ROOT_URL}/${resource}`);
  }

  post(resource: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${resource}`, payload);
  }

  put(resource: string, payload: Object) {
    return this.http.put(`${this.ROOT_URL}/${resource}`, payload);
  }

  patch(resource: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${resource}`, payload);
  }

  delete(resource: string) {
    return this.http.delete(`${this.ROOT_URL}/${resource}`);
  }

  login(credentials: { employeeId: string; password: string }) {
    return this.http.post(`${this.ROOT_URL}/users/login`, credentials, {
      observe: 'response',
    });
  }

  register(newUser: {
    name: string;
    employeeId: number;
    password: string;
    isManager: boolean;
    reportTo: string;
  }) {
    return this.http.post(`${this.ROOT_URL}/users`, newUser, {
      observe: 'response',
    });
  }
}
