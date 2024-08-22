import { GRHGuard } from './../core/services/auth/guards.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModulesComponent } from './list-modules.component';
import { AuthService } from '../core/services/auth/auth.service';
import { fichepaieComponent } from './fichepaie/fichepaie.component';
import {EntreeStockComponent} from "./entree-stock/entree-stock.component";
import {SortieStockComponent} from "./sortie-stock/sortie-stock.component";
import {EtatStockComponent} from "./etat-stock/etat-stock.component";
import {EntreeImmoComponent} from "./entree-immo/entree-immo.component";
import {TransfertImmoComponent} from "./transfert-immo/transfert-immo.component";
import {rapportImmoComponent} from "./rapportatge-immo/rapport-immo.component";
import {rapportStockComponent} from "./rapportatge-stock/rapport-stock.component";
import {ReparationImmoComponent} from "./reparation-immo/reparation-immo.component";



const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./auth/reset-password/reset-password.module').then((m) => m.ResetpasswordModule),
  },
  {
    path: 'passwordMail',
    loadChildren: () =>
      import('./auth/passwordMail/passwordMail.module').then((m) => m.PasswordMailModule),
  },
  {
    path: '',

    component: ListModulesComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },

      {
        path: 'employes',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./employes/employees.module').then((m) => m.EmployeesModule),
      },

      {
        path: 'parametrage',
        canActivate: [AuthService, GRHGuard],
        loadChildren: () =>
          import('./parametrage/parametrage.module').then(
            (m) => m.ParametrageModule
          ),
      },

      {
        path: 'fichepaie',
        component: fichepaieComponent,
        canActivate: [GRHGuard],
      },

      {
        path: 'entree-stock',
        component: EntreeStockComponent,
        canActivate: [GRHGuard],
      },
      {
        path: 'sortie-stock',
        component: SortieStockComponent,
        canActivate: [GRHGuard],
      },
      {
        path: 'etat-stock',
        component: EtatStockComponent,
        canActivate: [GRHGuard],
      },

      {
        path: 'entree-immo',
        component: EntreeImmoComponent,
        canActivate: [GRHGuard],
      },
      {
        path: 'transfert-immo',
        component: TransfertImmoComponent,
        canActivate: [GRHGuard],
      },

      {
        path: 'repartion-immo',
        component: ReparationImmoComponent,
        canActivate: [GRHGuard],
      },


      {
        path: 'rapport-immo',
        component: rapportImmoComponent,
        canActivate: [GRHGuard],
      },
  {
        path: 'rapport-stock',
        component: rapportStockComponent,
        canActivate: [GRHGuard],
      },


      /*

      {
        path: 'leads',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./leads/leads.module').then((m) => m.LeadsModule),
      },


      {
        path: 'payroll',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./payroll/payroll.module').then((m) => m.PayrollModule),
      },

      {
        path: 'reports',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },

      {
        path: 'goals',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./crosshairs/crosshairs.module').then(
            (m) => m.CrosshairsModule
          ),
      },
      {
        path: 'training',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./training/training.module').then((m) => m.TrainingModule),
      },
      {
        path: 'promotion',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./promotion/promotion.module').then((m) => m.PromotionModule),
      },
      {
        path: 'resignation',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./resignation/resignation.module').then(
            (m) => m.ResignationModule
          ),
      },

      {
        path: 'assets',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./assets/assets.module').then((m) => m.AssetsModule),
      },

      {
        path: 'users',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'settings',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'profile',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },

      {
        path: 'pages',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'components',
        canActivate: [AuthService],
        loadChildren: () =>
          import('./components/components.module').then(
            (m) => m.ComponentsModule
          ),
      },

      */
    ],
  },

  /*
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./auth/otp/otp.module').then((m) => m.OtpModule),
  },
  {
    path: 'lock-screen',
    loadChildren: () =>
      import('./auth/lock-screen/lock-screen.module').then(
        (m) => m.LockScreenModule
      ),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./auth/error404/error404.module').then((m) => m.Error404Module),
  },
  {
    path: '500',
    loadChildren: () =>
      import('./auth/error500/error500.module').then((m) => m.Error500Module),
  },

  */

  { path: '**', redirectTo: 'admin/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListModulesRoutingModule {}
