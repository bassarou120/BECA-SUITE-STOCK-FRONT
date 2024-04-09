import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { getInfoDeBase, routes, InfosDeBaseService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-infos-de-base',
  templateUrl: './infos-de-base.component.html',
  styleUrls: ['./infos-de-base.component.scss']
})
export class InfosDeBaseComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstInfosDeBase: Array<getInfoDeBase> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getInfoDeBase>;
  public addInfoDeBaseForm!: FormGroup ;
  public editInfoDeBaseForm!: FormGroup;
  public deleteInfoDeBaseForm!: FormGroup;


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

  constructor(private data: InfosDeBaseService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addInfoDeBaseForm = this.formBuilder.group({
      cle: ['', Validators.required],
      valeur: ['', Validators.required],
    }, { validator: this.cleValidator });
    this.editInfoDeBaseForm = this.formBuilder.group({
      id: [0, Validators.required],
      cle: ['', Validators.required],
      valeur: ['', Validators.required],
    }, { validator: this.cleValidator });
    this.deleteInfoDeBaseForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private cleValidator(group: FormGroup) {
    const cle = group.get('cle');
    if (!cle) {
      return null;
    }
    const cleValue = cle.value;
    const regex = /^[A-Za-z_][A-Za-z0-9_]*$/;
    if (!regex.test(cleValue)) {
      return { cleInvalid: true };
    }
    return null;
  }

  private getTableData(): void {
    this.lstInfosDeBase = [];
    this.serialNumberArray = [];

    this.data.getAllInfoDeBases().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getInfoDeBase, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstInfosDeBase.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getInfoDeBase>(this.lstInfosDeBase);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  saveInfoDeBase() {

    if (this.addInfoDeBaseForm.valid){
      this.data.saveInfoDeBase(this.addInfoDeBaseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getEditInfoDeBase(row: any) {
    this.editInfoDeBaseForm.patchValue({
      id: row.id,
      cle: row.cle,
      valeur: row.valeur,
    })
  }

  editInfoDeBase() {

    if (this.editInfoDeBaseForm.valid){
      this.data.editInfoDeBase(this.editInfoDeBaseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteInfoDeBase(row: any) {
    this.deleteInfoDeBaseForm.patchValue({
      id: row.id
    })
  }

  deleteInfoDeBase() {

    if (this.deleteInfoDeBaseForm.valid){
      this.data.deleteInfoDeBase(this.deleteInfoDeBaseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }





  public sortData(sort: Sort) {
    const data = this.lstInfosDeBase.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstInfosDeBase = data;
    } else {
      this.lstInfosDeBase = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstInfosDeBase = this.dataSource.filteredData;
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
