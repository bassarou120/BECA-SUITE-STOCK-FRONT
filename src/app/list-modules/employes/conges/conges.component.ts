import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router } from '@angular/router';
import { ExportsService, getConge, routes, CongeService, getTypeConge, getIfCongeJoui, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {environment} from "../../../../environments/environment";

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-conges',
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.scss']
})
export class CongesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;

  public default_status: string = environment.default_statut_for_demands;

  public lstStatus: Array<string> = ["Non Traité", "Rejeté", "Approuvé"];
  public lstEtat: Array<string> = ["À venir", "En cours", "Terminé"];
  public lstValsCongeJoui: Array<getIfCongeJoui> = [{val: 0, lib: "Non"}, {val: 1, lib: "Oui"}];
  public selectedCongeJoui = 0;
  public onModifId: number = 0;

  public lstConge: Array<getConge> = [];
  public lstTypeConge: Array<getTypeConge> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedTypeCongeId: number = 0;
  public editFormSelectedEmployeId: number = 0;
  public editFormSelectedStatus: string = "";
  public editFormSelectedEtat: string = "";
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getConge>;
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

  public addCongeForm!: FormGroup ;
  public editCongeForm!: FormGroup
  public deleteCongeForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: CongeService, private exp: ExportsService) {}

  ngOnInit(): void {
     this.getTableData();

     this.addCongeForm = this.formBuilder.group({
      type_conges_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      status: [this.default_status, [Validators.required]],
    }, { validator: this.datesValidator });

     this.editCongeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      type_conges_id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      date_debut: ["", [Validators.required]],
      date_fin: ["", [Validators.required]],
      status: [this.default_status, [Validators.required]],
      etat: ["À venir", [Validators.required]],
      congeJoui: [0, [Validators.required]],
    }, /*{ validator: this.datesValidator }*/);

     this.deleteCongeForm = this.formBuilder.group({
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
      return { endsBeforeStarts: true };
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (startDate && currentDate > startDate) {
      return { startsBeforeNow: true };
    }
    return null;
  }



  private getTableData(): void {
    this.lstConge = [];
    this.serialNumberArray = [];

    this.data.getAllConge().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getConge, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstConge.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getAllTypeConges().subscribe((res: any) => {
        res.data.data.map((res: getTypeConge, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstTypeConge.push(res);
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

      this.dataSource = new MatTableDataSource<getConge>(this.lstConge);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }


  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddConge(){

    if (this.addCongeForm.valid){
      this.addCongeForm.patchValue({ date_debut: this.formatDateToString(this.addCongeForm.value.date_debut) });
      this.addCongeForm.patchValue({ date_fin: this.formatDateToString(this.addCongeForm.value.date_fin) });

      this.data.saveConge(this.addCongeForm.value).subscribe(
        (data: any)=>{
          location.reload();
        },
        (error: string) => {
          this.showModal(error);
        }
      );
    }else {
      console.log("Désolé le formulaire n'est pas bien renseigné")
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
    this.editCongeForm.patchValue({
      id: row.id,
      type_conges_id: row.type_conges_id,
      employe_id: row.employe_id,
      date_debut: this.convertToDate(row.date_debut),
      date_fin: this.convertToDate(row.date_fin),
      status: row.status,
      congeJoui: row.congeJoui,
    });
    this.editFormSelectedTypeCongeId = row.type_conges_id;
    this.editFormSelectedEmployeId = row.employe_id;
    this.editFormSelectedStatus = row.status;
    this.editFormSelectedEtat = row.etat;
    this.onModifId = row.id;
    this.selectedCongeJoui = row.congeJoui;
  }

  onClickSubmitEditConge(){


    if (this.editCongeForm.valid){

      this.editCongeForm.patchValue({ date_debut: this.formatDateToString(this.editCongeForm.value.date_debut) });
      this.editCongeForm.patchValue({ date_fin: this.formatDateToString(this.editCongeForm.value.date_fin) });

      this.data.editConge(this.editCongeForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      );
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }
  }

  getDeleteForm(row: any){
    this.deleteCongeForm.patchValue({
      id: row.id
    })
  }

  onClickSubmitDeleteAbsence(){

    if (this.deleteCongeForm.valid){
      const id = this.deleteCongeForm.value.id;
      this.data.deleteConge(this.deleteCongeForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }

  }



  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportConges().subscribe(
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
      const filename = "Tous les congés.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Tous les congés");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }








  public sortData(sort: Sort) {
    const data = this.lstConge.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstConge = data;
    } else {
      this.lstConge = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstConge = this.dataSource.filteredData;
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
