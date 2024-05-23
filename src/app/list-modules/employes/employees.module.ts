import { LicenciementComponent } from './licenciement/licenciement.component';
import { MesHeuresSupplementairesComponent } from './mes-heures-supplementaires/mes-heures-supplementaires.component';
import { PointContratComponent } from './point-contrat/point-contrat.component';
import { PointCongeComponent } from './point-conge/point-conge.component';
import { DepartEmployeComponent } from './depart-employe/depart-employe.component';
// import { DemissionEmployeComponent } from './demission/demission-employe.component';
import { EcheanceCDDComponent } from './echeance-cdd/echeance-cdd.component';
import { MesPlaintesComponent } from './mes-plaintes/mes-plaintes.component';
import { HeuresSupplementairesComponent } from './heures_supplementaires/heures_supplementaires.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeProfileComponent } from './all-employe/employee-profile/employee-profile.component';
import { EmployeListComponent } from './all-employe/employe-list/employe-list.component';
import { EmployePageContentComponent } from './all-employe/employe-page-content/employe-page-content.component';
import { EmployeModalComponent } from './all-employe/employe-modal/employe-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveAdminComponent } from './leave-admin/leave-admin.component';
import { LeaveEmployeeComponent } from './leave-employee/leave-employee.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { DesignationsComponent } from './designations/designations.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShiftListComponent } from './shift-list/shift-list.component';


import { CongesComponent } from './conges/conges.component';
import { AbsencesComponent } from './absences/absences.component';
import { PlaintesComponent } from './plaintes/plaintes.component';
import { PreavisComponent } from './preavis/preavis.component';
import { DemandesComponent } from './demandes/demandes.component';
import { FormationsComponent } from './formations/formations.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { MesContratsComponent } from './mes-contrats/mes-contrats.component';
import { MonProfilComponent } from './mon-profile-employe/mon-profile-employe.component';
import { RetraiteComponent } from './retraite/retraite.component';


// @ts-ignore
@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeProfileComponent,
    EmployeListComponent,
    EmployePageContentComponent,
    EmployeModalComponent,
    LeaveAdminComponent,
    LeaveEmployeeComponent,
    LeaveSettingsComponent,
    AttendanceAdminComponent,
    AttendanceEmployeeComponent,
    DesignationsComponent,
    TimesheetComponent,
    OvertimeComponent,
    ShiftScheduleComponent,
    ShiftListComponent,
    CongesComponent,
    AbsencesComponent,
    PlaintesComponent,
    PreavisComponent,
    DemandesComponent,
    FormationsComponent,
    HeuresSupplementairesComponent,
    MesHeuresSupplementairesComponent,
    MesPlaintesComponent,
    ExperiencesComponent,
    DepartEmployeComponent,
    // DemissionEmployeComponent,
    EcheanceCDDComponent,
    PointCongeComponent,
    PointContratComponent,
    MesContratsComponent,
    MonProfilComponent,
    RetraiteComponent,
    LicenciementComponent,
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
