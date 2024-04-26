import { AttributionRoleComponent } from './attribution-role/attribution-role.component';
import { ClasseComponent } from './classes/classes.component';
import { TypeDepartComponent } from './type-depart/type-depart.component';
import { InfosDeBaseComponent } from './infos-de-base/infos-de-base.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { TypeCongeComponent } from './typeConge/typeConge.component';
import { TypeContratComponent } from './typeContrat/typeContrat.component';
import { TypePrimeComponent } from './typePrime/typePrime.component';
import { DepartmentsComponent } from './departments/departments.component';
import { PostesComponent } from './postes/postes.component';
import { BanqueComponent } from './banque/banque.component';
import { TypeAbsenceComponent } from './typeAbsence/typeAbsence.component';
import { RoleComponent } from './role/role.component';
import { ParametrageRoutingModule } from './parametrage-routing.module';
import {ParametrageComponent} from "./parametrage.component";
import { CategorieComponent } from './categorie/categorie.component';
import { StatutComponent } from './statut/statut.component';
import { GradesComponent } from './grades/grades.component';

@NgModule({
  declarations: [
    ParametrageComponent,
    TypeCongeComponent,
    TypeContratComponent,
    TypePrimeComponent,
    DepartmentsComponent,
    PostesComponent,
    BanqueComponent,
    TypeAbsenceComponent,
    RoleComponent,
    CategorieComponent,
    StatutComponent,
    InfosDeBaseComponent,
    TypeDepartComponent,
    ClasseComponent,
    GradesComponent,
    AttributionRoleComponent,
  ],
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [DatePipe]
})
export class ParametrageModule { }
