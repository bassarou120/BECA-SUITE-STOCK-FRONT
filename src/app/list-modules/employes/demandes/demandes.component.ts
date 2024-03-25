import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getDemande, routes, DemandeService, getTypeConge, getEmployees, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;

  public loggedUserId: number = 0;
  public lstDemande: Array<getDemande> = [];
  public lstTypeDemande: Array<getTypeConge> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedTypeDemandeId: number = 0;
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getDemande>;
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

  public addDemandeForm!: FormGroup ;
  public editDemandeForm!: FormGroup
  public deleteDemandeForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: DemandeService) {}

  ngOnInit(): void {
     this.getLoggedUserId();
     this.getTableData();

     this.addDemandeForm = this.formBuilder.group({
      type_Demandes_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
    }, { validator: this.datesValidator });

     this.editDemandeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      type_Demandes_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
    }, { validator: this.datesValidator });
    
     this.deleteDemandeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  private getLoggedUserId() {
    const userDataString = localStorage.getItem('userDataString');
    if(userDataString) {
      const userData = JSON.parse(userDataString)
      this.loggedUserId = userData['id'];
    } else {
      console.log("erreur")
    }
  }

  private datesValidator(group: FormGroup) {
    const startDateControl = group.get('date_debut');
    const endDateControl = group.get('date_fin');
    if (!startDateControl || !endDateControl) {
      return null;
    }
    const startDate = startDateControl.value;
    const endDate = endDateControl.value;
    if (startDate && endDate && startDate >= endDate) {
      return { datesInvalid: true };
    }
    return null;
  }


  
  private getTableData(): void {
    this.lstDemande = [];
    this.serialNumberArray = [];
 
    this.data.getAllUserDemandes(this.loggedUserId).subscribe((res: any) => {
      this.totalData = res.data.total;
console.log(res);
      res.data.map((res: getDemande, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstDemande.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getAllTypeConges().subscribe((res: any) => {
        res.data.data.map((res: getTypeConge, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstTypeDemande.push(res);
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

      this.dataSource = new MatTableDataSource<getDemande>(this.lstDemande);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  
  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddDemande(){

    // if (this.addDemandeForm.valid){
    //   this.addDemandeForm.patchValue({ date_debut: this.formatDateToString(this.addDemandeForm.value.date_debut) });
    //   this.addDemandeForm.patchValue({ date_fin: this.formatDateToString(this.addDemandeForm.value.date_fin) });
      
    //   this.data.saveDemande(this.addDemandeForm.value).subscribe(
    //     (data:any)=>{
    //       location.reload();
    //     }
    //   )
    // }else {
    //   console.log("Désolé le formulaire n'est pas bien renseigné")
    // }
  }

  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }

  getEditForm(row: any){
    this.editDemandeForm.patchValue({
      id: row.id,
      type_Demandes_id: row.type_Demandes_id,
      employe_id: row.employe_id,
      date_debut: this.convertToDate(row.date_debut),
      date_fin: this.convertToDate(row.date_fin),
    })
    this.editFormSelectedTypeDemandeId = row.type_Demandes_id;
    this.editFormSelectedEmployeId = row.employe_id;
  }

  onClickSubmitEditDemande(){

    // this.editDemandeForm.patchValue({ date_debut: this.formatDateToString(this.editDemandeForm.value.date_debut) });
    // this.editDemandeForm.patchValue({ date_fin: this.formatDateToString(this.editDemandeForm.value.date_fin) });

    // if (this.editDemandeForm.valid){
    //   const id = this.editDemandeForm.value.id;
    //   this.data.editDemande(this.editDemandeForm.value).subscribe(
    //     (data:any)=>{
    //       location.reload();
    //     }
    //   )
    // } else {
    //   console.log("desole le formulaire n'est pas bien renseigné")
    // }
  }

  getDeleteForm(row: any){
    this.deleteDemandeForm.patchValue({
      id: row.id
    })
  }

  onClickSubmitDeleteAbsence(){

    // if (this.deleteDemandeForm.valid){
    //   const id = this.deleteDemandeForm.value.id;
    //   this.data.deleteDemande(this.deleteDemandeForm.value).subscribe(
    //     (data:any)=>{
    //       location.reload();
    //     }
    //   )
    //   console.log("success")
    // } else {
    //   console.log("desole le formulaire n'est pas bien renseigné")
    // }

  }







  public sortData(sort: Sort) {
    const data = this.lstDemande.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstDemande = data;
    } else {
      this.lstDemande = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstDemande = this.dataSource.filteredData;
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
