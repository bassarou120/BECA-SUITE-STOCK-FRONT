import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getFormation, routes, FormationsService,getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstFormations: Array<getFormation> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getFormation>;
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

  public addFormationForm!: FormGroup ;
  public editFormationForm!: FormGroup
  public deleteFormationForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: FormationsService) {}

  ngOnInit(): void {
     this.getTableData();
     this.addFormationForm = this.formBuilder.group({
      employe_id: [0, [Validators.required]],
      intitule: ["", [Validators.required]],
      domaine: ["", [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      diplome: ["", [Validators.required]],
    });
     this.editFormationForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      intitule: ["", [Validators.required]],
      domaine: ["", [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      diplome: ["", [Validators.required]],
    });
     this.deleteFormationForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onClickSubmitAddFormation(){

      console.log(this.addFormationForm.value)

      if (this.addFormationForm.valid){
        this.addFormationForm.patchValue({ date_debut: this.formatDateToString(this.addFormationForm.value.date_debut), date_fin: this.formatDateToString(this.addFormationForm.value.date_fin) });
        this.data.saveFormation(this.addFormationForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }


  }

  onClickSubmitEditFormation(){
    console.log(this.editFormationForm.value)

    this.editFormationForm.patchValue({ date_debut: this.formatDateToString(this.editFormationForm.value.date_debut), date_fin: this.formatDateToString(this.editFormationForm.value.date_fin)});

      if (this.editFormationForm.valid){
        const id = this.editFormationForm.value.id;
        this.data.editFormation(this.editFormationForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }
  onClickSubmitDeleteFormation(){

      if (this.deleteFormationForm.valid){
        const id = this.deleteFormationForm.value.id;
        this.data.deleteFormation(this.deleteFormationForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }


  getEditForm(row: any){
    this.editFormationForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      intitule: row.intitule,
      domaine: row.domaine,
      date_debut: this.convertToDate(row.date_debut),
      date_fin: this.convertToDate(row.date_fin),
      diplome: row.diplome,
      employe: row.employe,
    });
    this.editFormSelectedEmployeId = row.employe_id;
 }

  getDeleteForm(row: any){
    this.deleteFormationForm.patchValue({
     id:row.id,
    })
 }




  private getTableData(): void {
    this.lstFormations = [];
    this.serialNumberArray = [];

    this.data.getAllFormation().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getFormation, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstFormations.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getAllEmployes().subscribe((res: any) => {
        res.data.map((res: getMiniTemplateEmploye, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstEmploye.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      });

      this.dataSource = new MatTableDataSource<getFormation>(this.lstFormations);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstFormations.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstFormations = data;
    } else {
      this.lstFormations = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstFormations = this.dataSource.filteredData;
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
