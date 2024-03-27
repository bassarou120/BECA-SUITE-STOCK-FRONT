import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getAbsence, getStatut, routes, AbsencesService, getTypeAbsence, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {environment} from "../../../../environments/environment";



@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.scss']
})
export class AbsencesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;

  public default_status_id: number = environment.default_statut_id_for_demands;

  public lstAbsence: Array<getAbsence> = [];
  public lstStatus: Array<getStatut> = [];
  public lstTypeAbsence: Array<getTypeAbsence> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedTypeAbsenceId: number = 0;
  public editFormSelectedEmployeId: number = 0;
  public editFormSelectedStatutId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getAbsence>;
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

  public addAbsenceForm!: FormGroup ;
  public editAbsenceForm!: FormGroup
  public deleteAbsenceForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: AbsencesService) {}

  ngOnInit(): void {
     this.getTableData();

     this.addAbsenceForm = this.formBuilder.group({
      type_absence_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      status_id: [this.default_status_id, [Validators.required]],
    }, { validator: this.datesValidator });

     this.editAbsenceForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      type_absence_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      status_id: [this.default_status_id, [Validators.required]],
    }, { validator: this.datesValidator });
    
     this.deleteAbsenceForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  private datesValidator(group: FormGroup) {
    const startDateControl = group.get('date_debut');
    const endDateControl = group.get('date_fin');
    if (!startDateControl || !endDateControl) {
      return null;
    }
    const startDate = startDateControl.value;
    const endDate = endDateControl.value;
    if (startDate && endDate && startDate > endDate) {
      return { datesInvalid: true };
    }
    return null;
  }


  
  private getTableData(): void {
    this.lstAbsence = [];
    this.serialNumberArray = [];
 
    this.data.getAllAbsence().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getAbsence, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstAbsence.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getAllTypeAbsences().subscribe((res: any) => {
        res.data.data.map((res: getTypeAbsence, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstTypeAbsence.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
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

      this.data.getAllStatuts().subscribe((res: any) => {
        res.data.data.map((res: getStatut, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstStatus.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      });

      this.dataSource = new MatTableDataSource<getAbsence>(this.lstAbsence);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  
  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddAbsence(){

    if (this.addAbsenceForm.valid){
      this.addAbsenceForm.patchValue({ date_debut: this.formatDateToString(this.addAbsenceForm.value.date_debut) });
      this.addAbsenceForm.patchValue({ date_fin: this.formatDateToString(this.addAbsenceForm.value.date_fin) });

      this.data.saveAbsence(this.addAbsenceForm.value).subscribe(
        (data: any) => {
          location.reload();
        }
      );
    }else {
      console.log("Désolé le formulaire n'est pas bien renseigné")
    }
  }

  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }

  getEditForm(row: any){
    this.editAbsenceForm.patchValue({
      id: row.id,
      type_absence_id: row.type_absence_id,
      employe_id: row.employe_id,
      date_debut: this.convertToDate(row.date_debut),
      date_fin: this.convertToDate(row.date_fin),
      status_id: row.status_id,
    })
    this.editFormSelectedTypeAbsenceId = row.type_absence_id;
    this.editFormSelectedStatutId = row.status_id;
    this.editFormSelectedEmployeId = row.employe_id;
  }

  onClickSubmitEditAbsence(){

    this.editAbsenceForm.patchValue({ date_debut: this.formatDateToString(this.editAbsenceForm.value.date_debut) });
    this.editAbsenceForm.patchValue({ date_fin: this.formatDateToString(this.editAbsenceForm.value.date_fin) });

    if (this.editAbsenceForm.valid){
      const id = this.editAbsenceForm.value.id;

      this.data.editAbsence(this.editAbsenceForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      );
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }
  }

  getDeleteForm(row: any){
    this.deleteAbsenceForm.patchValue({
      id: row.id
    })
  }

  onClickSubmitDeleteAbsence(){

    if (this.deleteAbsenceForm.valid){
      const id = this.deleteAbsenceForm.value.id;
      this.data.deleteAbsence(this.deleteAbsenceForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }

  }







  public sortData(sort: Sort) {
    const data = this.lstAbsence.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstAbsence = data;
    } else {
      this.lstAbsence = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstAbsence = this.dataSource.filteredData;
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
