import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { routes, TypeDepartService, getTypeDepart } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';




@Component({
  selector: 'app-type-depart',
  templateUrl: './type-depart.component.html',
  styleUrls: ['./type-depart.component.scss']
})
export class TypeDepartComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstTabs: Array<any>=[];


  public lstTypeDepart: Array<getTypeDepart> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getTypeDepart>;
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

  public addTypeDepartForm!: FormGroup ;
  public editTypeDepartForm!: FormGroup
  public deleteTypeDepartForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: TypeDepartService) {}

  ngOnInit(): void {
     this.getTableData();
    this.addTypeDepartForm = this.formBuilder.group({
      lib: ["", [Validators.required]],
   });
   this.editTypeDepartForm = this.formBuilder.group({
    id: [0, [Validators.required]],
    lib: ["", [Validators.required]],
  });
   this.deleteTypeDepartForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
  }

  onClickSubmitAddCategorie(){

    console.log(this.addTypeDepartForm.value)

    if (this.addTypeDepartForm.valid){
      this.data.saveTypeDepart(this.addTypeDepartForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }


  }

  onClickSubmitEditCategorie(){

      if (this.editTypeDepartForm.valid){
        const id = this.editTypeDepartForm.value.id;
        this.data.editTypeDepart(this.editTypeDepartForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      } else {
        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  onClickSubmitDeleteCategorie(){

      if (this.deleteTypeDepartForm.valid){
        const id = this.deleteTypeDepartForm.value.id;
        this.data.deleteTypeDepart(this.deleteTypeDepartForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      } else {
        alert("desole le formulaire n'est pas bien renseigné")
      }

  }

  getEditForm(row: any){
    this.editTypeDepartForm.patchValue({
     id:row.id,
     lib:row.lib
    })
  }

  getDeleteForm(row: any){
    this.deleteTypeDepartForm.patchValue({
     id:row.id,
    })
  }

  exportToPDF() {
    const content: HTMLElement | null = document.getElementById('to_export');
    const pdfname = "Les types de départ.pdf"

    if (content) {
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const text = "Les Types de départ";
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
      });
    } else {
      console.error("L'élément avec l'ID spécifié n'a pas été trouvé.");
    }
  }

  exportToXLSX() {
    const table: HTMLElement | null = document.getElementById('to_export');
    const filename = "Les types de départ.xlsx";

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
      XLSX.utils.book_append_sheet(wb, ws1, "Les Types de départ");

      XLSX.writeFile(wb, filename);
    } else {
      console.error("L'Id spécifié n'a pas été trouvé.");
    }
  }


  private getTableData(): void {
    this.lstTypeDepart = [];
    this.serialNumberArray = [];

    this.data.getAllTypeDepart().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getTypeDepart, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstTypeDepart.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getTypeDepart>(this.lstTypeDepart);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstTypeDepart.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTypeDepart = data;
    } else {
      this.lstTypeDepart = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTypeDepart = this.dataSource.filteredData;
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
