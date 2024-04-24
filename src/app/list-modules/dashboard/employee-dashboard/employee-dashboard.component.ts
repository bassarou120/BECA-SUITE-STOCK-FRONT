import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { routes, EmployeeDashboardService, getTypeAbsence, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})

export class EmployeeDashboardComponent  {

  public routes = routes;
  public dashboard: any = [];
  public loggedUserId: number = 0;


  // pagination variables
  public pageSize = 10;
  public limit: number = this.pageSize;
  public serialNumberArray: Array<number> = [];
  //** / pagination variables

  constructor(private formBuilder: FormBuilder, public router: Router, private data: EmployeeDashboardService) {}

  ngOnInit(): void {
    this.getLoggedUserId();
     this.getTableData();
  }

  private getLoggedUserId() {
    const userDataString = localStorage.getItem('userDataString');
    if(userDataString) {
      const userData = JSON.parse(userDataString)
      this.loggedUserId = userData['id'];
    } else {
      console.log("erreur")
    }
  }

  private getTableData(): void {
    this.data.getDataTableauBordEmploye(this.loggedUserId).subscribe(
      (data: any) => {
        this.dashboard = data.data;
      },
      (error: any) => {}
    );
  }

}

