import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService,apiResultFormat, routes, CategorieService, getCategorie } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstTabs: Array<any>=[];


  public lstCategorie: Array<getCategorie> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getCategorie>;
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

  public addCategorieForm!: FormGroup ;
  public editCategorieForm!: FormGroup
  public deleteCategorieForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: CategorieService) {}

  ngOnInit(): void {
     this.getTableData();
    this.addCategorieForm = this.formBuilder.group({
      libelle: ["", [Validators.required]],
   });
   this.editCategorieForm = this.formBuilder.group({
    id: [0, [Validators.required]],
    libelle: ["", [Validators.required]],
  });
   this.deleteCategorieForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
  }

  onClickSubmitAddCategorie(){

    console.log(this.addCategorieForm.value)

    if (this.addCategorieForm.valid){
      this.data.saveCategorie(this.addCategorieForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }


  }

  onClickSubmitEditCategorie(){

      if (this.editCategorieForm.valid){
        const id = this.editCategorieForm.value.id;
        this.data.editCategorie(this.editCategorieForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      } else {
        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  onClickSubmitDeleteCategorie(){

      if (this.deleteCategorieForm.valid){
        const id = this.deleteCategorieForm.value.id;
        this.data.deleteCategorie(this.deleteCategorieForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      } else {
        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  getEditForm(row: any){
    this.editCategorieForm.patchValue({
     id:row.id,
     libelle:row.libelle
    })
  }

  getDeleteForm(row: any){
    this.deleteCategorieForm.patchValue({
     id:row.id,
    })
  }


  private getTableData(): void {
    this.lstCategorie = [];
    this.serialNumberArray = [];

    this.data.getAllCategorie().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getCategorie, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstCategorie.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getCategorie>(this.lstCategorie);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstCategorie.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstCategorie = data;
    } else {
      this.lstCategorie = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstCategorie = this.dataSource.filteredData;
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
