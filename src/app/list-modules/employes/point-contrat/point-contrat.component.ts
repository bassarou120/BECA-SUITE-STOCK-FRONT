import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { Router } from '@angular/router';
import { getPointContrat, routes, PointContratService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

declare var $: any;
@Component({
  selector: 'app-point-contrat',
  templateUrl: './point-contrat.component.html',
  styleUrls: ['./point-contrat.component.scss']
})
export class PointContratComponent implements OnInit, AfterViewInit {
  public routes = routes;
  public lstPointContrat: Array<getPointContrat> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getPointContrat>;
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


  constructor(public router: Router,private data: PointContratService) {}

  ngOnInit(): void {
     this.getTableData();
    }


    private getTableData(): void {
      this.serialNumberArray = [];
      this.lstPointContrat = [];

      this.data.getAllPointsContrats().subscribe((res: any) => {
        this.totalData = res.data.total;
        res.data.map((res: getPointContrat, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstPointContrat.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });

        this.dataSource = new MatTableDataSource<getPointContrat>(this.lstPointContrat);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }







  public sortData(sort: Sort) {
    const data = this.lstPointContrat.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstPointContrat = data;
    } else {
      this.lstPointContrat = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }



  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstPointContrat = this.dataSource.filteredData;
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

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('#example').DataTable({
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
      });
    });
  }

}


export interface pageSelection {
  skip: number;
  limit: number;
}
