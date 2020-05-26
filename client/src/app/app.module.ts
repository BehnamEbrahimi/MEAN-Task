import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MustMatchDirective } from './_helpers/must-match.directive';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DataInterceptor } from './data.interceptor';
import { AuthGuard } from './auth-guard.service';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewEmployeeComponent,
    NewTaskComponent,
    LoginComponent,
    RegisterComponent,
    MustMatchDirective,
    EditEmployeeComponent,
    EditTaskComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: DataInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
