import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ExportsService, routes, getFournisseur } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx';
import { fournisseurService } from "../../../core/services/fournisseur/fournisseur.service";
import { CategorieFournisseurService } from "../../../core/services/catagorie-fournisseur/categorie-fournisseur.service";

declare var $: any;

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {
  public routes = routes;
  
  public lstFournisseur: Array<any> = [];
  public lstCategorie: Array<any> = []; // Pour le select des catégories
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getFournisseur>;

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

  public addFournisseurForm!: FormGroup;
  public editFournisseurForm!: FormGroup;
  public deleteFournisseurForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router, 
    private fournisseurService: fournisseurService,
    private categorieService: CategorieFournisseurService,
    private exp: ExportsService
  ) {}

  ngOnInit(): void {
    this.getTableData();
    this.getCategories(); // Charger les catégories pour le formulaire

    this.addFournisseurForm = this.formBuilder.group({
      code: ["", [Validators.required, Validators.maxLength(20)]],
      intitule: ["", [Validators.required]],
      categorie_fournisseur_id: ["", [Validators.required]]
    });

    this.editFournisseurForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      code: ["", [Validators.required, Validators.maxLength(20)]],
      intitule: ["", [Validators.required]],
      categorie_fournisseur_id: ["", [Validators.required]]
    });

    this.deleteFournisseurForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  // Charger les catégories pour le menu déroulant
  private getCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (res: any) => {
        // Si Laravel renvoie { data: [...] }, on prend res.data, sinon on prend res
        this.lstCategorie = res.data ? res.data : res;
        console.log("Catégories chargées :", this.lstCategorie);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des catégories :", err);
      }
    });
  }

  onClickSubmitAddBanque() {
    if (this.addFournisseurForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.fournisseurService.save(this.addFournisseurForm.value).subscribe(
        (data: any) => {
          location.reload();
        },
        (error) => {
          $('#spinnerr').addClass('d-none');
          alert(error.error.message || "Erreur lors de l'ajout");
        }
      );
    } else {
      alert("Désolé, le formulaire n'est pas bien renseigné");
    }
  }

  onClickSubmitEditBanque() {
    if (this.editFournisseurForm.valid) {
      $('#spinner').removeClass('d-none');
      this.fournisseurService.edit(this.editFournisseurForm.value).subscribe(
        (data: any) => {
          location.reload();
        },
        (error) => {
          $('#spinner').addClass('d-none');
          alert(error.error.message || "Erreur lors de la modification");
        }
      );
    } else {
      alert("Désolé, le formulaire n'est pas bien renseigné");
    }
  }

  onClickSubmitDeleteBanque() {
    if (this.deleteFournisseurForm.valid) {
      this.fournisseurService.delete(this.deleteFournisseurForm.value.id).subscribe(
        (data: any) => {
          location.reload();
        }
      );
    }
  }

  getEditForm(row: any) {
    this.editFournisseurForm.patchValue({
      id: row.id,
      code: row.code,
      intitule: row.intitule,
      categorie_fournisseur_id: row.categorie_fournisseur_id
    });
  }

  getDeleteForm(row: any) {
    this.deleteFournisseurForm.patchValue({
      id: row.id,
    });
  }

  private getTableData(): void {
    this.lstFournisseur = [];
    this.serialNumberArray = [];

    this.fournisseurService.getAll().subscribe((res: any) => {
      const data = res.data || res;
      this.totalData = data.length;

      data.map((item: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.lstFournisseur.push(item);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getFournisseur>(data);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  exportToXLSX() {
    $('#spinner_xlsx').removeClass('d-none');
    setTimeout(() => {
      const table: HTMLElement | null = document.getElementById('to_export');
      if (table) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, "Fournisseurs");
        XLSX.writeFile(wb, "Liste_Fournisseurs.xlsx");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }

  public sortData(sort: Sort) {
    const data = this.lstFournisseur.slice();
    if (!sort.active || sort.direction === '') {
      this.lstFournisseur = data;
    } else {
      this.lstFournisseur = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstFournisseur = this.dataSource.filteredData.slice(this.skip, this.limit);
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

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageIndex = 0;
    this.skip = 0;
    this.limit = this.pageSize;
    this.currentPage = 1;
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
}

export interface pageSelection {
  skip: number;
  limit: number;
}