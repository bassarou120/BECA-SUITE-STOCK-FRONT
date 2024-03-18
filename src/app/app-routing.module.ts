import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./list-modules/list-modules.module').then(
        (m) => m.ListModulesModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./list-modules/auth/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
