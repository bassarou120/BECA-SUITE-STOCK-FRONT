import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getStatut, routes, StatutService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-statut',
  templateUrl: './statut.component.html',
  styleUrls: ['./statut.component.scss']
})
export class StatutComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstStatuts: Array<getStatut> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getStatut>;
  public addStatutForm!: FormGroup ;
  public editStatutForm!: FormGroup;
  public deleteStatutForm!: FormGroup;


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

  constructor(private data: StatutService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addStatutForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editStatutForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deleteStatutForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstStatuts = [];
    this.serialNumberArray = [];

    this.data.getAllStatuts().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getStatut, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstStatuts.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getStatut>(this.lstStatuts);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }
  
  saveStatut() {
    // console.log(this.addStatutForm.value, this.addStatutForm.valid);
    if (this.addStatutForm.valid){
      this.data.saveStatut(this.addStatutForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    } 
  }

  getEditStatut(row: any) {
    this.editStatutForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editStatut() {
    // console.log(this.editStatutForm.value, this.editStatutForm.valid);
    if (this.editStatutForm.valid){
      this.data.editStatut(this.editStatutForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteStatut(row: any) {
    this.deleteStatutForm.patchValue({
      id: row.id
    })
  }

  deleteStatut() {
    // console.log(this.deleteStatutForm.value, this.deleteStatutForm.valid);
    if (this.deleteStatutForm.valid){
      this.data.deleteStatut(this.deleteStatutForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }





  public sortData(sort: Sort) {
    const data = this.lstStatuts.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstStatuts = data;
    } else {
      this.lstStatuts = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstStatuts = this.dataSource.filteredData;
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