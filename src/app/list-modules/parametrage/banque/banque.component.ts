import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DataService,apiResultFormat, routes, banqueService, getBanque } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.scss']
})
export class BanqueComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any>=[];


  public lstBanque: Array<getBanque> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getBanque>;
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

  public addBanqueForm!: FormGroup ;
  public editBanqueForm!: FormGroup
  public deleteBanqueForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: banqueService) {}

  ngOnInit(): void {
    this.getTableData();
    this.addBanqueForm = this.formBuilder.group({
      nom: ["", [Validators.required]],
   });
   this.editBanqueForm = this.formBuilder.group({
    id: [0, [Validators.required]],
    nom: ["", [Validators.required]],
  });
   this.deleteBanqueForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

 onClickSubmitAddBanque(){

  console.log(this.addBanqueForm.value)

  if (this.addBanqueForm.valid){
    this.data.saveBanque(this.addBanqueForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {

    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditBanque(){
  console.log(this.editBanqueForm.value)

    if (this.editBanqueForm.valid){
      const id = this.editBanqueForm.value.id;
      this.data.editBanque(this.editBanqueForm.value).subscribe(
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
  console.log(this.deleteBanqueForm.value)

    if (this.deleteBanqueForm.valid){
      const id = this.deleteBanqueForm.value.id;
      this.data.deleteBanque(this.deleteBanqueForm.value).subscribe(
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
  this.editBanqueForm.patchValue({
   id:row.id,
   nom:row.nom
  })
}

getDeleteForm(row: any){
  this.deleteBanqueForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstBanque = [];
    this.serialNumberArray = [];

    this.data.getAllBanque().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getBanque, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstBanque.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getBanque>(this.lstBanque);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }



  exportToPDF() {
    const content: HTMLElement | null = document.getElementById('to_export');
    const pdfname = "Les Banques.pdf"

    if (content) {
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const text = "Les Banques";
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
    const filename = "Les Banques.xlsx";

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
      XLSX.utils.book_append_sheet(wb, ws1, "Les Banques");

      XLSX.writeFile(wb, filename);
    } else {
      console.error("L'Id spécifié n'a pas été trouvé.");
    }
  }

  public sortData(sort: Sort) {
    const data = this.lstBanque.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstBanque = data;
    } else {
      this.lstBanque = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstBanque = this.dataSource.filteredData;
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
