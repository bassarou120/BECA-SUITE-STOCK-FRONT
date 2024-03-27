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



  // pagination variables
  public pageSize = 10;
  public limit: number = this.pageSize;
  public serialNumberArray: Array<number> = [];
  //** / pagination variables

  constructor(private formBuilder: FormBuilder, public router: Router, private data: EmployeeDashboardService) {}

  ngOnInit(): void {
     this.getTableData();
  }

  
  private getTableData(): void {
 
    // this.data.getAllAbsence().subscribe((res: any) => {
    //   res.data.map((res: getAbsence, index: number) => {
    //     const serialNumber = index + 1;
    //     if (index >= this.skip && serialNumber <= this.limit) {
    //       res.id;
    //       this.lstAbsence.push(res);
    //       this.serialNumberArray.push(serialNumber);
    //     }
    //   });
    // });

  }

}

