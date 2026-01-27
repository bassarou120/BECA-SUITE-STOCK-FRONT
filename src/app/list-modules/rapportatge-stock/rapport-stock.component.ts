import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { bureauService } from "../../core/services/bureau/bureau.service";
import { immoService } from "../../core/services/immo/immo.service";
import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service"; 
import * as $ from 'jquery';

@Component({
  selector: 'app-rapport-stock',
  templateUrl: './rapport-stock.component.html',
  styleUrls: ['./rapport-stock.component.scss'],
})
export class rapportStockComponent implements OnInit {
  public showloader = false;
  public rapportStockForm!: FormGroup;
  
  // Liste pour stocker les données du tableau
  public lstMouvements: any[] = []; 
  
  // Statistiques optionnelles pour l'affichage (valeur stock, etc.)
  public stats: any = null;

  public listAnnee: any;
  public lstEmployer: any;
  public lstBureau: any;

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private employeService: EmployeService,
    private bureauService: bureauService,
    private immoService: immoService,
    private stockService: entreeSortieStockService 
  ) {}

  ngOnInit() {
    this.getBureau();
    this.getEmploye();
    this.initForm();

    let res = [];
    for (let index = 2024; index < 2050; index++) {
      res.push(index);
    }
    this.listAnnee = res;
  }

  initForm() {
    this.rapportStockForm = this.formBuilder.group({
      type_rapport: ['', [Validators.required]],
      date_debut: [''],
      date_fin: [''],
    });

    /**
     * ECOUTEUR DE CHANGEMENT DE TYPE DE RAPPORT
     * Correction : Réinitialise les données dès que l'utilisateur change de type
     */
    this.rapportStockForm.get('type_rapport')?.valueChanges.subscribe(value => {
      // 1. On vide le tableau immédiatement pour un aspect "pro"
      this.lstMouvements = [];
      this.stats = null;

      const dateDebut = this.rapportStockForm.get('date_debut');
      const dateFin = this.rapportStockForm.get('date_fin');

      // 2. Gestion dynamique des validations
      if (value === 'rapport_entree' || value === 'rapport_sortie') {
        dateDebut?.setValidators([Validators.required]);
        dateFin?.setValidators([Validators.required]);
      } else {
        // Pour l'état de stock, on vide aussi les champs dates
        dateDebut?.clearValidators();
        dateFin?.clearValidators();
        dateDebut?.setValue('');
        dateFin?.setValue('');
      }
      dateDebut?.updateValueAndValidity();
      dateFin?.updateValueAndValidity();
    });
  }

  /**
   * RECHERCHE / AFFICHAGE DES DONNÉES
   */
  onClickSubmitRapportStock() {
    if (this.rapportStockForm.invalid) {
      alert('Veuillez remplir les champs requis (Type et Dates si nécessaire)');
      return;
    }

    this.showloader = true;
    this.lstMouvements = []; // Sécurité : on vide à nouveau avant l'appel

    const params = this.rapportStockForm.value;

    if (params.type_rapport === 'rapport_etat') {
      this.stockService.getRapportEtatStockData().subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstMouvements = res.data || [];
          this.stats = res.statistiques; // On stocke les stats si besoin d'affichage
          if (this.lstMouvements.length === 0) alert("Aucun article en stock trouvé");
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.stockService.getRapportEntreesData(params).subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstMouvements = res.data || []; 
          this.stats = res.statistiques;
          if (this.lstMouvements.length === 0) alert("Aucune donnée trouvée pour cette période");
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  /**
   * GENERATION PDF
   */
  telechargerPdf() {
    if (this.rapportStockForm.invalid) return;
    if (this.lstMouvements.length === 0) {
      alert("Veuillez d'abord afficher les données avant de télécharger le PDF");
      return;
    }

    this.showloader = true;
    $('#spinnerr').removeClass('d-none');

    const params = this.rapportStockForm.value;
    
    const exportObservable = (params.type_rapport === 'rapport_etat') 
      ? this.stockService.exportPdfEtatStock() 
      : this.stockService.exportPdfEntrees(params);

    exportObservable.subscribe({
        next: (res: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;

            const url = res.success ? (res.url || res.data?.url) : null;
            
            if (url) {
                // Utilisation d'un lien temporaire pour forcer le téléchargement si possible
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.download = url.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert("Erreur: URL du PDF introuvable.");
            }
        },
        error: (err: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;
            alert("Erreur lors de la génération du PDF.");
        }
    });
  }

  private handleError(err: any) {
    this.showloader = false;
    console.error(err);
    alert("Erreur de récupération : " + (err.error?.message || "Serveur injoignable"));
  }

  // --- Chargement des données de base ---

  getEmploye() {
    this.employeService.getAllEmploye().subscribe({
      next: (res: any) => this.lstEmployer = res.data,
      error: (err) => console.error(err)
    });
  }

  getBureau() {
    this.bureauService.getAll().subscribe({
      next: (res: any) => this.lstBureau = res.data?.data || res.data,
      error: (err) => console.error(err)
    });
  }
}