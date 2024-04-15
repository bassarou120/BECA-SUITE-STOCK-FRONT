import { Component, OnInit,AfterViewInit  } from '@angular/core';

import { Router } from '@angular/router';
import { getPointConge, routes, PointCongeService } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


declare var $: any;
@Component({
  selector: 'app-point-conge',
  templateUrl: './point-conge.component.html',
  styleUrls: ['./point-conge.component.scss']
})
export class PointCongeComponent implements OnInit, AfterViewInit {
  public routes = routes;
  selected = 'option1';

  public totalJoursConges: number = 0;
  public shownPointConge: getPointConge = {
    "id_employe": 0,
    "employe": "",
    "conges_joui": [],
    "total_conges_joui": 0,
    "total_jours_conges_joui": 0,
    "absences_deductibles": [],
    "total_absences_deductibles": 0,
    "total_jours_absences_deductibles": 0,
  };
  public selectedTypeDemande: string = "";
  public lstPointConge: Array<getPointConge> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getPointConge>;
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


  constructor(public router: Router,private data: PointCongeService) {}

  ngOnInit(): void {
     this.getTableData();
    }


    private getTableData(): void {
      this.lstPointConge = [];
      this.serialNumberArray = [];

      this.data.getAllPointsConges().subscribe((res: any) => {
        this.totalData = res.data.total;
        this.totalJoursConges = res.TOTAL_JOURS_CONGE;

      if (res && res.data) {
        this.lstPointConge = res.data.map((item: any) => ({
          id_employe: item.id_employe,
          employe: item.employe,
          conges_joui: item.conges_joui.map((conge: any) => ({
            id: conge.id,
            date_debut: conge.date_debut,
            date_fin: conge.date_fin,
            employe_id: conge.id_employe,
            type_conges_id: conge.type_conges_id,
            libelle: conge.libelle,
            employe: conge.employe,
            status: conge.status,
            congeJoui: conge.congeJoui,
            etat: conge.etat,
            jours: conge.jours,
          })),
          total_conges_joui: item.total_conges_joui,
          total_jours_conges_joui: item.total_jours_conges_joui,
          absences_deductibles: item.absences_deductibles.map((absence: any) => ({
            id: absence.id,
            date_debut: absence.date_debut,
            date_fin: absence.date_fin,
            employe_id: absence.id_employe,
            type_absence_id: absence.type_absence_id,
            libelle: absence.libelle,
            employe: absence.employe,
            status: absence.status,
            jours: absence.jours,
          })),
          total_absences_deductibles: item.total_absences_deductibles,
          total_jours_absences_deductibles: item.total_jours_absences_joui,
        }));
      }

      this.dataSource = new MatTableDataSource<getPointConge>(this.lstPointConge);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  setShownDetails(row: getPointConge) {
    this.shownPointConge = row;
  }








  public sortData(sort: Sort) {
    const data = this.lstPointConge.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstPointConge = data;
    } else {
      this.lstPointConge = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }



  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstPointConge = this.dataSource.filteredData;
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
