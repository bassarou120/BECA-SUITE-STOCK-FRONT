import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ExportsService, routes } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx';
import { CategorieFournisseurService } from "../../../core/services/catagorie-fournisseur/categorie-fournisseur.service";

declare var $: any;

@Component({
  selector: 'app-categorie-fournisseur',
  templateUrl: './categorie-fournisseur.component.html',
  styleUrls: ['./categorie-fournisseur.component.scss']
})
export class CategorieFournisseurComponent implements OnInit {
  public routes = routes;
  
  public lstCategorie: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;

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

  public addCategorieForm!: FormGroup;
  public editCategorieForm!: FormGroup;
  public deleteCategorieForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router, 
    private categorieService: CategorieFournisseurService,
    private exp: ExportsService
  ) {}

  ngOnInit(): void {
    this.getTableData();
    
    // Ajout du champ 'code' dans le formulaire d'ajout
    this.addCategorieForm = this.formBuilder.group({
      code: ["", [Validators.required, Validators.maxLength(10)]],
      intitule: ["", [Validators.required]],
    });

    // Ajout du champ 'code' dans le formulaire de modification
    this.editCategorieForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      code: ["", [Validators.required, Validators.maxLength(10)]],
      intitule: ["", [Validators.required]],
    });

    this.deleteCategorieForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  onClickSubmitAdd() {
    if (this.addCategorieForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.categorieService.save(this.addCategorieForm.value).subscribe(
        (data: any) => {
          location.reload();
        },
        (error) => {
          $('#spinnerr').addClass('d-none');
          // Affiche l'erreur si le code est déjà utilisé (erreur 422 du backend)
          alert(error.error.message || "Une erreur est survenue");
        }
      );
    }
  }

  onClickSubmitEdit() {
    if (this.editCategorieForm.valid) {
      $('#spinner').removeClass('d-none');
      this.categorieService.edit(this.editCategorieForm.value).subscribe(
        (data: any) => {
          location.reload();
        },
        (error) => {
          $('#spinner').addClass('d-none');
          alert(error.error.message || "Une erreur est survenue");
        }
      );
    }
  }

  onClickSubmitDelete() {
    if (this.deleteCategorieForm.valid) {
      this.categorieService.delete(this.deleteCategorieForm.value.id).subscribe(
        (data: any) => {
          location.reload();
        }
      );
    }
  }

  // Mise à jour pour inclure le code lors de l'ouverture du modal de modification
  getEditForm(row: any) {
    this.editCategorieForm.patchValue({
      id: row.id,
      code: row.code,
      intitule: row.intitule
    });
  }

  getDeleteForm(row: any) {
    this.deleteCategorieForm.patchValue({
      id: row.id,
    });
  }

  private getTableData(): void {
    this.lstCategorie = [];
    this.serialNumberArray = [];

    this.categorieService.getAll().subscribe((res: any) => {
      const data = res.data || res;
      this.totalData = data.length;

      data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.lstCategorie.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      
      this.dataSource = new MatTableDataSource<any>(data);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  public changePageSize(): void {
    this.pageIndex = 0;
    this.skip = 0;
    this.limit = this.pageSize;
    this.currentPage = 1;
    this.getTableData();
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    this.getTableData();
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstCategorie = this.dataSource.filteredData.slice(this.skip, this.limit);
  }

  public sortData(sort: Sort) {
    const data = this.lstCategorie.slice();
    if (!sort.active || sort.direction === '') {
      this.lstCategorie = data;
    } else {
      this.lstCategorie = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    this.pageIndex = this.currentPage - 1;
    this.limit = this.pageSize * this.currentPage;
    this.skip = this.pageSize * this.pageIndex;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.pageSelection = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  exportToXLSX() {
    const table: HTMLElement | null = document.getElementById('to_export');
    if (table) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, "Categories Fournisseurs");
      XLSX.writeFile(wb, "Categories_Fournisseurs.xlsx");
    }
  }
}

export interface pageSelection {
  skip: number;
  limit: number;
}