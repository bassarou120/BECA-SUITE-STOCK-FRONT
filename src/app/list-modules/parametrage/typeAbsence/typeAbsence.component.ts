import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService,apiResultFormat, routes, typeAbsenceService, getTypeAbsence } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-postes',
  templateUrl: './typeAbsence.component.html',
  styleUrls: ['./typeAbsence.component.scss']
})
export class TypeAbsenceComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstTabs: Array<any>=[];


  public lstTypeAbsence: Array<getTypeAbsence> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getTypeAbsence>;
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

  public addTypeAbsenceForm!: FormGroup ;
  public editTypeAbsenceForm!: FormGroup
  public deleteTypeAbsenceForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: typeAbsenceService) {}

  ngOnInit(): void {
     this.getTableData();
    this.addTypeAbsenceForm = this.formBuilder.group({
      libelle: ["", [Validators.required]],
   });
   this.editTypeAbsenceForm = this.formBuilder.group({
    id: [0, [Validators.required]],
    libelle: ["", [Validators.required]],
  });
   this.deleteTypeAbsenceForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
  }

  onClickSubmitAddTypeAbsence(){

    console.log(this.addTypeAbsenceForm.value)

    if (this.addTypeAbsenceForm.valid){
      this.data.saveTypeAbsence(this.addTypeAbsenceForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }


  }

  onClickSubmitEditTypeAbsence(){
    console.log(this.editTypeAbsenceForm.value)

      if (this.editTypeAbsenceForm.valid){
        const id = this.editTypeAbsenceForm.value.id;
        this.data.editTypeAbsence(this.editTypeAbsenceForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  onClickSubmitDeleteTypeAbsence(){
    console.log(this.deleteTypeAbsenceForm.value)

      if (this.deleteTypeAbsenceForm.valid){
        const id = this.deleteTypeAbsenceForm.value.id;
        this.data.deleteTypeAbsence(this.deleteTypeAbsenceForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  getEditForm(row: any){
    this.editTypeAbsenceForm.patchValue({
     id:row.id,
     libelle:row.libelle
    })
  }

  getDeleteForm(row: any){
    this.deleteTypeAbsenceForm.patchValue({
     id:row.id,
    })
  }


  private getTableData(): void {
    this.lstTypeAbsence = [];
    this.serialNumberArray = [];

    this.data.getAllTypeAbsence().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getTypeAbsence, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstTypeAbsence.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getTypeAbsence>(this.lstTypeAbsence);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstTypeAbsence.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTypeAbsence = data;
    } else {
      this.lstTypeAbsence = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTypeAbsence = this.dataSource.filteredData;
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
