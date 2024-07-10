import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetpasswordRoutingModule } from './reset-password-routing.module';
import { ResetpasswordComponent } from './reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    ResetpasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResetpasswordModule { }
