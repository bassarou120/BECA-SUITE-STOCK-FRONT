import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getDepartment, routes, DepartmentService } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;


  public lstDepartment: Array<getDepartment> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getDepartment>;
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables

  constructor(public router: Router,private data: DepartmentService) {}

  ngOnInit(): void {
     this.getTableData();
  }


  private getTableData(): void {
    this.lstDepartment = [];
    this.serialNumberArray = [];

    this.data.getAllDepartment().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getDepartment, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstDepartment.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getDepartment>(this.lstDepartment);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstDepartment.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstDepartment = data;
    } else {
      this.lstDepartment = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

    saveDepartment(myForm:NgForm){
      if (!myForm.value.nom_dep) {
          console.log("Le champ nom departement est vide");
          return;
      }else{
        this.data.saveDepartement(myForm.value).subscribe(response => {
          console.log(response);
          location.reload();
        });
      }

    }

    getEditForm(row: any){
       const idInput = document.getElementById('edit_id');
       const nomdepInput = document.getElementById('edit_nom_dep');
       if (idInput && nomdepInput) {
         idInput.setAttribute('value', row.id);
         nomdepInput.setAttribute('value', row.nom_dep);
       }else{
        console.error("Les éléments du formulaire ne sont pas trouvés");
       }
    }

    editDepartment(maForm:NgForm){
      if (!maForm.value.nom_dep) {
          console.log("Le champ nom departement est vide");
          return;
      }else{
        this.data.editDepartment(1,maForm.value).subscribe(response => {
          console.log(response);
          location.reload();
        });
      }

    }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstDepartment = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
export interface pageSelection {
  skip: number;
  limit: number;
}
