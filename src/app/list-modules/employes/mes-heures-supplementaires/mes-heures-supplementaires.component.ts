import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExportsService, getHeureSupplementaire, routes, HeureSupplementaireService, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-mes-heures-supplementaires',
  templateUrl: './mes-heures-supplementaires.component.html',
  styleUrls: ['./mes-heures-supplementaires.component.scss']
})
export class MesHeuresSupplementairesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;

  public loggedUserId: number = 0;
  public loggedEmployeId: number = 0;

  public lstStatuts: Array<string> = ["Non Approuvé", "Approuvé"];
  public lstHeureSupplementaire: Array<getHeureSupplementaire> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: Number = 0;
  public editFormSelectedStatut: string = "";
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getHeureSupplementaire>;
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

  public addHeureSupplementaireForm!: FormGroup ;
  public editHeureSupplementaireForm!: FormGroup
  public deleteHeureSupplementaireForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: HeureSupplementaireService, private exp: ExportsService) {}

  ngOnInit(): void {
    this.getLoggedUserId();
    this.getTableData();
     this.addHeureSupplementaireForm = this.formBuilder.group({
      dateH: ["", [Validators.required]],
      nombreHeure: [1, [Validators.required]],
      autreInfo: ["Aucun", [Validators.required]],
      employe_id: [0, [Validators.required]],
      status: ["Non Approuvé", [Validators.required]],
    });
    this.editHeureSupplementaireForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      dateH: ["", [Validators.required]],
      nombreHeure: [0, [Validators.required]],
      autreInfo: ["", [Validators.required]],
      employe_id: [0, [Validators.required]],
      status: ["Non Approuvé", [Validators.required]],
    });
     this.deleteHeureSupplementaireForm = this.formBuilder.group({
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

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddHeureSupplementaire(){
      // console.log(this.addHeureSupplementaireForm.value)

      if (this.addHeureSupplementaireForm.valid){
      this.addHeureSupplementaireForm.patchValue({ dateH: this.formatDateToString(this.addHeureSupplementaireForm.value.dateH) });

        console.log(this.addHeureSupplementaireForm.value);
        this.data.saveHeureSupplementaire(this.addHeureSupplementaireForm.value).subscribe(
          (data:any)=>{
            location.reload();
          },
          (error: string) => {
            this.showModal(error);
          }
        )
      } else {
        console.log("desole le formulaire n'est pas bien renseigné");
      }
  }

  showModal(message: string) {
    const modal = document.getElementById('alert_modal');
    if (modal) {
      const messageElement = modal.querySelector('.modal-body p');
      if (messageElement) {
        messageElement.textContent = message;
      }
      modal.style.display = 'block';
      modal.classList.add('show');
      const firstFocusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement).focus();
      }
      const okButton = modal.querySelector('.cancel-btn');
      if (okButton) {
        okButton.addEventListener('click', () => {
          this.hideModal(modal);
        });
      }
      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.hideModal(modal);
        }
      });
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.hideModal(modal);
        }
      });
    } else {
      console.error("Modal element not found!");
    }
  }

  hideModal(modal: HTMLElement) {
    modal.style.display = 'none';
    modal.classList.remove('show');
  }


  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }

  getEditForm(row: any){
    this.editHeureSupplementaireForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      autreInfo: row.autreInfo,
      nombreHeure: row.nombreHeure,
      dateH: this.convertToDate(row.dateH),
      status: row.status,
    })
    this.editFormSelectedEmployeId = row.employe_id;
    this.editFormSelectedStatut = row.status;
  }

  onClickSubmitEditHeureSupplementaire(){
    console.log(this.editHeureSupplementaireForm.value)

      if (this.editHeureSupplementaireForm.valid){
        this.editHeureSupplementaireForm.patchValue({ dateH: this.formatDateToString(this.editHeureSupplementaireForm.value.dateH) });

        this.data.editHeureSupplementaire(this.editHeureSupplementaireForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }
  onClickSubmitDeleteHeureSupplementaire(){
    console.log(this.deleteHeureSupplementaireForm.value)

      if (this.deleteHeureSupplementaireForm.valid){

        this.data.deleteHeureSupplementaire(this.deleteHeureSupplementaireForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  getDeleteForm(row: any){
    this.deleteHeureSupplementaireForm.patchValue({
     id:row.id,
    })
 }




  private getTableData(): void {
    this.lstHeureSupplementaire = [];
    this.serialNumberArray = [];

    this.data.getAllUserHeureSupplementaire(this.loggedUserId).subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getHeureSupplementaire, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstHeureSupplementaire.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getHeureSupplementaire>(this.lstHeureSupplementaire);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

    this.data.getConnectedEmployeID(this.loggedUserId).subscribe((res: any) => {
      this.addHeureSupplementaireForm.patchValue({employe_id: res.data});
      this.editHeureSupplementaireForm.patchValue({employe_id: res.data});
      this.loggedEmployeId = res.data;
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
  }


  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportMesHeuresSupp(this.loggedUserId).subscribe(
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
      const filename = "Mes Heures Supplémentaires.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Mes Heures Supplémentaires");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }







  public sortData(sort: Sort) {
    const data = this.lstHeureSupplementaire.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstHeureSupplementaire = data;
    } else {
      this.lstHeureSupplementaire = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstHeureSupplementaire = this.dataSource.filteredData;
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
