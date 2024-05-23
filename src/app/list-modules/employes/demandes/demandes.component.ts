import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExportsService, getDemande, routes, DemandeService, getTypeConge, getTypeAbsence, getEmployees, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any> = [];
  mon_dep: any;


  public default_status: string = environment.default_statut_for_demands;
  public lstTypeDemande: Array<string> = ["congé", "absence"];

  public loggedUserId: number = 0;
  public loggedEmployeId: number = 0;
  public selectedTypeDemande: string = "";
  public lstDemande: Array<getDemande> = [];
  public lstTypeConge: Array<getTypeConge> = [];
  public lstTypeAbsence: Array<getTypeAbsence> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
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

  public addDemandeForm!: FormGroup;
  public editDemandeForm!: FormGroup
  public deleteDemandeForm!: FormGroup

  constructor(private formBuilder: FormBuilder, public router: Router, private data: DemandeService, private exp: ExportsService) { }

  ngOnInit(): void {
    this.getLoggedUserId();
    this.getTableData();

    this.addDemandeForm = this.formBuilder.group({
      date_demande: [new Date(), [Validators.required]],
      objet: ["", [Validators.required]],
      employe_id: [0, [Validators.required]],
      status: [this.default_status, [Validators.required]],
      contenue: ["", [Validators.required]],
      type_demande: ["", [Validators.required]],
      date_debut: [new Date(), [Validators.required]],
      date_fin: [this.tomorrowDate(), [Validators.required]],
      type_conges_id: ["", [Validators.required]],
      type_absence_id: ["", [Validators.required]],
      titre: ["Aucun", [Validators.required]],
      description: ["Aucun", [Validators.required]],
      date_M: [new Date(), [Validators.required]],
      autre_info: ["Aucun", [Validators.required]],

    }, { validator: this.datesValidator });

    this.editDemandeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      date_demande: [new Date(), [Validators.required]],
      objet: ["", [Validators.required]],
      employe_id: [0, [Validators.required]],
      status: [this.default_status, [Validators.required]],
      contenue: ["", [Validators.required]],
      type_demande: ["", [Validators.required]],
      date_debut: [new Date(), [Validators.required]],
      date_fin: [this.tomorrowDate(), [Validators.required]],
      type_conges_id: [0, [Validators.required]],
      type_absence_id: [0, [Validators.required]],
      titre: ["Aucun", [Validators.required]],
      description: ["Aucun", [Validators.required]],
      date_M: [new Date(), [Validators.required]],
      autre_info: ["Aucun", [Validators.required]],

    }, /*{ validator: this.datesValidator }*/);

    this.deleteDemandeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      type_demande: ["", [Validators.required]],
    });
  }

  private tomorrowDate(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }

  private getLoggedUserId() {
    const userDataString = localStorage.getItem('userDataString');
    if (userDataString) {
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

  disableDatePicker(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }



  private getTableData(): void {
    this.lstDemande = [];
    this.serialNumberArray = [];

    this.data.getAllUserDemandes(this.loggedUserId).subscribe((res: any) => {
      this.totalData = res.data.total;

      res.data.map((res: getDemande, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstDemande.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getConnectedEmployeID(this.loggedUserId).subscribe((res: any) => {
        this.addDemandeForm.patchValue({ employe_id: res.data });
        this.editDemandeForm.patchValue({ employe_id: res.data });
        this.loggedEmployeId = res.data;
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
            this.lstEmploye.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
        console.log(this.lstEmploye)
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

  onClickSubmitAddDemande() {

    if (this.addDemandeForm.value.type_absence_id) {
      this.addDemandeForm.patchValue({ type_conges_id: "0" });
    } else if (this.addDemandeForm.value.type_conges_id) {
      this.addDemandeForm.patchValue({ type_absence_id: "0" });
    }

    if (this.addDemandeForm.valid) {
      this.addDemandeForm.patchValue({
        date_demande: this.formatDateToString(this.addDemandeForm.value.date_demande),
        date_M: this.formatDateToString(new Date()),
        date_debut: this.formatDateToString(this.addDemandeForm.value.date_debut),
        date_fin: this.formatDateToString(this.addDemandeForm.value.date_fin),
        titre: this.addDemandeForm.value.objet,
        description: this.addDemandeForm.value.contenue,
      })

      this.data.saveDemande(this.addDemandeForm.value).subscribe(
        (data: any) => {
          location.reload();
        },
        (error: string) => {
          this.showModal(error);
          this.addDemandeForm.patchValue({ date_demande: this.convertToDate(this.addDemandeForm.value.date_demande) })
        }
      )
    } else {
      console.log("Désolé le formulaire n'est pas bien renseigné");
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
    return new Date(Number(d[0]), Number(d[1]) - 1, Number(d[2]));
  }

  getEditForm(row: any) {
    this.editDemandeForm.patchValue({
      id: row.id,
      date_demande: this.convertToDate(row.date_demande),
      objet: row.objet,
      status: row.status,
      contenue: row.contenue,
      type_demande: row.type_demande,
      titre: row.objet,
      description: row.contenue,
      date_M: this.convertToDate(row.date_demande),
    });
    this.selectedTypeDemande = row.type_demande;
    if (row.type_demande === "absence") {
      this.editDemandeForm.patchValue({ date_debut: "" });
      this.editDemandeForm.patchValue({ date_fin: "" });
    } else if (row.type_demande === "congé") {
      this.editDemandeForm.patchValue({ date_debut: new Date() });
      this.editDemandeForm.patchValue({ date_fin: this.tomorrowDate() });
    } else if (row.type_demande === "plainte") {
      this.editDemandeForm.patchValue({ autre_info: "" });
    }
  }

  onClickSubmitEditDemande() {

    if (this.editDemandeForm.valid) {
      this.editDemandeForm.patchValue({
        date_demande: this.formatDateToString(this.editDemandeForm.value.date_demande),
        date_M: this.formatDateToString(this.editDemandeForm.value.date_M),
        date_debut: this.formatDateToString(this.editDemandeForm.value.date_debut),
        date_fin: this.formatDateToString(this.editDemandeForm.value.date_fin),
        titre: this.editDemandeForm.value.objet,
        description: this.editDemandeForm.value.contenue,
      })

      const id = this.editDemandeForm.value.id;
      this.data.editDemande(this.editDemandeForm.value).subscribe(
        (data: any) => {
          location.reload();
        }
      )
    } else {
      console.log("desole le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteForm(row: any) {
    this.deleteDemandeForm.patchValue({
      id: row.id,
      type_demande: row.type_demande,
    })
  }

  onClickSubmitDeleteAbsence() {

    if (this.deleteDemandeForm.valid) {

      this.data.deleteDemande(this.deleteDemandeForm.value).subscribe(
        (data: any) => {
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
    this.exp.exportMesDemandes(this.loggedUserId).subscribe(
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
      const filename = "Mes Demandes.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Mes Demandes");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
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
