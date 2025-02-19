import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { Router } from '@angular/router';
import { ExportsService, getMesContrats, routes, MesContratsService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

declare var $: any;
@Component({
  selector: 'app-point-contrat',
  templateUrl: './mes-contrats.component.html',
  styleUrls: ['./mes-contrats.component.scss']
})
export class MesContratsComponent implements OnInit {
  public routes = routes;
  public lstMesContrats: Array<getMesContrats> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getMesContrats>;
  // pagination variables
  public loggedUserId: number = 0;
  public loggedEmployeId: number = 0;
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


  constructor(public router: Router,private data:  MesContratsService, private exp: ExportsService) {}

  ngOnInit(): void {
    this.getLoggedUserId();
     this.getTableData();

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
    private getTableData(): void {
      this.serialNumberArray = [];
      this.lstMesContrats = [];

      this.data.getAllMesContrats(this.loggedUserId).subscribe((res: any) => {
        this.totalData = res.data.total;
        res.data.map((res: getMesContrats, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstMesContrats.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });

        this.data.getConnectedEmployeID(this.loggedUserId).subscribe((res: any) => {
          //this.addPlainteForm.patchValue({employe_id: res.data});
         // this.editPlainteForm.patchValue({employe_id: res.data});
          this.loggedEmployeId = res.data;
        });
        this.dataSource = new MatTableDataSource<getMesContrats>(this.lstMesContrats);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }



  toWeek(num: number): number {
    var ans = Math.floor(num / 7);
    return ans === 0 ? 1 : ans;
  }

  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportMesContrats(this.loggedUserId).subscribe(
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
      const filename = "Point des Contrats en cours.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Point des Contrats en cours");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }







  public sortData(sort: Sort) {
    const data = this.lstMesContrats.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstMesContrats = data;
    } else {
      this.lstMesContrats = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }



  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstMesContrats = this.dataSource.filteredData;
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

  // ngAfterViewInit(): void {
  //   $(document).ready(function () {
  //     $('#example').DataTable({
  //       buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
  //     });
  //   });
  // }

}


export interface pageSelection {
  skip: number;
  limit: number;
}
