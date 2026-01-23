import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

declare var $: any;

import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service";
import { articleService } from "../../core/services/article/article.service";
import { fournisseurService } from "../../core/services/fournisseur/fournisseur.service";

@Component({
  selector: 'app-entree-stock',
  templateUrl: './entree-stock.component.html',
  styleUrls: ['./entree-stock.component.scss']
})
export class EntreeStockComponent implements OnInit {
  public routes = routes;

  public lstEntreeStock: Array<any> = [];
  public lstFournisseur: any[] = [];
  public lstArticle: any[] = [];
  
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;

  // pagination variables
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

  public addEntreeStockForm!: FormGroup;
  public editEntreeStockForm!: FormGroup;
  public deleteEntreeStockForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private articleService: articleService,
    private fournisseurService: fournisseurService,
    private entreeSortieStockService: entreeSortieStockService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getTableData();
    this.getFournisseurs();
    this.getArticles();
  }

  private initForms(): void {
    this.addEntreeStockForm = this.formBuilder.group({
      article_id: ["", [Validators.required]],
      famille_id: ["", [Validators.required]],
      fournisseur_id: ["", [Validators.required]],
      reference: ["", [Validators.required]],
      date_mouvement: [new Date().toISOString().split('T')[0], [Validators.required]],
      quantite: ["", [Validators.required, Validators.min(1)]],
      prix_unitaire: ["", [Validators.required, Validators.min(0)]],
      taux_tva: [0, [Validators.min(0)]],
      description: ["Entrée de stock"]
    });

    this.editEntreeStockForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      article_id: ["", [Validators.required]],
      famille_id: ["", [Validators.required]],
      fournisseur_id: ["", [Validators.required]],
      reference: ["", [Validators.required]],
      date_mouvement: ["", [Validators.required]],
      quantite: ["", [Validators.required, Validators.min(1)]],
      prix_unitaire: ["", [Validators.required, Validators.min(0)]],
      taux_tva: [0, [Validators.min(0)]],
      description: [""]
    });

    this.deleteEntreeStockForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  // --- LOGIQUE DE PAGINATION ---

  public changePageSize(): void {
    this.pageIndex = 0;
    this.currentPage = 1;
    this.skip = 0;
    this.getTableData();
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
    } else if (event === 'previous') {
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

  // --- LOGIQUE DE TRI ---

  public sortData(sort: Sort) {
    const data = this.lstEntreeStock.slice();
    if (!sort.active || sort.direction === '') {
      this.lstEntreeStock = data;
    } else {
      this.lstEntreeStock = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  // --- APPELS SERVICES ---

  private getTableData(): void {
    this.lstEntreeStock = [];
    this.serialNumberArray = [];
    
    // Correction : Utilisation de getAll() conformément au service
    this.entreeSortieStockService.getAll().subscribe((res: any) => {
      const data = res.data?.data || res.data || [];
      this.totalData = res.data?.total || data.length;
      
      this.lstEntreeStock = data;
      this.dataSource = new MatTableDataSource<any>(this.lstEntreeStock);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  getFournisseurs(): void {
    this.fournisseurService.getAll().subscribe((res: any) => {
      this.lstFournisseur = res.data?.data || res.data || res;
    });
  }

  getArticles(): void {
    this.articleService.getAll().subscribe((res: any) => {
      this.lstArticle = res.data?.data || res.data || res;
    });
  }

  onClickSubmitAddEntreeStock(): void {
    if (this.addEntreeStockForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.entreeSortieStockService.saveEntree(this.addEntreeStockForm.value).subscribe({
        next: () => location.reload(),
        error: (err) => {
          $('#spinnerr').addClass('d-none');
          alert(err.error?.message || "Erreur lors de l'enregistrement");
        }
      });
    }
  }

  onClickSubmitEditEntree(): void {
    if (this.editEntreeStockForm.valid) {
      $('#spinner').removeClass('d-none'); // Affiche le spinner de chargement
  
      this.entreeSortieStockService.edit(this.editEntreeStockForm.value).subscribe({
        next: (res: any) => {
          // 1. Rafraîchir les données de la liste principale
          this.getTableData();
  
          // 2. Cacher le spinner
          $('#spinner').addClass('d-none');
  
          // 3. Fermeture automatique du modal de modification
          const modalElement = document.getElementById('edit_department');
          const closeBtn = modalElement?.querySelector('.btn-close') as HTMLElement;
          
          if (closeBtn) {
            closeBtn.click(); // Simule le clic sur la croix de fermeture
          } else {
            $('#edit_department').modal('hide'); // Repli sur jQuery si nécessaire
          }
  
          alert("Mouvement mis à jour avec succès !");
        },
        error: (err) => {
          $('#spinner').addClass('d-none');
          console.error(err);
          alert(err.error?.message || "Erreur lors de la modification");
        }
      });
    }
  }

  onClickSubmitDelete(): void {
    if (this.deleteEntreeStockForm.valid) {
      // Correction : Utilisation de delete() conformément au service
      this.entreeSortieStockService.delete(this.deleteEntreeStockForm.value).subscribe({
        next: () => location.reload(),
        error: (err) => alert("Erreur lors de la suppression")
      });
    }
  }

  // --- UTILITAIRES ---

  onArticleChange(event: any, formType: 'add' | 'edit'): void {
    const articleId = event.target.value;
    const selectedArticle = this.lstArticle.find(a => a.id == articleId);
    if (selectedArticle && selectedArticle.famille_id) {
      const form = formType === 'add' ? this.addEntreeStockForm : this.editEntreeStockForm;
      form.patchValue({ famille_id: selectedArticle.famille_id });
    }
  }

  getEditForm(row: any): void {
    this.editEntreeStockForm.patchValue({
      id: row.id,
      article_id: row.article_id,
      famille_id: row.famille_id,
      fournisseur_id: row.fournisseur_id,
      reference: row.reference,
      date_mouvement: row.date_mouvement,
      quantite: row.quantite,
      prix_unitaire: row.prix_unitaire,
      taux_tva: row.taux_tva,
      description: row.description
    });
  }

  getDeleteForm(row: any): void {
    this.deleteEntreeStockForm.patchValue({ id: row.id });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEntreeStock = this.dataSource.filteredData;
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

  // Liste temporaire pour stocker les lignes avant envoi
  articlesAAjouter: any[] = [];

  ajouterLigneALaListe() {
    const formValues = this.addEntreeStockForm.value;
    
    // Trouver l'article sélectionné pour récupérer son nom et sa famille
    const selectedArticle = this.lstArticle.find(a => a.id == formValues.article_id);
  
    if (!selectedArticle || !formValues.quantite || !formValues.prix_unitaire) {
      alert("Veuillez sélectionner un article, une quantité et un prix.");
      return;
    }
  
    const nouvelleLigne = {
      article_id: formValues.article_id,
      designation: selectedArticle.designation, // Pour l'affichage dans le tableau HTML
      fournisseur_id: formValues.fournisseur_id,
      date_mouvement: formValues.date_mouvement,
      reference: formValues.reference,
      quantite: formValues.quantite,
      prix_unitaire: formValues.prix_unitaire,
      famille_id: selectedArticle.famille_id, // On prend la vraie famille de l'article
      taux_tva: formValues.taux_tva || 0,
      description: formValues.description || 'Entrée groupée'
    };
  
    this.articlesAAjouter.push(nouvelleLigne);
    
    // On reset uniquement les champs de saisie d'article pour le suivant
    this.addEntreeStockForm.patchValue({
      article_id: '',
      quantite: '',
      prix_unitaire: ''
    });
  }

  retirerLigne(index: number) {
    this.articlesAAjouter.splice(index, 1);
  }

  validerToutLeStock() {
    if (this.articlesAAjouter.length === 0) {
      alert("La liste est vide !");
      return;
    }
  
    const estValide = this.articlesAAjouter.every(item => item.fournisseur_id && item.reference);
  
    if (!estValide) {
      alert("Certaines lignes n'ont pas de fournisseur ou de référence. Veuillez recommencer l'ajout.");
      return;
    }
  
    this.entreeSortieStockService.saveEntree(this.articlesAAjouter).subscribe({
      next: (res: any) => {
        this.getTableData();
        this.articlesAAjouter = [];
  
        this.addEntreeStockForm.reset({
          date_mouvement: new Date().toISOString().split('T')[0],
          taux_tva: 0,
          description: "Entrée de stock"
        });
  
        // --- SOLUTION DE FERMETURE ROBUSTE ---
        // On cherche le bouton de fermeture à l'intérieur du modal d'ajout
        const modalElement = document.getElementById('add_department');
        const closeBtn = modalElement?.querySelector('.btn-close') as HTMLElement;
        
        if (closeBtn) {
          closeBtn.click(); // Simule le clic sur la croix
        } else {
          // Repli sur jQuery si le bouton n'est pas trouvé
          $('#add_department').modal('hide');
        }
        
        alert("Stock enregistré avec succès !");
      },
      error: (err: any) => {
        console.error(err);
        alert("Erreur serveur : " + (err.error?.message || "Vérifiez vos données"));
      }
    });
  }
}