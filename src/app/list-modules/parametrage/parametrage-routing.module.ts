import { InfosDeBaseComponent } from './infos-de-base/infos-de-base.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeCongeComponent } from './typeConge/typeConge.component';
import { TypeContratComponent } from './typeContrat/typeContrat.component';
import { TypePrimeComponent } from './typePrime/typePrime.component';
import { DepartmentsComponent } from './departments/departments.component';
import { PostesComponent } from './postes/postes.component';
import { TypeAbsenceComponent } from './typeAbsence/typeAbsence.component';
import { RoleComponent } from './role/role.component';
import { ParametrageComponent } from './parametrage.component';
import { CategorieComponent } from './categorie/categorie.component';
import { StatutComponent } from './statut/statut.component';

const routes: Routes = [
  {
    path: '',
  component: ParametrageComponent,
  children: [
    { path: "type-conge", component: TypeCongeComponent },
    { path: "type-contrat", component: TypeContratComponent },
    { path: "type-prime", component: TypePrimeComponent },
    { path: "departments", component: DepartmentsComponent },
    { path: "postes", component: PostesComponent },
    { path: "type-absence", component: TypeAbsenceComponent },
    { path: "role", component: RoleComponent },
    { path: "categorie", component: CategorieComponent },
    { path: "statut", component: StatutComponent },
    { path: "infos-de-base", component: InfosDeBaseComponent },
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
