import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordMailRoutingModule } from './passwordMail-routing.module';
import { PasswordMailComponent } from './passwordMail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PasswordMailComponent
  ],
  imports: [
    CommonModule,
    PasswordMailRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PasswordMailModule { }
