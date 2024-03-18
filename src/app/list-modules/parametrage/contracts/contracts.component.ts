import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getconstracts, routes, ContractService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-constracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstConstracts: Array<getconstracts> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getconstracts>;
  public addContractForm!: FormGroup ;
  public editContractForm!: FormGroup;
  public deleteContractForm!: FormGroup;

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

  constructor(private data: ContractService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addContractForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editContractForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deleteContractForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstConstracts = [];
    this.serialNumberArray = [];

    this.data.getAllConstract().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getconstracts, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstConstracts.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getconstracts>(this.lstConstracts);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  saveContract() {
    console.log(this.addContractForm.value, this.addContractForm.valid);
    if (this.addContractForm.valid){
      this.data.saveContract(this.addContractForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
      console.log(this.addContractForm.value);
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    } 
  }

  getEditContract(row: any) {
    this.editContractForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editContract() {
    // console.log(this.editContractForm.value, this.editContractForm.valid);
    if (this.editContractForm.valid){
      this.data.editContract(this.editContractForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteContract(row: any) {
    this.deleteContractForm.patchValue({
      id: row.id
    })
  }

  deleteContract() {
    // console.log(this.deleteContractForm.value, this.deleteContractForm.valid);
    if (this.deleteContractForm.valid){
      this.data.deleteContract(this.deleteContractForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }






  public sortData(sort: Sort) {
    const data = this.lstConstracts.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstConstracts = data;
    } else {
      this.lstConstracts = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstConstracts = this.dataSource.filteredData;
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