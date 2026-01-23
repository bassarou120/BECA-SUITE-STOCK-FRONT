import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

declare var $: any;

import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service";


@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.scss']
})
export class EtatStockComponent implements OnInit {
  public routes = routes;

  // Liste des données
  public lstEtatStock: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;

  // Pagination
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  constructor(
    public router: Router,
    private entreeSortieStockService: entreeSortieStockService
  ) {}

  ngOnInit(): void {
    this.getTableData();
  }

  public getTableData(): void {
    this.lstEtatStock = [];
    this.serialNumberArray = [];

    // On utilise la méthode qui pointe vers 'get-etat-stock' dans Laravel
    this.entreeSortieStockService.getAllStock().subscribe({
      next: (res: any) => {
        // Selon votre PostResource Laravel, les données sont dans res.data
        const data = res.data || [];
        this.totalData = data.length;

        this.lstEtatStock = data;
        this.dataSource = new MatTableDataSource<any>(this.lstEtatStock);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
      error: (err) => console.error("Erreur lors de la récupération du stock", err)
    });
  }

  // --- LOGIQUE DE RECHERCHE ---
  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEtatStock = this.dataSource.filteredData;
  }

  // --- EXPORT EXCEL ---
  exportToXLSX() {
    $('#spinner_xlsx').removeClass('d-none');
    const table: HTMLElement | null = document.getElementById('to_export');
    if (table) {
      const ws = XLSX.utils.table_to_sheet(table);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Etat_Stock");
      XLSX.writeFile(wb, "Etat_du_Stock_" + new Date().toLocaleDateString() + ".xlsx");
      $('#spinner_xlsx').addClass('d-none');
    }
  }

  // --- PAGINATION (Simplifiée) ---
  public changePageSize(): void {
    this.pageIndex = 0;
    this.currentPage = 1;
    this.skip = 0;
    this.getTableData();
  }
  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    this.pageIndex = this.currentPage - 1;
    this.skip = this.pageSize * this.pageIndex;
    this.getTableData();
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = (pageNumber - 1) * this.pageSize;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: (i - 1) * pageSize, limit: i * pageSize });
    }
  }

  public sortData(sort: Sort) {
    const data = this.lstEtatStock.slice();
    if (!sort.active || sort.direction === '') {
      this.lstEtatStock = data;
    } else {
      this.lstEtatStock = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}