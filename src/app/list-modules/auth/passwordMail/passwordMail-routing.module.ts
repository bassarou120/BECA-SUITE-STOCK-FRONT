import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordMailComponent } from './passwordMail.component';

const routes: Routes = [{ path: '', component: PasswordMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordMailRoutingModule { }
