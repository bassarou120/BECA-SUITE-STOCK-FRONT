import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, lstEmployee, routes } from 'src/app/core/core.index';
import {EmployeService} from "../../../../core/services/employe/employe.service";

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employe-page-content.component.html',
  styleUrls: ['./employe-page-content.component.scss']
})
export class EmployePageContentComponent {
  public routes = routes;
  selected = 'option1';
  public lstEmployee: Array<lstEmployee>;

  constructor(public router: Router, private dataservice: DataService,
             private employeservice :EmployeService) {

   this.lstEmployee = this.employeservice.lstEmployee
   // this.lstEmployee = this.dataservice.lstEmployee

  }



}
