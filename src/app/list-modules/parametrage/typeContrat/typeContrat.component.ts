import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getTypeContrat, routes, TypeContratService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-typeContrat',
  templateUrl: './typeContrat.component.html',
  styleUrls: ['./typeContrat.component.scss']
})
export class TypeContratComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstTypeContrats: Array<getTypeContrat> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getTypeContrat>;
  public addTypeContratForm!: FormGroup ;
  public editTypeContratForm!: FormGroup;
  public deleteTypeContratForm!: FormGroup;

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

  constructor(private data: TypeContratService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addTypeContratForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editTypeContratForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deleteTypeContratForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstTypeContrats = [];
    this.serialNumberArray = [];

    this.data.getAllTypeContrat().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getTypeContrat, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstTypeContrats.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getTypeContrat>(this.lstTypeContrats);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  saveTypeContrat() {
    // console.log(this.addTypeContratForm.value, this.addTypeContratForm.valid);
    if (this.addTypeContratForm.valid){
      this.data.saveTypeContrat(this.addTypeContratForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
      console.log(this.addTypeContratForm.value);
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    } 
  }

  getEditTypeContrat(row: any) {
    this.editTypeContratForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editTypeContrat() {
    // console.log(this.editTypeContratForm.value, this.editTypeContratForm.valid);
    if (this.editTypeContratForm.valid){
      this.data.editTypeContrat(this.editTypeContratForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteTypeContrat(row: any) {
    this.deleteTypeContratForm.patchValue({
      id: row.id
    })
  }

  deleteTypeContrat() {
    // console.log(this.deleteTypeContratForm.value, this.deleteTypeContratForm.valid);
    if (this.deleteTypeContratForm.valid){
      this.data.deleteTypeContrat(this.deleteTypeContratForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }






  public sortData(sort: Sort) {
    const data = this.lstTypeContrats.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTypeContrats = data;
    } else {
      this.lstTypeContrats = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTypeContrats = this.dataSource.filteredData;
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