import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getTypeConge, routes, TypeCongeService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-typeConge',
  templateUrl: './typeConge.component.html',
  styleUrls: ['./typeConge.component.scss']
})
export class TypeCongeComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstTypeConges: Array<getTypeConge> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getTypeConge>;
  public addTypeCongeForm!: FormGroup ;
  public editTypeCongeForm!: FormGroup;
  public deleteTypeCongeForm!: FormGroup;


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

  constructor(private data: TypeCongeService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addTypeCongeForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editTypeCongeForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deleteTypeCongeForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstTypeConges = [];
    this.serialNumberArray = [];

    this.data.getAllTypeConges().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getTypeConge, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstTypeConges.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getTypeConge>(this.lstTypeConges);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  saveTypeConge() {
    // console.log(this.addTypeCongeForm.value, this.addTypeCongeForm.valid);
    if (this.addTypeCongeForm.valid){
      this.data.saveTypeConge(this.addTypeCongeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getEditTypeConge(row: any) {
    this.editTypeCongeForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editTypeConge() {
    // console.log(this.editTypeCongeForm.value, this.editTypeCongeForm.valid);
    if (this.editTypeCongeForm.valid){
      this.data.editTypeConge(this.editTypeCongeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteTypeConge(row: any) {
    this.deleteTypeCongeForm.patchValue({
      id: row.id
    })
  }

  deleteTypeConge() {
    // console.log(this.deleteTypeCongeForm.value, this.deleteTypeCongeForm.valid);
    if (this.deleteTypeCongeForm.valid){
      this.data.deleteTypeConge(this.deleteTypeCongeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }


  exportToPDF() {
    const content: HTMLElement | null = document.getElementById('to_export');
    const pdfname = "Types De Congés.pdf"

    if (content) {
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const text = "Types De Congés";
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
    const filename = "Types De Congés.xlsx";

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
      XLSX.utils.book_append_sheet(wb, ws1, "Types De Congés");

      XLSX.writeFile(wb, filename);
    } else {
      console.error("L'Id spécifié n'a pas été trouvé.");
    }
  }







  public sortData(sort: Sort) {
    const data = this.lstTypeConges.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTypeConges = data;
    } else {
      this.lstTypeConges = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTypeConges = this.dataSource.filteredData;
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
