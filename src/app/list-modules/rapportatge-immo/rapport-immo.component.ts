import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat/contrat.service';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { FichepaieService } from 'src/app/core/services/fiche-paie/fichepaie.service';
import { TypeContratService } from 'src/app/core/services/typeContrat/typeContrat.service';
import {bureauService} from "../../core/services/bureau/bureau.service";
import {immoService} from "../../core/services/immo/immo.service";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ordrevirement',
  templateUrl: './rapport-immo.component.html',
  styleUrls: ['./rapport-immo.component.scss'],
})
export class rapportImmoComponent implements OnInit {

 public showloader = false;
  public rapportImmoForm!: FormGroup;

  public lstDonnees: any[] = [];
  public stats: any = null;

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private immoService: immoService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.rapportImmoForm = this.formBuilder.group({
      type_rapport: ['', [Validators.required]],
      date_debut: [''],
      date_fin: [''],
    });

    this.rapportImmoForm.get('type_rapport')?.valueChanges.subscribe(value => {
      this.lstDonnees = [];
      this.stats = null;

      const dateDebut = this.rapportImmoForm.get('date_debut');
      const dateFin = this.rapportImmoForm.get('date_fin');

      // Rapports nécessitant des dates
      if (value === 'rapport_transfert' || value === 'rapport_intervention' || value === 'rapport_mise_dispo') {
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

  onClickSubmitRapportImmo() {
    if (this.rapportImmoForm.invalid) {
      alert('Veuillez remplir les champs requis (Type et Dates si nécessaire)');
      return;
    }

    this.showloader = true;
    this.lstDonnees = [];

    const params = this.rapportImmoForm.value;

    // --- 1. RAPPORT GÉNÉRAL DES IMMOBILISATIONS ---
    if (params.type_rapport === 'rapport_general') {
      this.immoService.getRapportImmo().subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstDonnees = res.data || [];
          this.stats = res.statistiques;
          if (this.lstDonnees.length === 0) alert("Aucune immobilisation trouvée");
        },
        error: (err) => this.handleError(err)
      });
    }
    // --- 2. RAPPORT DES TRANSFERTS ---
    else if (params.type_rapport === 'rapport_transfert') {
      this.immoService.getRapportTransfert(params).subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstDonnees = res.data || [];
          this.stats = res.statistiques;
          if (this.lstDonnees.length === 0) alert("Aucun transfert trouvé pour cette période");
        },
        error: (err) => this.handleError(err)
      });
    }
    // --- 3. RAPPORT DES INTERVENTIONS ---
    else if (params.type_rapport === 'rapport_intervention') {
      this.immoService.getRapportIntervention(params).subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstDonnees = res.data || [];
          this.stats = res.statistiques;
          if (this.lstDonnees.length === 0) alert("Aucune intervention trouvée pour cette période");
        },
        error: (err) => this.handleError(err)
      });
    }
    // --- 4. FICHE D'INVENTAIRE ---
    else if (params.type_rapport === 'rapport_inventaire') {
      this.immoService.getRapportInventaire().subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstDonnees = res.data || [];
          this.stats = res.statistiques;
          if (this.lstDonnees.length === 0) alert("Aucune immobilisation en inventaire");
        },
        error: (err) => this.handleError(err)
      });
    }
    // --- 5. MISE À DISPOSITION ---
    else if (params.type_rapport === 'rapport_mise_dispo') {
      this.immoService.getRapportMiseADispo(params).subscribe({
        next: (res: any) => {
          this.showloader = false;
          this.lstDonnees = res.data || [];
          this.stats = res.statistiques;
          if (this.lstDonnees.length === 0) alert("Aucune mise à disposition trouvée");
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  telechargerPdf() {
    if (this.rapportImmoForm.invalid) return;
    if (this.rapportImmoForm.get('type_rapport')?.value !== 'rapport_qrcode' && this.lstDonnees.length === 0) {
      alert("Veuillez d'abord afficher les données avant de télécharger le PDF");
      return;
    }

    this.showloader = true;
    $('#spinnerr').removeClass('d-none');

    const params = this.rapportImmoForm.value;
    let exportObservable: Observable<Blob>;

    // Sélection de l'observable selon le type de rapport
    if (params.type_rapport === 'rapport_general') {
        exportObservable = this.immoService.exportPdfRapportImmo();
    } else if (params.type_rapport === 'rapport_transfert') {
        exportObservable = this.immoService.exportPdfRapportTransfert(params);
    } else if (params.type_rapport === 'rapport_intervention') {
        exportObservable = this.immoService.exportPdfRapportIntervention(params);
    } else if (params.type_rapport === 'rapport_inventaire') {
        exportObservable = this.immoService.exportPdfInventaire();
    } else if (params.type_rapport === 'rapport_mise_dispo') {
        exportObservable = this.immoService.exportPdfRapportMiseADispo(params);
    } else {
        // QR Code
        exportObservable = this.immoService.exportPdfQrCodeImmo();
    }

    exportObservable.subscribe({
        next: (blob: Blob) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Nom de fichier dynamique selon le type
            let fileName = 'Rapport_Immobilisations';
            switch(params.type_rapport) {
              case 'rapport_general': fileName = 'Rapport_Immobilisations'; break;
              case 'rapport_transfert': fileName = 'Rapport_Transferts_Immo'; break;
              case 'rapport_intervention': fileName = 'Rapport_Interventions'; break;
              case 'rapport_inventaire': fileName = 'Fiche_Inventaire'; break;
              case 'rapport_mise_dispo': fileName = 'Fiche_Mise_A_Disposition'; break;
              case 'rapport_qrcode': fileName = 'QR_Code_Immobilisations'; break;
            }

            link.download = `${fileName}_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
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
}
