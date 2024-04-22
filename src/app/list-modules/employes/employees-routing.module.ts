import { GRHGuard, EmployeGuard } from './../../core/services/auth/guards.service';
import { PointContratComponent } from './point-contrat/point-contrat.component';
import { PointCongeComponent } from './point-conge/point-conge.component';
import { DepartEmployeComponent } from './depart-employe/depart-employe.component';
import { MesPlaintesComponent } from './mes-plaintes/mes-plaintes.component';
import { HeuresSupplementairesComponent } from './heures_supplementaires/heures_supplementaires.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeListComponent } from './all-employe/employe-list/employe-list.component';
import { EmployePageContentComponent } from './all-employe/employe-page-content/employe-page-content.component';
import { EmployeeProfileComponent } from './all-employe/employee-profile/employee-profile.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { DesignationsComponent } from './designations/designations.component';
import { EmployeesComponent } from './employees.component';
import { LeaveAdminComponent } from './leave-admin/leave-admin.component';
import { LeaveEmployeeComponent } from './leave-employee/leave-employee.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

import { CongesComponent } from './conges/conges.component';
import { AbsencesComponent } from './absences/absences.component';
import { PlaintesComponent } from './plaintes/plaintes.component';
import { DemandesComponent } from './demandes/demandes.component';
import { FormationsComponent } from './formations/formations.component';
import { ExperiencesComponent } from './experiences/experiences.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      { path: 'employe-list', component: EmployeListComponent },
      { path: 'employe-page', component: EmployePageContentComponent, canActivate: [GRHGuard] },
      { path: 'employe-profile/:id', component: EmployeeProfileComponent, canActivate: [GRHGuard] },
      // { path: 'leave-admin', component: LeaveAdminComponent },
      // { path: 'leave-employee', component: LeaveEmployeeComponent },
      // { path: 'leave-settings', component: LeaveSettingsComponent },
      // { path: 'attendance-admin', component: AttendanceAdminComponent },
      // { path: 'attendance-employee', component: AttendanceEmployeeComponent },
      // { path: 'designations', component: DesignationsComponent },
      // { path: 'timesheet', component: TimesheetComponent },
      // { path: 'overtime', component: OvertimeComponent },
      // { path: 'shift-schedule', component: ShiftScheduleComponent },
      // { path: 'shift-list', component: ShiftListComponent },
      { path: "demandes", component: DemandesComponent, canActivate: [EmployeGuard] },
      { path: "mes-plaintes", component: MesPlaintesComponent, canActivate: [EmployeGuard] },
      { path: 'conges', component: CongesComponent, canActivate: [GRHGuard] },
      { path: 'absences', component: AbsencesComponent, canActivate: [GRHGuard] },
      { path: "plaintes", component: PlaintesComponent, canActivate: [GRHGuard] },
      { path: "formations", component: FormationsComponent, canActivate: [GRHGuard] },
      { path: "heures-supplementaires", component: HeuresSupplementairesComponent, canActivate: [GRHGuard] },
      { path: "experiences", component: ExperiencesComponent, canActivate: [GRHGuard] },
      { path: "depart-employe", component: DepartEmployeComponent, canActivate: [GRHGuard] },
      { path: "point-conge", component: PointCongeComponent, canActivate: [GRHGuard] },
      { path: "point-contrat", component: PointContratComponent, canActivate: [GRHGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
