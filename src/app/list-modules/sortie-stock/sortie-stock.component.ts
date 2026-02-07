import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service";
import { articleService } from "../../core/services/article/article.service";
import { DirectionCentreService } from "../../../../src/app/core/services/directionCentre/directionCentre.service";
import { LocalisationService } from "../../../../src/app/core/services/localisation/localisation.service";

import * as $ from 'jquery';

@Component({
  selector: 'app-sortie-stock',
  templateUrl: './sortie-stock.component.html',
  styleUrls: ['./sortie-stock.component.scss']
})
export class SortieStockComponent implements OnInit {
  public routes = routes;


  // Listes de données pour les dropdowns
  public lstSortieStock: Array<any> = []; // Liste groupée par référence
  public lstArticles: any[] = [];
  public lstLocalisations: any[] = [];
  public lstDirections: any[] = [];


  // Liste temporaire pour le bon de sortie en cours de création
  public lstArticlesAajouter: any[] = [];

  // Détails pour la vue "Détails"
  public lstArticlesDetails: any[] = [];
  public refSelectionnee = "";

  public stockDisponible = 0;
  public showloader = false;

  // Formulaires
  public addSortieForm!: FormGroup;
  public itemToDelete: any;

  // Table & Pagination
  public dataSource!: MatTableDataSource<any>;
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;

  // Alertes
  public showAlert = false;
  public messageAlert = "";
  public isDisabledBtn = false;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private articleService: articleService,
    private directionService: DirectionCentreService,
    private localisationService: LocalisationService,
    private stockService: entreeSortieStockService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadInitialData();
    this.getTableData();
    this.loadNextReference();
  }

  private initForms() {
    this.addSortieForm = this.formBuilder.group({
      reference: ['', [Validators.required]],
      date_mouvement: [new Date().toISOString().split('T')[0], [Validators.required]],
      localisation_id: ['', [Validators.required]],
      direction_id: ['', [Validators.required]],
      // Champs pour l'ajout d'une ligne d'article
      temp_article_id: [''],
      temp_quantite: [1],
      temp_description: ['Sortie de stock']
    });
  }

  private loadInitialData() {
    // Articles
    this.articleService.getAll().subscribe(res => this.lstArticles = res.data?.data || res.data);

    // Localisations
    this.localisationService.getAll().subscribe(res => this.lstLocalisations = res.data?.data || res.data);

    // Directions
    this.directionService.getAll().subscribe(res => this.lstDirections = res.data?.data || res.data);
  }

  /**
   * Vérifie le stock lors du choix d'un article dans le modal
   */
  onChangeArticle() {
    const articleId = this.addSortieForm.get('temp_article_id')?.value;
    if (!articleId) return;

    this.stockService.getStockByArticle({ article_id: articleId }).subscribe((resp: any) => {
      this.stockDisponible = resp.data?.qte_actuel || 0;
    });
  }

  /**
   * Ajoute un article à la liste temporaire du bon de sortie
   */
  ajouterArticleALaListe() {
    const artId = this.addSortieForm.get('temp_article_id')?.value;
    const qte = this.addSortieForm.get('temp_quantite')?.value;
    const desc = this.addSortieForm.get('temp_description')?.value;

    if (!artId || qte <= 0) {
      alert("Sélectionnez un article et une quantité valide.");
      return;
    }

    if (qte > this.stockDisponible) {
      alert(`Stock insuffisant ! Disponible : ${this.stockDisponible}`);
      return;
    }

    const articleComplet = this.lstArticles.find(a => a.id == artId);

    // Ajouter à la liste locale
    this.lstArticlesAajouter.push({
      article_id: artId,
      code: articleComplet?.code,
      designation: articleComplet?.designation,
      quantite: qte,
      description: desc
    });

    // Reset les champs temporaires
    this.addSortieForm.patchValue({ temp_article_id: '', temp_quantite: 1 });
    this.stockDisponible = 0;
  }

  retirerArticle(index: number) {
    this.lstArticlesAajouter.splice(index, 1);
  }

  loadNextReference() {
  this.stockService.getNextReferenceSortie().subscribe(res => {
    this.addSortieForm.patchValue({
      reference: res.reference
    });
  });
}

telechargerPdfSortie(reference: string) {
  this.stockService.exportPdfSortie(reference).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bon_sortie_${reference}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      alert('Erreur lors du téléchargement du PDF');
    }
  });
}


  /**
   * Enregistrement final du bon de sortie au backend
   */
  onClickSubmitAddSortie() {
    if (this.addSortieForm.invalid) {
      alert("Veuillez remplir les informations du bon (Réf, Date, Direction, Localisation).");
      return;
    }

    if (this.lstArticlesAajouter.length === 0) {
      alert("Ajoutez au moins un article au bon de sortie.");
      return;
    }

    this.showloader = true;
    $('#spinnerr').removeClass('d-none');

    // Récupération explicite des valeurs pour éviter les 'null'
    const payload = {
      reference: this.addSortieForm.get('reference')?.value,
      date_mouvement: this.addSortieForm.get('date_mouvement')?.value,
      localisation_id: this.addSortieForm.get('localisation_id')?.value, // Vérifiez que le select HTML utilise bien ce nom
      direction_id: this.addSortieForm.get('direction_id')?.value,       // Vérifiez que le select HTML utilise bien ce nom
      articles: this.lstArticlesAajouter.map(a => ({
        article_id: a.article_id,
        quantite: a.quantite,
        description: a.description
      }))
    };

    // Note: On ne fait plus JSON.stringify ici si le service s'en charge ou si le backend attend du JSON pur
    this.stockService.saveSortie(payload).subscribe({
      next: () => {
        $('#spinnerr').addClass('d-none');
        this.lstArticlesAajouter = [];
        alert("Sortie enregistrée avec succès !");
        location.reload();
      },
      error: (err) => {
        $('#spinnerr').addClass('d-none');
        this.showloader = false;
        alert(err.error?.message || "Erreur lors de l'enregistrement.");
      }
    });
}
  /**
   * Liste des bons de sortie groupés
   */
  getTableData(): void {
    this.stockService.getAllSorties().subscribe((res: any) => {
      this.lstSortieStock = res.data?.data || res.data || [];
      this.dataSource = new MatTableDataSource<any>(this.lstSortieStock);
      this.totalData = this.lstSortieStock.length;
    });
  }

  /**
   * Voir les articles d'un bon spécifique
   */
  voirDetails(reference: string) {
    this.refSelectionnee = reference;
    this.stockService.getDetailsSortie(reference).subscribe((res: any) => {
      this.lstArticlesDetails = res.data;
    });
  }

  // --- NOUVELLES MÉTHODES POUR CORRIGER LES ERREURS ---

  public sortData(sort: Sort) {
    const data = this.lstSortieStock.slice();
    if (!sort.active || sort.direction === '') {
      this.lstSortieStock = data;
    } else {
      this.lstSortieStock = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getDeleteForm(item: any) {
    this.itemToDelete = item;
  }

  public onClickSubmitDelete() {
    if (!this.itemToDelete) return;

    const reference = this.itemToDelete.reference;
    this.showloader = true;

    // On lance la suppression via le service
    this.stockService.deleteSortieByRef(reference).subscribe({
      next: (res) => {
        // --- ÉTAPE 1 : FERMETURE MANUELLE DU MODAL ---
        // On récupère l'élément par son ID (celui défini dans votre HTML)
        const modalElement = document.getElementById('delete_sortie');

        if (modalElement) {
          // On retire les classes Bootstrap qui affichent le modal
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          modalElement.setAttribute('aria-hidden', 'true');
        }

        // --- ÉTAPE 2 : NETTOYAGE DU BACKDROP (LE VOILE NOIR) ---
        // C'est souvent lui qui bloque l'écran si on ne le supprime pas
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());

        // On redonne au corps de la page la possibilité de scroller
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // --- ÉTAPE 3 : MISE À JOUR DE LA VUE ---
        // On rafraîchit la liste des données immédiatement
        this.getTableData();

        this.showloader = false;
        alert("Supprimé avec avec succès !");
        console.log("Suppression réussie et interface nettoyée.");
      },
      error: (err) => {
        this.showloader = false;
        alert(err.error?.message || "Erreur lors de la suppression.");
        console.error("Erreur lors de la suppression", err);
        // Optionnel : afficher un message d'erreur à l'utilisateur ici
      }
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstSortieStock = this.dataSource.filteredData;
  }

  /**
 * Retrouve l'intitulé de la direction à partir de son ID
 */
getDirectionLibelle(id: any): string {
  if (!id) return 'Non définie';
  // On cherche dans la liste des directions chargée au début
  const found = this.lstDirections.find(d => d.id == id);
  return found ? found.intitule : 'Non définie';
}

/**
* Retrouve le nom de la localisation à partir de son ID
*/
getLocalisationLibelle(id: any): string {
  if (!id) return 'Non définie';
  // On cherche dans la liste des localisations chargée au début
  const found = this.lstLocalisations.find(l => l.id == id);
  return found ? found.nom_localisation : 'Non définie';
}
}
