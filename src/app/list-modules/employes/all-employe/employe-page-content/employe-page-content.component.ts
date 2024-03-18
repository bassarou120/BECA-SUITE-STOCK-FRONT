import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, lstEmployee, routes } from 'src/app/core/core.index';
import { EmployeService } from '../../../../core/services/employe/employe.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employe-page-content.component.html',
  styleUrls: ['./employe-page-content.component.scss'],
})
export class EmployePageContentComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  // public lstEmployee: Array<lstEmployee>;
  public lstEmployee: Array<any> = [];

  constructor(
    public router: Router,
    private dataservice: DataService,
    private employeservice: EmployeService
  ) {
    // this.lstEmployee = this.employeservice.lstEmployee
    // this.lstEmployee = this.dataservice.lstEmployee
  }

  ngOnInit(): void {
    this.getEnmpl();
  }

  getEnmpl() {
    this.employeservice.getAllEmploye().subscribe(
      (data: any) => {
        console.log(data['data']['data']);

        this.lstEmployee = data['data'];
      },
      (error) => {}
    );
  }
}
