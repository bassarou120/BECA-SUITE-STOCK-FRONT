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

const routes: Routes = [
  {
    path: '',
  component: EmployeesComponent,
  children: [
    { path: "employee-list", component: EmployeListComponent },
    { path: "employee-page", component: EmployePageContentComponent },
    { path: "employee-profile", component: EmployeeProfileComponent },
    { path: "leave-admin", component: LeaveAdminComponent },
    { path: "leave-employee", component: LeaveEmployeeComponent },
    { path: "leave-settings", component: LeaveSettingsComponent },
    { path: "attendance-admin", component: AttendanceAdminComponent },
    { path: "attendance-employee", component: AttendanceEmployeeComponent },
    { path: "designations", component: DesignationsComponent },
    { path: "timesheet", component: TimesheetComponent },
    { path: "overtime", component: OvertimeComponent },
    { path: "shift-schedule", component: ShiftScheduleComponent },
    { path: "shift-list", component: ShiftListComponent },
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
