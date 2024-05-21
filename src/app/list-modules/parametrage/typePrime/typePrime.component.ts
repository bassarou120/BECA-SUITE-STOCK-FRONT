import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { ExportsService, getTypePrime, routes, TypePrimeService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-typePrime',
  templateUrl: './typePrime.component.html',
  styleUrls: ['./typePrime.component.scss']
})
export class TypePrimeComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstTypePrimes: Array<getTypePrime> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getTypePrime>;
  public addTypePrimeForm!: FormGroup ;
  public editTypePrimeForm!: FormGroup;
  public deleteTypePrimeForm!: FormGroup;

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

  constructor(private data: TypePrimeService, private formBuilder: FormBuilder, private exp: ExportsService) {}

  ngOnInit(): void {
    this.getTableData();
    this.addTypePrimeForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editTypePrimeForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deleteTypePrimeForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstTypePrimes = [];
    this.serialNumberArray = [];

    this.data.getAllTypePrimes().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getTypePrime, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstTypePrimes.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getTypePrime>(this.lstTypePrimes);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  saveTypePrime() {
    // console.log(this.addTypePrimeForm.value, this.addTypePrimeForm.valid);
    if (this.addTypePrimeForm.valid){
      this.data.saveTypePrime(this.addTypePrimeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getEditTypePrime(row: any) {
    this.editTypePrimeForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editTypePrime() {
    // console.log(this.editHolidayForm.value, this.editHolidayForm.valid);
    if (this.editTypePrimeForm.valid){
      this.data.editTypePrime(this.editTypePrimeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteTypePrime(row: any) {
    this.deleteTypePrimeForm.patchValue({
      id: row.id
    })
  }

  deleteTypePrime() {
    // console.log(this.deleteHolidayForm.value, this.deleteHolidayForm.valid);
    if (this.deleteTypePrimeForm.valid){
      this.data.deleteTypePrime(this.deleteTypePrimeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }

  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportTypesPrime().subscribe(
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
      const filename = "Types De Prime.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Types De Prime");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }






  public sortData(sort: Sort) {
    const data = this.lstTypePrimes.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTypePrimes = data;
    } else {
      this.lstTypePrimes = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstTypePrimes = this.dataSource.filteredData;
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
