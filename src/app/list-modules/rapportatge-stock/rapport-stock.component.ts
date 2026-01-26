import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat/contrat.service';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { FichepaieService } from 'src/app/core/services/fiche-paie/fichepaie.service';
import { bureauService } from "../../core/services/bureau/bureau.service";
import { immoService } from "../../core/services/immo/immo.service";
import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service"; 
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-rapport-stock',
  templateUrl: './rapport-stock.component.html',
  styleUrls: ['./rapport-stock.component.scss'],
})
export class rapportStockComponent implements OnInit {
  public showloader = false;
  public rapportStockForm!: FormGroup;
  
  // NOUVELLES VARIABLES POUR LE TABLEAU ET LES ERREURS
  public lstMouvements: any[] = []; // Pour stocker la liste affichée dans le tableau
  
  // Listes pour les sélecteurs
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
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    this.rapportStockForm = this.formBuilder.group({
      type_rapport: ['', [Validators.required]],
      date_debut: ['', [Validators.required]],
      date_fin: ['', [Validators.required]],
    });
  }

  /**
   * ACTION 1 : AFFICHER LA LISTE DANS LE TABLEAU
   * Cette méthode récupère les données JSON pour l'aperçu
   */
  onClickSubmitRapportStock() {
    if (this.rapportStockForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.showloader = true;
    this.lstMouvements = []; // On vide la liste précédente

    const params = this.rapportStockForm.value;

    // Appel au service pour récupérer les données (JSON)
    this.stockService.getRapportEntreesData(params).subscribe({
      next: (res: any) => {
        this.showloader = false;
        // On stocke les données reçues dans lstMouvements pour le HTML
        this.lstMouvements = res.data || res; 
        if (this.lstMouvements.length === 0) {
           alert("Aucune donnée trouvée pour cette période");
        }
      },
      error: (err: any) => {
        this.showloader = false;
        console.error(err);
        alert("Erreur lors de la récupération des données.");
      }
    });
  }

  /**
   * ACTION 2 : TELECHARGER LE PDF
   * Cette méthode est appelée après l'affichage du tableau
   */
  telechargerPdf() {
    this.showloader = true;
    $('#spinnerr').removeClass('d-none');

    const params = this.rapportStockForm.value;

    this.stockService.exportPdfEntrees(params).subscribe({
        next: (res: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;

            // Tentative d'extraction de l'URL selon différentes structures possibles (res.url, res.data.url, etc.)
            const url = res.success ? (res.data?.url || res.url) : (res.url || res.data?.url || res.data);
            
            if (url) {
                window.open(url, '_blank');
            } else {
                console.error("Structure de réponse inattendue :", res);
                alert("Impossible de trouver l'URL du PDF dans la réponse du serveur.");
            }
        },
        error: (err: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;
            console.error("Erreur lors du téléchargement", err);
            alert("Erreur serveur lors de la génération du PDF.");
        }
    });
}

  // --- Helpers ---

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

  formatDate(date: any) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}