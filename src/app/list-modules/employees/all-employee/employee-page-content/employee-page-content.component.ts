import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, lstEmployee, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employee-page-content.component.html',
  styleUrls: ['./employee-page-content.component.scss']
})
export class EmployeePageContentComponent {
  public routes = routes;
  selected = 'option1';
  public lstEmployee: Array<lstEmployee>;
  constructor(public router: Router, private dataservice: DataService) {
   this.lstEmployee = this.dataservice.lstEmployee

  }

  

}
