import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import {ExportsService, routes, banqueService, getBanque, getFournisseur} from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {bureauService} from "../../../core/services/bureau/bureau.service";
import {fournisseurService} from "../../../core/services/fournisseur/fournisseur.service";



@Component({
  selector: 'app-banque',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any>=[];


  public lstFournisseur: Array<getFournisseur> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getFournisseur>;
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

  public addFournisseurForm!: FormGroup ;
  public editFournisseurForm!: FormGroup
  public deleteFournisseurForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private fournisseurService: fournisseurService, private exp: ExportsService) {}


  ngOnInit(): void {
    this.getTableData();
    this.addFournisseurForm = this.formBuilder.group({
      nom: ["", [Validators.required]],
      adresse: ["", [Validators.required]],
      telephone: ["", [Validators.required]],
   });
   this.editFournisseurForm = this.formBuilder.group({
    id: [0, [Validators.required]],
     nom: ["", [Validators.required]],
     adresse: ["", [Validators.required]],
     telephone: ["", [Validators.required]],
  });
   this.deleteFournisseurForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

 onClickSubmitAddBanque(){

  console.log(this.addFournisseurForm.value)

  if (this.addFournisseurForm.valid){
    $('#spinnerr').removeClass('d-none');
    this.fournisseurService.save(this.addFournisseurForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {
    $('#spinnerr').addClass('d-none');
    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditBanque(){
  console.log(this.editFournisseurForm.value)

    if (this.editFournisseurForm.valid){
      $('#spinner').removeClass('d-none');
      const id = this.editFournisseurForm.value.id;
      this.fournisseurService.edit(this.editFournisseurForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    }else {
      $('#spinner').addClass('d-none');
      alert("desole le formulaire n'est pas bien renseigné")
    }

}

onClickSubmitDeleteBanque(){
  console.log(this.deleteFournisseurForm.value)

    if (this.deleteFournisseurForm.valid){
      const id = this.deleteFournisseurForm.value.id;
      this.fournisseurService.delete(this.deleteFournisseurForm.value).subscribe(
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
  this.editFournisseurForm.patchValue({
   id:row.id,
   libelle:row.libelle
  })
}

getDeleteForm(row: any){
  this.deleteFournisseurForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstFournisseur = [];
    this.serialNumberArray = [];

    this.fournisseurService.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getFournisseur, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstFournisseur.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getFournisseur>(this.lstFournisseur);
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
    const data = this.lstFournisseur.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstFournisseur = data;
    } else {
      this.lstFournisseur = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstFournisseur = this.dataSource.filteredData;
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
