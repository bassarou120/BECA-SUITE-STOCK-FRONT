import { GRHGuard, EmployeGuard } from './../../core/services/auth/guards.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
// import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'admin', component: AdminDashboardComponent, canActivate: [GRHGuard]},
      { path: 'employee', component: EmployeeDashboardComponent, canActivate: [EmployeGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
