import { GRHGuard } from './../core/services/auth/guards.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListModulesComponent } from './list-modules.component';
import { AuthService } from '../core/services/auth/auth.service';
import { fichepaieComponent } from './fichepaie/fichepaie.component';
import { ordrevirementComponent } from './ordrevirement/ordrevirement.component';

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
        path: 'ordreVirement',
        component: ordrevirementComponent,
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
