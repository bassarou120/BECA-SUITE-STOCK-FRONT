import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import {ExportsService, routes, banqueService, getDirectionCentre, getBureau} from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {DirectionCentreService} from "../../../core/services/directionCentre/directionCentre.service";
import { Direction } from '@angular/cdk/bidi';



@Component({
  selector: 'app-directionCentre',
  templateUrl: './directionCentre.component.html',
  styleUrls: ['./directionCentre.component.scss']
})
export class DirectionCentreComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any>=[];


  public lstDirectionCentre: Array<getDirectionCentre> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getDirectionCentre>;
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

  public addDirectionCentreForm!: FormGroup ;
  public editDirectionCentreForm!: FormGroup
  public deleteDirectionCentreForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: DirectionCentreService, private exp: ExportsService) {}

  ngOnInit(): void {
    this.getTableData();
    this.addDirectionCentreForm = this.formBuilder.group({
      code: ["", [Validators.required]],
      intitule: ["", [Validators.required]],
   });
   this.editDirectionCentreForm = this.formBuilder.group({
    id: [0, [Validators.required]],
     code: ["", [Validators.required]],
     intitule: ["", [Validators.required]],
  });
   this.deleteDirectionCentreForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

 onClickSubmitAddDirectionCentre(){

  console.log(this.addDirectionCentreForm.value)

  if (this.addDirectionCentreForm.valid){
    $('#spinnerr').removeClass('d-none');
    this.data.save(this.addDirectionCentreForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {
    $('#spinnerr').addClass('d-none');
    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditDirectionCentre(){
  console.log(this.editDirectionCentreForm.value)

    if (this.editDirectionCentreForm.valid){
      $('#spinner').removeClass('d-none');
      const id = this.editDirectionCentreForm.value.id;
      this.data.edit(this.editDirectionCentreForm.value).subscribe(
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

onClickSubmitDeleteDirectionCentre(){
  console.log(this.deleteDirectionCentreForm.value)

    if (this.deleteDirectionCentreForm.valid){
      const id = this.deleteDirectionCentreForm.value.id;
      this.data.delete(this.deleteDirectionCentreForm.value).subscribe(
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
  this.editDirectionCentreForm.patchValue({
   id:row.id,
   code:row.code,
    intitule:row.intitule
  })
}

getDeleteForm(row: any){
  this.deleteDirectionCentreForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstDirectionCentre = [];
    this.serialNumberArray = [];

    this.data.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getDirectionCentre, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstDirectionCentre.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getDirectionCentre>(this.lstDirectionCentre);
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
      const filename = "Les Famille.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Les Famille");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }

  public sortData(sort: Sort) {
    const data = this.lstDirectionCentre.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstDirectionCentre = data;
    } else {
      this.lstDirectionCentre = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstDirectionCentre = this.dataSource.filteredData;
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
