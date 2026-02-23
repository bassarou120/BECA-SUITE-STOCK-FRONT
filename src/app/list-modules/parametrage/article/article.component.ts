import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ExportsService, routes, banqueService, getBanque, getFournisseur } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { bureauService } from "../../../core/services/bureau/bureau.service";
import { articleService } from "../../../core/services/article/article.service";
import { FamilleService } from "../../../core/services/famille/famille.service";
import { categorieArticleService } from "../../../core/services/categorie-article/categorie-article.service";
import { ImportReport, ImportError } from 'src/app/core/services/interface/models';
declare var bootstrap: any;

@Component({
  selector: 'app-banque',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any> = [];


  public lstArticle: Array<any> = [];
  lstFamille: any;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;
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
  alertImportVisible: boolean = false;
  isImporting: boolean = false;

  public toastVisible: boolean = false;
  public toastType: 'success' | 'danger' | 'warning' | 'black' = 'success'; // Type d'alerte Bootstrap
  public toastTitle: string = '';
  public toastMessage: string = '';
  public ignoredLines: string[] = []; // Pour stocker les lignes ignorées


  importReport: ImportReport | null = null;
  importError: ImportError | null = null;

  selectedFile: File | null = null;
  selectedImage: string | ArrayBuffer | null = null;

  showIgnoredDetails: boolean = false;

  public addArticleForm!: FormGroup;
  public editArticleForm!: FormGroup
  public deleteArticleForm!: FormGroup

  constructor(private formBuilder: FormBuilder, public router: Router,
    private articleService: articleService,
    private categorieService: categorieArticleService,
    private familleService: FamilleService,
    private exp: ExportsService) { }

  ngOnInit(): void {
    this.getTableData();
    this.getFamille();

    this.addArticleForm = this.formBuilder.group({
      famille_id: ["", [Validators.required]],
      code: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      seuil_alerte: [0, [Validators.required]],
      description: ["", []],
    });
    this.editArticleForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      famille_id: ["", [Validators.required]],
      code: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      seuil_alerte: [0, [Validators.required]],
      description: ["", []],
    });
    this.deleteArticleForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }


  getFamille() {

    this.familleService.getAll().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data.data))
        this.lstFamille = res.data.data

      },
      (error: any) => {

      });


  }

  onClickSubmitAddArticle() {

    console.log("les entree", this.addArticleForm.value)

    if (this.addArticleForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.articleService.save(this.addArticleForm.value).subscribe(
        (data: any) => {
          // location.reload();
        }
      )
    } else {
      $('#spinnerr').addClass('d-none');
      alert("desole le formulaire n'est pas bien renseigné")
    }


  }

  onClickSubmitEditArticle() {
    console.log(this.editArticleForm.value)

    if (this.editArticleForm.valid) {
      $('#spinner').removeClass('d-none');
      const id = this.editArticleForm.value.id;
      this.articleService.edit(this.editArticleForm.value).subscribe(
        (data: any) => {
          location.reload();
        }
      )
      console.log("success")
    } else {
      $('#spinner').addClass('d-none');
      alert("desole le formulaire n'est pas bien renseigné")
    }

  }

  onClickSubmitDeleteBanque() {
    console.log(this.deleteArticleForm.value)

    if (this.deleteArticleForm.valid) {
      const id = this.deleteArticleForm.value.id;
      this.articleService.delete(this.deleteArticleForm.value).subscribe(
        (data: any) => {

          // alert(JSON.stringify(data))
          location.reload();
        }
      )
      console.log("success")
    } else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

  }

  getEditForm(row: any) {
    this.editArticleForm.patchValue({
      id: row.id,
      code: row.code,
      famille_id: row.famille_id,
      description: row.description,
      designation: row.designation,
      seuil_alerte: row.seuil_alerte
    })
  }

  getDeleteForm(row: any) {
    this.deleteArticleForm.patchValue({
      id: row.id,
    })
  }


  private getTableData(): void {
    this.lstArticle = [];
    this.serialNumberArray = [];

    this.articleService.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstArticle.push(res);


          this.serialNumberArray.push(serialNumber);
        }
      });
      console.log(this.lstArticle);
      this.dataSource = new MatTableDataSource<any>(this.lstArticle);
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
      const filename = "Les Articles.xlsx";

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
        XLSX.utils.book_append_sheet(wb, ws1, "Les Articles");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }

  public sortData(sort: Sort) {
    const data = this.lstArticle.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstArticle = data;
    } else {
      this.lstArticle = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstArticle = this.dataSource.filteredData;
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

// ============================================
// FONCTION showToast() COMPLÈTE
// ============================================

showToast(type: 'success' | 'danger' | 'warning' | 'black', title: string, message: string): void {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastVisible = true;

    // Masquer le toast automatiquement après 60 secondes
    setTimeout(() => {
        this.toastVisible = false;
        this.ignoredLines = [];
    }, 60000);
}

// ============================================
// FONCTION closeToast() - Optionnelle
// ============================================

closeToast(): void {
    this.toastVisible = false;
    this.ignoredLines = [];
}

// ============================================
// FONCTION closeAlert() - Optionnelle
// ============================================

closeAlert(): void {
    this.alertImportVisible = false;
    this.showIgnoredDetails = false;
}

onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Assignez le fichier à `selectedFile`
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
}

  /**
   * Envoie le fichier Excel sélectionné au backend pour importation.
   */
  /**
   * Envoie le fichier Excel sélectionné au backend pour importation.
   */
uploadExcelFile(): void {
    if (!this.selectedFile) {
        const modal = document.getElementById('importArticlesExcel');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal?.hide();
        this.showToast('warning', 'Sélection de Fichier', 'Veuillez sélectionner un fichier Excel à importer.');
        return;
    }

    this.isImporting = true;
    this.importReport = null;
    this.importError = null;
    this.showIgnoredDetails = false; // Réinitialiser l'affichage des détails

    const spinner = document.querySelector('.spinner-import-article');
    if (spinner) {
        spinner.classList.remove('d-none');
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.articleService.importArticles(formData).subscribe({
        next: (response: any) => {
            console.log('✅ Importation réussie:', response);
            
            // Rafraîchir la liste des articles
            this.getTableData();

            this.isImporting = false;
            if (spinner) {
                spinner.classList.add('d-none');
            }

// Fermer le modal en simulant un clic sur le bouton X
            const modal = document.getElementById('importArticlesExcel');
            if (modal) {
                const closeButton = modal.querySelector('.btn-close') as HTMLButtonElement;
                closeButton?.click();
            }

            // Stocker le rapport d'importation
            this.importReport = {
                message: response.message,
                success_count: response.success_count,
                total_rows_processed: response.total_rows_processed,
                ignored: response.ignored_details || []
            };

            // 👇 AFFICHER L'ALERTE DE SUCCÈS
            this.alertImportVisible = true;
            
            // Masquer l'alerte après 10 secondes
            setTimeout(() => {
                this.alertImportVisible = false;
                this.showIgnoredDetails = false;
            }, 10000);

            // ✅ Afficher le toast en fonction du résultat
            if (this.importReport.ignored.length > 0) {
                // Import partiel avec des lignes ignorées
                this.ignoredLines = this.importReport.ignored;
                this.showToast(
                    'warning',
                    'Importation Partielle',
                    `${this.importReport.success_count} articles(s) importé(s), ${this.importReport.ignored.length} ligne(s) ignorée(s).`
                );
            } else {
                // Import complet sans erreur
                this.ignoredLines = [];
                this.showToast(
                    'success',
                    'Importation Réussie !',
                    `${this.importReport.success_count} articles(s) importé(s) avec succès.`
                );

                const modal = document.getElementById('importArticlesExcel');
                if (modal) {
                    const closeButton = modal.querySelector('.btn-close') as HTMLButtonElement;
                    closeButton?.click();
                }
            }

            // Réinitialiser le fichier sélectionné
            this.selectedFile = null;
            const fileInput = document.getElementById('excelFile') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        },
        error: (error) => {
            console.error('❌ Erreur lors de l\'importation des articles:', error);

            this.isImporting = false;
            if (spinner) {
                spinner.classList.add('d-none');
            }

            // GESTION DE L'ERREUR
            let errorMessage = 'Une erreur est survenue lors de l\'importation. Veuillez vérifier le fichier et réessayer.';
            let errorTitle = 'Erreur d\'Importation';

            if (error.error) {
                if (error.error.errors) {
                    // Erreur de validation (422)
                    let validationErrors = [];
                    for (const key in error.error.errors) {
                        if (error.error.errors.hasOwnProperty(key)) {
                            validationErrors.push(error.error.errors[key].join(', '));
                        }
                    }
                    errorMessage = 'Erreurs de validation : ' + validationErrors.join('; ');
                    errorTitle = 'Fichier Invalide';
                } else if (error.error.error) {
                    // Erreur du backend
                    errorMessage = error.error.error;
                    if (error.error.details) {
                        errorMessage += ` Détails: ${error.error.details}`;
                    }
                    errorTitle = 'Erreur Serveur';
                }
            }

            this.ignoredLines = [];
            this.showToast('danger', errorTitle, errorMessage);
        }
    });
}


}
export interface pageSelection {
  skip: number;
  limit: number;
}
