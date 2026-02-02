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
import { environment } from 'src/environments/environment';

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

  // Variables pour le regroupement
  public lstDetailsArrivage: any[] = [];
  public refSelectionnee: string = '';
  
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;

  public selectedFile: File | null = null;
  public url = environment.base_url_backend || environment.backend; 
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
      description: [""],
      piece_jointe: [null]
    });

    this.deleteEntreeStockForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }

  // --- GESTION DU FICHIER ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
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

  // --- GESTION DU REGROUPEMENT ET DÉTAILS ---

  /**
   * Récupère les détails d'un arrivage spécifique par sa référence
   * Appelée lors du clic sur "Voir détails"
   */
  voirDetailsArrivage(reference: string) {
    this.refSelectionnee = reference;
    this.lstDetailsArrivage = [];
    
    // On utilise le service pour récupérer les lignes spécifiques à cette référence
    // Note: Assurez-vous que cette méthode getDétailsParRéférence existe dans votre service
    this.entreeSortieStockService.getDétailsParRéférence(reference).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.lstDetailsArrivage = res.data;
        }
      },
      error: (err) => console.error("Erreur détails arrivage", err)
    });
  }
  // --- APPELS SERVICES ---

  private getTableData(): void {
    this.lstEntreeStock = [];
    this.serialNumberArray = [];
    
    // Le backend renvoie maintenant des données groupées via indexEntree()
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
      $('#spinner').removeClass('d-none');
  
      const formData = new FormData();
      const formValues = this.editEntreeStockForm.value;

      // On ajoute l'ID dans le FormData
      formData.append('id', formValues.id);

      Object.keys(formValues).forEach(key => {
        if (formValues[key] !== null && key !== 'piece_jointe' && key !== 'id') {
          formData.append(key, formValues[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('piece_jointe', this.selectedFile);
      }

      // Simulation de PUT pour Laravel via POST
      formData.append('_method', 'PUT');

      // On n'envoie qu'UN SEUL argument (formData) pour respecter la signature du service
      this.entreeSortieStockService.edit(formData).subscribe({
        next: (res: any) => {
          $('#spinner').addClass('d-none');
          this.closeModal('edit_department');
          this.getTableData();
          this.selectedFile = null;
          alert("Mouvement mis à jour avec succès !");
        },
        error: (err) => {
          $('#spinner').addClass('d-none');
          console.error(err);
          alert("Erreur lors de la modification. Vérifiez que votre service accepte le FormData.");
        }
      });
    }
  }

  onClickSubmitDelete(): void {
    if (this.deleteEntreeStockForm.valid) {
      // CORRECTION 404 : Envoyer l'ID numérique uniquement
      const idToDelete = this.deleteEntreeStockForm.value.id;
      
      this.entreeSortieStockService.delete(idToDelete).subscribe({
        next: () => {
           this.closeModal('delete_department');
           this.getTableData();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression (Code 404 - ID introuvable)");
        }
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
      alert("La liste des articles est vide !");
      return;
    }

    const formValues = this.addEntreeStockForm.value;
    if (!formValues.fournisseur_id || !formValues.reference) {
      alert("Veuillez remplir le fournisseur et la référence.");
      return;
    }

    $('#spinnerr').removeClass('d-none');

    const formData = new FormData();
    formData.append('reference', formValues.reference);
    formData.append('date_mouvement', formValues.date_mouvement);
    formData.append('fournisseur_id', formValues.fournisseur_id);
    
    if (this.selectedFile) {
      formData.append('piece_jointe', this.selectedFile, this.selectedFile.name);
    }

    formData.append('articles', JSON.stringify(this.articlesAAjouter));

    this.entreeSortieStockService.saveEntree(formData).subscribe({
      next: (res: any) => {
        $('#spinnerr').addClass('d-none');
        
        // On rafraîchit les données d'abord
        this.getTableData();
        
        // On vide les champs (incluant le fichier)
        this.resetAddForm();
        
        // Fermeture automatique : on essaie les IDs courants de votre template
        this.closeModal('add_department'); 
        this.closeModal('add_entree'); // Au cas où l'ID est différent
        
        // Enfin l'alerte
        setTimeout(() => {
            alert("Stock enregistré avec succès !");
        }, 100);
      },
      error: (err: any) => {
        $('#spinnerr').addClass('d-none');
        alert("Erreur serveur : " + (err.error?.message || "Échec de l'envoi"));
      }
    });
  }

  private resetAddForm() {
    this.articlesAAjouter = [];
    this.selectedFile = null;
    
    this.addEntreeStockForm.reset({
      date_mouvement: new Date().toISOString().split('T')[0],
      taux_tva: 0,
      description: "Entrée de stock"
    });

    // Reset physique de TOUS les inputs de type file
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = '';
    });
  }

  private closeModal(id: string) {
    // 1. Clic sur le bouton de fermeture natif pour laisser Bootstrap gérer le nettoyage
    const modalElement = document.getElementById(id);
    if (modalElement) {
        const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        if (closeBtn) {
            closeBtn.click();
        } else {
            // Fallback jQuery si le bouton n'est pas trouvé
            $(`#${id}`).modal('hide');
        }
    }

    // 2. Nettoyage forcé de sécurité pour éviter le gel de l'écran (Backdrop persistant)
    setTimeout(() => {
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $('body').css({ 'overflow': 'auto', 'padding-right': '0' });
    }, 300);
  }
}