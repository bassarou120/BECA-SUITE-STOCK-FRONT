import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import {ExportsService, routes, banqueService, getBanque, getBureau} from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {bureauService} from "../../../core/services/bureau/bureau.service";



@Component({
  selector: 'app-banque',
  templateUrl: './bureau.component.html',
  styleUrls: ['./bureau.component.scss']
})
export class BureauComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any>=[];


  public lstBureau: Array<getBureau> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getBureau>;
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

  public addBureauForm!: FormGroup ;
  public editBureauForm!: FormGroup
  public deleteBureauForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: bureauService, private exp: ExportsService) {}

  ngOnInit(): void {
    this.getTableData();
    this.addBureauForm = this.formBuilder.group({
      libelle: ["", [Validators.required]],
      description: ["", [ ]],
   });
   this.editBureauForm = this.formBuilder.group({
    id: [0, [Validators.required]],
     libelle: ["", [Validators.required]],
     description: ["", [ ]],
  });
   this.deleteBureauForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

 onClickSubmitAddBanque(){

  console.log(this.addBureauForm.value)

  if (this.addBureauForm.valid){
    this.data.save(this.addBureauForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {

    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditBanque(){
  console.log(this.editBureauForm.value)

    if (this.editBureauForm.valid){
      const id = this.editBureauForm.value.id;
      this.data.edit(this.editBureauForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

}

onClickSubmitDeleteBanque(){
  console.log(this.deleteBureauForm.value)

    if (this.deleteBureauForm.valid){
      const id = this.deleteBureauForm.value.id;
      this.data.delete(this.deleteBureauForm.value).subscribe(
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
  this.editBureauForm.patchValue({
   id:row.id,
   libelle:row.libelle,
    description:row.description
  })
}

getDeleteForm(row: any){
  this.deleteBureauForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstBureau = [];
    this.serialNumberArray = [];

    this.data.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getBureau, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstBureau.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getBureau>(this.lstBureau);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }



  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportBanques().subscribe(
      (response: any) => {
        $('#spinner_pdf').addClass('d-none');
        window.open(response.data, '_blank');
      },
      (error: any) => {
        $('#spinner_pdf').addClass('d-none');
        alert(JSON.stringify(error));
      }
    );
  }

  exportToXLSX() {
    $('#spinner_xlsx').removeClass('d-none');
    setTimeout(() => {
      const table: HTMLElement | null = document.getElementById('to_export');
      const filename = "Les Bureau.xlsx";

      if (table) {
        const wb = XLSX.utils.book_new();
        const tableCopy = table.cloneNode(true) as HTMLElement;

        const idsToExclude: string[] = ['exclusion-1', 'exclusion-2'];
        idsToExclude.forEach(id => {
          const elementsToRemove = tableCopy.querySelectorAll(`#${id}`);
          elementsToRemove.forEach(element => {
            const columnIndex = Array.from(element.parentElement!.children).indexOf(element);
            const rows = tableCopy.querySelectorAll('tr');
            rows.forEach(row => {
              if (row.children[columnIndex]) {
                row.removeChild(row.children[columnIndex]);
              }
            });
          });
        });

        const ws1 = XLSX.utils.table_to_sheet(tableCopy);
        XLSX.utils.book_append_sheet(wb, ws1, "Les Bureau");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }

  public sortData(sort: Sort) {
    const data = this.lstBureau.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstBureau = data;
    } else {
      this.lstBureau = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstBureau = this.dataSource.filteredData;
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
