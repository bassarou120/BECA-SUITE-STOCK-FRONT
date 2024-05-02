import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../shared/sharedIndex';
import { ListModulesRoutingModule } from './list-modules-routing.module';
import { SideMenuOneComponent } from './common/side_menus/side-menu-one/side-menu-one.component';
import { SideMenuTwoComponent } from './common/side_menus/side-menu-two/side-menu-two.component';
import { HeaderOneComponent } from './common/headers/header-one/header-one.component';
import { SideMenuThreeComponent } from './common/side_menus/side-menu-three/side-menu-three.component';
import { SettingsMenuComponent } from './common/settings-menu/settings-menu.component';
import { HeaderTwoComponent } from './common/headers/header-two/header-two.component';
import { HeaderThreeComponent } from './common/headers/header-three/header-three.component';
import { RouterModule } from '@angular/router';
import { ListModulesComponent } from './list-modules.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fichepaieComponent } from './fichepaie/fichepaie.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// @ts-ignore
@NgModule({
  declarations: [
    ListModulesComponent,
    SideMenuOneComponent,
    SideMenuTwoComponent,
    HeaderOneComponent,
    SideMenuThreeComponent,
    SettingsMenuComponent,
    HeaderTwoComponent,
    HeaderThreeComponent,
    fichepaieComponent,
  ],
  imports: [
    CommonModule,
    ListModulesRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  providers: [DatePipe],
})
export class ListModulesModule {}
