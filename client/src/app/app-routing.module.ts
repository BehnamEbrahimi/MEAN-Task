import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { LoginComponent } from './pages/login/login.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'new-employee',
    component: NewEmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-employee/:employeeId',
    component: EditEmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/new-task',
    component: NewTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees/:employeeId/edit-task/:taskId',
    component: EditTaskComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
