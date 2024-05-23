import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router } from '@angular/router';
import { getDepartEmploye, getTypeDepart, routes, DepartEmployeService, getMiniTemplateEmploye, ExportsService } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-licenciement',
  templateUrl: './licenciement.component.html',
  styleUrls: ['./licenciement.component.scss']
})
export class LicenciementComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstDpt: Array<any>=[];
  mon_dep: any;


  public lstDepartEmploye: Array<getDepartEmploye> = [];
  public lstTypeDepart: Array<getTypeDepart> = [];
  public lstTypeDepartNotToShow: string[] = ["Retraite", "Licenciement", "Démission", "Echéance de CDD"];
  public lstEmploye: Array<getMiniTemplateEmploye> = [];
  public editFormSelectedEmployeId: Number = 0;
  public editFormSelectedTypeDepartId: Number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getDepartEmploye>;
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

  public addDepartEmployeForm!: FormGroup ;
  public editDepartEmployeForm!: FormGroup
  public deleteDepartEmployeForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: DepartEmployeService, private exp: ExportsService) {}

  ngOnInit(): void {
     this.getTableData();
     this.addDepartEmployeForm = this.formBuilder.group({
      typeDepart_id: ["", [Validators.required]],
      employe_id: ["", [Validators.required]],
      motif: ["Néant", [Validators.required]],
      datedepart: ["", [Validators.required]],
    });
     this.editDepartEmployeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      typeDepart_id: ["", [Validators.required]],
      employe_id: ["", [Validators.required]],
      motif: ["Néant", [Validators.required]],
      datedepart: ["", [Validators.required]],
    });
     this.deleteDepartEmployeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }


  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClickSubmitAddDepartEmploye(){

    if (this.addDepartEmployeForm.valid){
        this.addDepartEmployeForm.patchValue({ datedepart: this.formatDateToString(this.addDepartEmployeForm.value.datedepart) });

        console.log(this.addDepartEmployeForm.value);
        this.data.saveDepartEmploye(this.addDepartEmployeForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        );
      } else {

        console.log("desole le formulaire n'est pas bien renseigné");
      }

  }

  private convertToDate(date: string): Date {
    const d = date.split('-');
    return new Date(Number(d[0]), Number(d[1])-1, Number(d[2]));
  }

  getEditForm(row: any){
    this.editDepartEmployeForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      typeDepart_id: row.typeDepart_id,
      motif: row.motif,
      datedepart: this.convertToDate(row.datedepart),
    })
    this.editFormSelectedEmployeId = row.employe_id;
    this.editFormSelectedTypeDepartId = row.typeDepart_id;
  }

  onClickSubmitEditDepartEmploye(){

    if (this.editDepartEmployeForm.valid){
      this.editDepartEmployeForm.patchValue({ datedepart: this.formatDateToString(this.editDepartEmployeForm.value.datedepart) });

        this.data.editDepartEmploye(this.editDepartEmployeForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
        console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }
  onClickSubmitDeleteDepartEmploye(){

      if (this.deleteDepartEmployeForm.valid){

        this.data.deleteDepartEmploye(this.deleteDepartEmployeForm.value).subscribe(
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
    this.deleteDepartEmployeForm.patchValue({
     id:row.id,
    })
 }



 exportToPDF() {


  $('#spinner_pdf').removeClass('d-none');
    this.exp.exportDepartEmploye().subscribe(
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
  // setTimeout(() => {
  // }, 10);

  setTimeout(() => {
    const table: HTMLElement | null = document.getElementById('to_export');
    const filename = "Les Départs des Employés.xlsx";

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
      XLSX.utils.book_append_sheet(wb, ws1, "Les Départs des Employés");

      XLSX.writeFile(wb, filename);

      $('#spinner_xlsx').addClass('d-none');
    } else {
      console.error("L'Id spécifié n'a pas été trouvé.");
      $('#spinner_xlsx').addClass('d-none');
    }
  }, 10);
}





  private getTableData(): void {
    this.lstDepartEmploye = [];
    this.serialNumberArray = [];

    this.data.getAllDepartEmploye().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getDepartEmploye, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstDepartEmploye.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getDepartEmploye>(this.lstDepartEmploye);
      this.calculateTotalPages(this.totalData, this.pageSize);
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

    this.data.getAllTypeDepart().subscribe((res: any) => {
      res.data.data.map((res: getTypeDepart, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          if (!this.lstTypeDepartNotToShow.some(val => val.trim().toLowerCase() === res.lib.trim().toLowerCase())) {
            this.lstTypeDepart.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        }
      });
    });
  }

  public sortData(sort: Sort) {
    const data = this.lstDepartEmploye.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstDepartEmploye = data;
    } else {
      this.lstDepartEmploye = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstDepartEmploye = this.dataSource.filteredData;
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
