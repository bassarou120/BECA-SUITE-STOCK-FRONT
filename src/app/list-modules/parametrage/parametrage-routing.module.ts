import { AttributionRoleComponent } from './attribution-role/attribution-role.component';


import { InfosDeBaseComponent } from './infos-de-base/infos-de-base.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from './departments/departments.component';
import { PostesComponent } from './postes/postes.component';
import { BanqueComponent } from './banque/banque.component';
import { RoleComponent } from './role/role.component';
import { ParametrageComponent } from './parametrage.component';
import {BureauComponent} from "./bureau/bureau.component";
import {CategorieArticleComponent} from "./categorie-article/categorie-article.component";
import {ArticleComponent} from "./article/article.component";
import {FournisseurComponent} from "./fournisseur/fournisseur.component";




const routes: Routes = [
  {
    path: '',
  component: ParametrageComponent,
  children: [

    { path: "departments", component: DepartmentsComponent },
    { path: "postes", component: PostesComponent },
    { path: "banque", component: BanqueComponent },
    { path: "bureau", component: BureauComponent },
    { path: "categorie-article", component: CategorieArticleComponent },
    { path: "article", component: ArticleComponent },
    { path: "fournisseur", component: FournisseurComponent },

    { path: "role", component: RoleComponent },


    { path: "infos-de-base", component: InfosDeBaseComponent },


    { path: "attribution-role", component: AttributionRoleComponent },
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
