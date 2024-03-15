import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeProfileComponent } from './all-employe/employee-profile/employee-profile.component';
import { EmployeListComponent } from './all-employe/employe-list/employe-list.component';
import { EmployePageContentComponent } from './all-employe/employe-page-content/employe-page-content.component';
import { EmployeModalComponent } from './all-employe/employe-modal/employe-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HolidaysComponent } from './holidays/holidays.component';
import { LeaveAdminComponent } from './leave-admin/leave-admin.component';
import { LeaveEmployeeComponent } from './leave-employee/leave-employee.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { PostesComponent } from './postes/postes.component';
import { TypeAbsenceComponent } from './typeAbsence/typeAbsence.component';
import { RoleComponent } from './role/role.component';
import { ContractsComponent } from './contracts/contracts.component';
import { PremiumsComponent } from './premiums/premiums.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeProfileComponent,
    EmployeListComponent,
    EmployePageContentComponent,
    EmployeModalComponent,
    HolidaysComponent,
    LeaveAdminComponent,
    LeaveEmployeeComponent,
    LeaveSettingsComponent,
    AttendanceAdminComponent,
    AttendanceEmployeeComponent,
    DepartmentsComponent,
    DesignationsComponent,
    TimesheetComponent,
    OvertimeComponent,
    ShiftScheduleComponent,
    ShiftListComponent,
    PostesComponent,
    TypeAbsenceComponent,
    RoleComponent,
    ShiftListComponent,
    ContractsComponent,
    PremiumsComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTableModule,
    // MatSortModule,
    SharedModule

  ],
  providers: [DatePipe]
})
export class EmployeesModule { }
