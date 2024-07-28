import { AttributionRoleComponent } from './attribution-role/attribution-role.component';
import { ClasseComponent } from './classes/classes.component';

import { InfosDeBaseComponent } from './infos-de-base/infos-de-base.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from './departments/departments.component';
import { PostesComponent } from './postes/postes.component';
import { BanqueComponent } from './banque/banque.component';
import { RoleComponent } from './role/role.component';
import { ParametrageComponent } from './parametrage.component';
import { CategorieComponent } from './categorie/categorie.component';

import { GradesComponent } from './grades/grades.component';

const routes: Routes = [
  {
    path: '',
  component: ParametrageComponent,
  children: [

    { path: "departments", component: DepartmentsComponent },
    { path: "postes", component: PostesComponent },
    { path: "banque", component: BanqueComponent },

    { path: "role", component: RoleComponent },
    { path: "categorie", component: CategorieComponent },

    { path: "infos-de-base", component: InfosDeBaseComponent },

    { path: "classes", component: ClasseComponent },
    { path: "grades", component: GradesComponent },
    { path: "attribution-role", component: AttributionRoleComponent },
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
