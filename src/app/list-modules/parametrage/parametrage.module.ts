import { AttributionRoleComponent } from './attribution-role/attribution-role.component';

import { InfosDeBaseComponent } from './infos-de-base/infos-de-base.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { ParametrageRoutingModule } from './parametrage-routing.module';
import {ParametrageComponent} from "./parametrage.component";

import {BureauComponent} from "./bureau/bureau.component";
import {RoleComponent} from "./role/role.component";
import {PostesComponent} from "./postes/postes.component";
import {ClasseComponent} from "./classes/classes.component";
import {GradesComponent} from "./grades/grades.component";
import {BanqueComponent} from "./banque/banque.component";
import {DepartmentsComponent} from "./departments/departments.component";
import {CategorieComponent} from "./categorie/categorie.component";

@NgModule({
  declarations: [
    ParametrageComponent,

    // TypeCongeComponent,
    // TypeContratComponent,
    // TypePrimeComponent,
    // TypeLicenciementComponent,
    DepartmentsComponent,
    PostesComponent,
    BanqueComponent,
    // TypeAbsenceComponent,
    RoleComponent,
    CategorieComponent,
    // StatutComponent,
    InfosDeBaseComponent,
    // TypeDepartComponent,
    ClasseComponent,
    GradesComponent,
    BureauComponent,
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
