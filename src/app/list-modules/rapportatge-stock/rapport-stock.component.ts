import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { bureauService } from "../../core/services/bureau/bureau.service";
import { immoService } from "../../core/services/immo/immo.service";
import { entreeSortieStockService } from "../../core/services/entree-sortie-stock/entree-sortie-stock.service"; 
import { Observable } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-rapport-stock',
  templateUrl: './rapport-stock.component.html',
  styleUrls: ['./rapport-stock.component.scss'],
})
export class rapportStockComponent implements OnInit {
  public showloader = false;
  public rapportStockForm!: FormGroup;
  
  public lstMouvements: any[] = []; 
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

    this.rapportStockForm.get('type_rapport')?.valueChanges.subscribe(value => {
      this.lstMouvements = [];
      this.stats = null;

      const dateDebut = this.rapportStockForm.get('date_debut');
      const dateFin = this.rapportStockForm.get('date_fin');

      // Seuls les rapports d'entrées et sorties requièrent des dates
      if (value === 'rapport_entree' || value === 'rapport_sortie') {
        dateDebut?.setValidators([Validators.required]);
        dateFin?.setValidators([Validators.required]);
      } else {
        dateDebut?.clearValidators();
        dateFin?.clearValidators();
        dateDebut?.setValue('');
        dateFin?.setValue('');
      }
      dateDebut?.updateValueAndValidity();
      dateFin?.updateValueAndValidity();
    });
  }

  onClickSubmitRapportStock() {
    if (this.rapportStockForm.invalid) {
      alert('Veuillez remplir les champs requis (Type et Dates si nécessaire)');
      return;
    }

    this.showloader = true;
    this.lstMouvements = []; 

    const params = this.rapportStockForm.value;

    // --- NOUVEAU : ETAT CONSOLIDE (AVEC FAMILLE) ---
    if (params.type_rapport === 'rapport_consolide') {
      this.stockService.getRapportEtatConsolideData().subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstMouvements = res.data || [];
          this.stats = res.statistiques;
          if (this.lstMouvements.length === 0) alert("Aucune donnée consolidée trouvée");
        },
        error: (err) => this.handleError(err)
      });
    } 
    // --- ETAT DE STOCK SIMPLE ---
    else if (params.type_rapport === 'rapport_etat') {
      this.stockService.getRapportEtatStockData().subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstMouvements = res.data || [];
          this.stats = res.statistiques;
          if (this.lstMouvements.length === 0) alert("Aucun article en stock trouvé");
        },
        error: (err) => this.handleError(err)
      });
    } 
    // --- RAPPORT DES SORTIES ---
    else if (params.type_rapport === 'rapport_sortie') {
      this.stockService.getRapportSortiesData(params).subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstMouvements = res.data || []; 
          this.stats = res.statistiques;
          if (this.lstMouvements.length === 0) alert("Aucune sortie trouvée pour cette période");
        },
        error: (err) => this.handleError(err)
      });
    }
    // --- RAPPORT DES ENTREES ---
    else {
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

  // telechargerPdf() {
  //   if (this.rapportStockForm.invalid) return;
  //   if (this.lstMouvements.length === 0) {
  //     alert("Veuillez d'abord afficher les données avant de télécharger le PDF");
  //     return;
  //   }

  //   this.showloader = true;
  //   $('#spinnerr').removeClass('d-none');

  //   const params = this.rapportStockForm.value;
    
  //   let exportObservable;
    
  //   // Sélection de l'observable selon le type de rapport
  //   if (params.type_rapport === 'rapport_consolide') {
  //       exportObservable = this.stockService.exportPdfEtatConsolide();
  //   } else if (params.type_rapport === 'rapport_etat') {
  //       exportObservable = this.stockService.exportPdfEtatStock();
  //   } else if (params.type_rapport === 'rapport_sortie') {
  //       exportObservable = this.stockService.exportPdfSorties(params);
  //   } else {
  //       exportObservable = this.stockService.exportPdfEntrees(params);
  //   }

  //   exportObservable.subscribe({
  //       next: (res: any) => {
  //           $('#spinnerr').addClass('d-none');
  //           this.showloader = false;

  //           const url = res.success ? (res.url || res.data?.url) : null;
            
  //           if (url) {
  //               const link = document.createElement('a');
  //               link.href = url;
  //               link.target = '_blank';
  //               link.download = url.split('/').pop();
  //               document.body.appendChild(link);
  //               link.click();
  //               document.body.removeChild(link);
  //           } else {
  //               alert("Erreur: URL du PDF introuvable.");
  //           }
  //       },
  //       error: (err: any) => {
  //           $('#spinnerr').addClass('d-none');
  //           this.showloader = false;
  //           alert("Erreur lors de la génération du PDF.");
  //       }
  //   });
  // }

  telechargerPdf() {
    if (this.rapportStockForm.invalid) return;
    if (this.lstMouvements.length === 0) {
      alert("Veuillez d'abord afficher les données avant de télécharger le PDF");
      return;
    }

    this.showloader = true;
    $('#spinnerr').removeClass('d-none');

    const params = this.rapportStockForm.value;
    let exportObservable: Observable<any>;
    
    // Sélection de l'observable
    if (params.type_rapport === 'rapport_consolide') {
        // Pour celui-ci, on force le type blob dans l'appel
        exportObservable = this.stockService.exportPdfEtatConsolide(); 
    } else if (params.type_rapport === 'rapport_etat') {
        exportObservable = this.stockService.exportPdfEtatStock();
    } else if (params.type_rapport === 'rapport_sortie') {
        exportObservable = this.stockService.exportPdfSorties(params);
    } else {
        exportObservable = this.stockService.exportPdfEntrees(params);
    }

    exportObservable.subscribe({
        next: (res: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;

            // CAS 1 : C'est un BLOB (Nouveau rapport consolidé)
            if (res instanceof Blob) {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Rapport_Consolide_${new Date().getTime()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } 
            // CAS 2 : C'est du JSON avec une URL (Tes anciens rapports)
            else {
                const url = res.success ? (res.url || res.data?.url) : null;
                if (url) {
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
            }
        },
        error: (err: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;
            console.error(err);
            alert("Erreur lors de la génération du PDF.");
        }
    });
}

  private handleError(err: any) {
    this.showloader = false;
    console.error(err);
    alert("Erreur de récupération : " + (err.error?.message || "Serveur injoignable"));
  }

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