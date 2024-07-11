import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router } from '@angular/router';
import { getDepartEmploye, getTypeDepart, routes, DepartEmployeService, getMiniTemplateEmploye, ExportsService } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { EmployeService } from 'src/app/core/services/employe/employe.service';


@Component({
  selector: 'app-depart-employe',
  templateUrl: './solde-pour-compte.component.html',
  styleUrls: ['./solde-pour-compte.component.scss']
})
export class SoldePourCompteComponent implements OnInit {
  public routes = routes;
  selected = 'option1';



  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public searchDataValue = '';
  public typeSelected: number = 0;
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

  public addGenerateSoldePourToutCompte!: FormGroup ;

  constructor(private formBuilder: FormBuilder,public router: Router,private data: EmployeService) {}

  ngOnInit(): void {
     this.getTableData();
     this.addGenerateSoldePourToutCompte = this.formBuilder.group({
      employe_id: ["", [Validators.required]],
    });
  }


  onClickSubmitAdd(){

    if (this.addGenerateSoldePourToutCompte.valid){
        console.log(this.addGenerateSoldePourToutCompte.value);
        this.data.generateSoldePourToutCompte(this.addGenerateSoldePourToutCompte.value).subscribe(
          (data:any)=>{
            window.open(data.data, '_target');
            location.reload();
          }
        );
      } else {

        console.log("desole le formulaire n'est pas bien renseigné");
      }

  }



  private getTableData(): void {

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
  }

  // public sortData(sort: Sort) {
  //   const data = this.lstDepartEmploye.slice();

  //   /* eslint-disable @typescript-eslint/no-explicit-any */
  //   if (!sort.active || sort.direction === '') {
  //     this.lstDepartEmploye = data;
  //   } else {
  //     this.lstDepartEmploye = data.sort((a: any, b: any) => {
  //       const aValue = (a as any)[sort.active];
  //       const bValue = (b as any)[sort.active];
  //       return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
  //     });
  //   }
  // }






  // public searchData(value: string): void {
  //   this.dataSource.filter = value.trim().toLowerCase();
  //   this.lstDepartEmploye = this.dataSource.filteredData;
  // }

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
