import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getPlainte, routes, PlaintesService, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {environment} from "../../../../environments/environment";



@Component({
  selector: 'app-plaintes',
  templateUrl: './plaintes.component.html',
  styleUrls: ['./plaintes.component.scss']
})
export class PlaintesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;

  public default_status: string = environment.default_statut_for_demands;

  public lstPlainte: Array<getPlainte> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getPlainte>;
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

  public addPlainteForm!: FormGroup ;
  public editPlainteForm!: FormGroup
  public deletePlainteForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: PlaintesService) {}

  ngOnInit(): void {
     this.getTableData();

     this.addPlainteForm = this.formBuilder.group({
      date_M: [new Date(), [Validators.required]],
      employe_id: [0, [Validators.required]],
      titre: ["", [Validators.required]],
      autre_info: ["Aucun", [Validators.required]],
      description: ["", [Validators.required]],
      status: [this.default_status, [Validators.required]],
    });

     this.editPlainteForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      date_M: [new Date(), [Validators.required]],
      employe_id: [0, [Validators.required]],
      titre: ["", [Validators.required]],
      autre_info: ["", [Validators.required]],
      description: ["", [Validators.required]],
      status: [this.default_status, [Validators.required]],
    });

     this.deletePlainteForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }


  private getTableData(): void {
    this.lstPlainte = [];
    this.serialNumberArray = [];

    this.data.getAllPlainte().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getPlainte, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstPlainte.push(res);
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

      this.dataSource = new MatTableDataSource<getPlainte>(this.lstPlainte);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }


  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddPlainte(){

    if (this.addPlainteForm.valid){
      this.addPlainteForm.patchValue({ date_M: this.formatDateToString(this.addPlainteForm.value.date_M) });

      this.data.savePlainte(this.addPlainteForm.value).subscribe(
        (data: any) => {
          location.reload();
        }
      )
    }else {
      alert("Désolé le formulaire n'est pas bien renseigné")
    }
  }

  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }

  getEditForm(row: any){
    this.editPlainteForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      date_M: this.convertToDate(row.date_M),
      titre: row.titre,
      autre_info: row.autre_info,
      description: row.description,
      status: row.status,
    })
    this.editFormSelectedEmployeId = row.employe_id;
  }

  onClickSubmitEditPlainte(){

    this.editPlainteForm.patchValue({ date_M: this.formatDateToString(this.editPlainteForm.value.date_M) });

    if (this.editPlainteForm.valid){
      const id = this.editPlainteForm.value.id;
      this.data.editPlainte(this.editPlainteForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    } else {
      alert("desole le formulaire n'est pas bien renseigné")
    }
  }

  getDeleteForm(row: any){
    this.deletePlainteForm.patchValue({
      id: row.id
    })
  }

  onClickSubmitDeletePlainte(){

    if (this.deletePlainteForm.valid){
      const id = this.deletePlainteForm.value.id;
      this.data.deletePlainte(this.deletePlainteForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }
  }







  public sortData(sort: Sort) {
    const data = this.lstPlainte.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstPlainte = data;
    } else {
      this.lstPlainte = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstPlainte = this.dataSource.filteredData;
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
