import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getExperience, routes, ExperiencesService,getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstExperiences: Array<getExperience> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getExperience>;
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

  public addExperienceForm!: FormGroup ;
  public editExperienceForm!: FormGroup
  public deleteExperienceForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: ExperiencesService) {}

  ngOnInit(): void {
     this.getTableData();
     this.addExperienceForm = this.formBuilder.group({
      employe_id: [0, [Validators.required]],
      nomStructure: ["", [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      posteOcupe: ["", [Validators.required]],
    });
     this.editExperienceForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      nomStructure: ["", [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      posteOcupe: ["", [Validators.required]],
    });
     this.deleteExperienceForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onClickSubmitAddExperience(){

      console.log(this.addExperienceForm.value)

      if (this.addExperienceForm.valid){
        this.addExperienceForm.patchValue({ date_debut: this.formatDateToString(this.addExperienceForm.value.date_debut), date_fin: this.formatDateToString(this.addExperienceForm.value.date_fin) });
        this.data.saveExperience(this.addExperienceForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }


  }

  onClickSubmitEditExperience(){
    console.log(this.editExperienceForm.value)

    this.editExperienceForm.patchValue({ date_debut: this.formatDateToString(this.editExperienceForm.value.date_debut), date_fin: this.formatDateToString(this.editExperienceForm.value.date_fin)});

      if (this.editExperienceForm.valid){
        const id = this.editExperienceForm.value.id;
        this.data.editExperience(this.editExperienceForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }
  onClickSubmitDeleteExperience(){

      if (this.deleteExperienceForm.valid){
        const id = this.deleteExperienceForm.value.id;
        this.data.deleteExperience(this.deleteExperienceForm.value).subscribe(
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
    this.editExperienceForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      nomStructure: row.nomStructure,
      date_debut: this.convertToDate(row.date_debut),
      date_fin: this.convertToDate(row.date_fin),
      posteOcupe: row.posteOcupe,
    });
    this.editFormSelectedEmployeId = row.employe_id;
 }


  getDeleteForm(row: any){
    this.deleteExperienceForm.patchValue({
     id:row.id,
    })
 }




  private getTableData(): void {
    this.lstExperiences = [];
    this.serialNumberArray = [];

    this.data.getAllExperience().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getExperience, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstExperiences.push(res);
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

      this.dataSource = new MatTableDataSource<getExperience>(this.lstExperiences);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstExperiences.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstExperiences = data;
    } else {
      this.lstExperiences = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstExperiences = this.dataSource.filteredData;
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
