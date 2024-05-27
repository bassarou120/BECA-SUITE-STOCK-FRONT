import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getPreavis, routes, PreavisService, getMiniTemplateEmploye } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {environment} from "../../../../environments/environment";

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-preavis',
  templateUrl: './preavis.component.html',
  styleUrls: ['./preavis.component.scss']
})
export class PreavisComponent implements OnInit {
  public routes = routes;
  selected = 'option1';


  //public default_status: string = environment.default_statut_for_demands;
  public lstStatut: Array<string> = ["Non Effectué et Non Payé", "Non Effectué et Payé", "Effectué"];
  public lstPreavis: Array<getPreavis> = [];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getPreavis>;
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

  public addPreavisForm!: FormGroup ;
  public editPreavisForm!: FormGroup
  public addFormSelectedStatut: string = "Non Effectué et Non Payé";
  public editFormSelectedStatut: string = "";
  public deletePreavisForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: PreavisService) {}

  ngOnInit(): void {
     this.getTableData();

     this.addPreavisForm = this.formBuilder.group({
      employe_id: [0, [Validators.required]],
      duree: ["", [Validators.required]],
      statut: ["Non Effectué et Non Payé", [Validators.required]],
      date_preavis: ["", [Validators.required]],
    });

     this.editPreavisForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      employe_id: [0, [Validators.required]],
      duree: ["", [Validators.required]],
      statut: ["", [Validators.required]],
      date_preavis: ["", [Validators.required]],
    });

     this.deletePreavisForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  private getTableData(): void {
    this.lstPreavis = [];
    this.serialNumberArray = [];

    this.data.getAllPreavis().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getPreavis, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;
          this.lstPreavis.push(res);
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

      this.dataSource = new MatTableDataSource<getPreavis>(this.lstPreavis);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  onClickSubmitAddPreavis(){

    this.addPreavisForm.patchValue({ date_preavis: this.formatDateToString(this.addPreavisForm.value.date_preavis) });
    if (this.addPreavisForm.valid){
      this.data.savePreavis(this.addPreavisForm.value).subscribe(
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
    this.editPreavisForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      duree: row.duree,
      statut: row.statut,
      date_preavis: this.convertToDate(row.date_preavis),
    })
    this.editFormSelectedStatut = row.statut;
    this.editFormSelectedEmployeId = row.employe_id;
  }

  onClickSubmitEditPreavis(){

    console.log(this.addPreavisForm.value)
    console.log(this.addPreavisForm.valid)
      this.editPreavisForm.patchValue({ date_preavis: this.formatDateToString(this.editPreavisForm.value.date_preavis) });
    if (this.editPreavisForm.valid){
      const id = this.editPreavisForm.value.id;
      this.data.editPreavis(this.editPreavisForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    } else {
      alert("desole le formulaire n'est pas bien renseigné")
    }
  }

  getDeleteForm(row: any){
    this.deletePreavisForm.patchValue({
      id: row.id
    })
  }

  onClickSubmitDeletePreavis(){

    if (this.deletePreavisForm.valid){
      const id = this.deletePreavisForm.value.id;
      this.data.deletePreavis(this.deletePreavisForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    } else {
      console.log("desole le formulaire n'est pas bien renseigné")
    }
  }




  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    setTimeout(() => {
      const content: HTMLElement | null = document.getElementById('to_export');
      const pdfname = "Plaintes.pdf"

      if (content) {
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const text = "Les Plaintes";
        const fontSize = 12; // Taille de la police du texte
        const textWidth = pdf.getTextWidth(text); // Largeur du texte
        const pageWidth = pdf.internal.pageSize.getWidth(); // Largeur de la page
        const textX = (pageWidth - textWidth) / 2; // Position x pour centrer le texte
        const textY = 25;
        pdf.setFontSize(fontSize);
        pdf.text(text, textX, textY);

        html2canvas(content, {
          ignoreElements: (element: Element) => {
            const idsToExclude: string[] = ['exclusion-1', 'exclusion-2'];
            return idsToExclude.includes(element.id);
          },
          scale: 1
        }).then(canvas => {
          const imageData = canvas.toDataURL('image/jpeg');
          // max width is 210
          const imageWidth = 180;
          const imageHeight = canvas.height * imageWidth / canvas.width;

          const scaleFactor = 1;
          const scaledWidth = imageWidth * scaleFactor;
          const scaledHeight = imageHeight * scaleFactor;

          pdf.addImage(imageData, 'JPEG', 15, 35, scaledWidth, scaledHeight);
          pdf.save(pdfname);
          $('#spinner_pdf').addClass('d-none');
        });
      } else {
        console.error("L'élément avec l'ID spécifié n'a pas été trouvé.");
        $('#spinner_pdf').addClass('d-none');
      }
    }, 10);
  }

  exportToXLSX() {
    $('#spinner_xlsx').removeClass('d-none');
    setTimeout(() => {
      const table: HTMLElement | null = document.getElementById('to_export');
      const filename = "Les Plaintes.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Les Plaintes");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }








  public sortData(sort: Sort) {
    const data = this.lstPreavis.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstPreavis = data;
    } else {
      this.lstPreavis = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstPreavis = this.dataSource.filteredData;
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
