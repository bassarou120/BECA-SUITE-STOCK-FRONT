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
import {FamilleComponent} from "./famille/famille.component";
import {SiteComponent} from "./site/site.component";
import {LocalisationComponent} from "./localisation/localisation.component";
import {DirectionCentreComponent} from "./directionCentre/directionCentre.component";
import {CategorieArticleComponent} from "./categorie-article/categorie-article.component";
import {ArticleComponent} from "./article/article.component";
import {FournisseurComponent} from "./fournisseur/fournisseur.component";
import { CategorieFournisseurComponent } from './categorie-fournisseur/categorie-fournisseur.component';
import {ReparationPeriodiqueComponent} from "./reparation-periodique/reparation-periodique.component";




const routes: Routes = [
  {
    path: '',
  component: ParametrageComponent,
  children: [

    { path: "departments", component: DepartmentsComponent },
    { path: "postes", component: PostesComponent },
    { path: "banque", component: BanqueComponent },
    { path: "bureau", component: BureauComponent },
    { path: "famille", component: FamilleComponent },
    { path: "site", component: SiteComponent },
    { path: "localisation", component: LocalisationComponent },
    { path: "directionCentre", component: DirectionCentreComponent },
    { path: "categorie-article", component: CategorieArticleComponent },
    { path: "article", component: ArticleComponent },
    { path: "fournisseur", component: FournisseurComponent },
    { path: "categorie-fournisseur", component: CategorieFournisseurComponent },
    { path: "reparation-periodique", component: ReparationPeriodiqueComponent },

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
