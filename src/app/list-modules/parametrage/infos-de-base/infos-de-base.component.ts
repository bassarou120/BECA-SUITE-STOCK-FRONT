import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {environment} from "../../../../environments/environment";

import { getInfoDeBase, getMiniTemplateEmploye, routes, InfosDeBaseService } from 'src/app/core/core.index';



//  Les parametres à ajouter sont:
//  "NOM_ENTREPRISE"
//  "LIMITE_JOURS_CONGE", "LIMITE_HEURES_SUPP",
//  "PREFIXE_MATRICULE", "PREFIXE_CONTRAT",
//  "NOM_SIGNATAIRE_1", "NOM_SIGNATAIRE_2",
//  "BANQUE_1" à "BANQUE_5", "NUMERO_DE_COMPTE_1" à "NUMERO_DE_COMPTE_5".



@Component({
  selector: 'app-infos-de-base',
  templateUrl: './infos-de-base.component.html',
  styleUrls: ['./infos-de-base.component.scss']
})
export class InfosDeBaseComponent implements OnInit {
  title = 'pagination';
  public routes = routes;

  public lstEmploye: Array<string> = [];
  public lstInfosDeBase: Array<getInfoDeBase> = [];

  // public lstReadonly: { [key: string]: boolean } = {};
  public selectedSignataire1 = '';
  public selectedSignataire2 = '';
  public selectedSignature1 = environment.base_url_backend;
  public selectedSignature2 = environment.base_url_backend;
  public logoentreprise = environment.base_url_backend;

  public searchDataValue = '';
  public setInfoDeBaseForm!: FormGroup;

  constructor(private data: InfosDeBaseService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.setInfoDeBaseForm = this.formBuilder.group({
      // Le nom de l'entreprise
      NOM_ENTREPRISE: ["", [Validators.required]],
      NOM_ENTREPRISE_TXT: ["", [Validators.required]],
      // Les valeurs maximales
      LIMITE_JOURS_CONGE: ["", [Validators.required]],
      LIMITE_JOURS_CONGE_TXT: ["", [Validators.required]],
      LIMITE_HEURES_SUPP: ["", [Validators.required]],
      LIMITE_HEURES_SUPP_TXT: ["", [Validators.required]],
      // Les préfixes
      PREFIXE_CONTRAT: ["", [Validators.required]],
      PREFIXE_CONTRAT_TXT: ["", [Validators.required]],
      PREFIXE_MATRICULE: ["", [Validators.required]],
      PREFIXE_MATRICULE_TXT: ["", [Validators.required]],
      // Les signataires
      NOM_SIGNATAIRE_1: ["", [Validators.required]],
      NOM_SIGNATAIRE_1_TXT: ["", [Validators.required]],
      NOM_SIGNATAIRE_2: ["", [Validators.required]],
      NOM_SIGNATAIRE_2_TXT: ["", [Validators.required]],
      // Les signatures
      SIGNATURE_1: [0, [Validators.required]],
      SIGNATURE_1_TXT: [" ", [Validators.required]],
      SIGNATURE_2: [0, [Validators.required]],
      SIGNATURE_2_TXT: [" ", [Validators.required]],
      // Les banques et numéros de compte
      BANQUE_1: ["", [Validators.required]],
      BANQUE_1_TXT: ["", [Validators.required]],
      NUMERO_DE_COMPTE_1: ["", [Validators.required]],
      NUMERO_DE_COMPTE_1_TXT: ["", [Validators.required]],
      BANQUE_2: ["", [Validators.required]],
      BANQUE_2_TXT: ["", [Validators.required]],
      NUMERO_DE_COMPTE_2: ["", [Validators.required]],
      NUMERO_DE_COMPTE_2_TXT: ["", [Validators.required]],
      BANQUE_3: ["", [Validators.required]],
      BANQUE_3_TXT: ["", [Validators.required]],
      NUMERO_DE_COMPTE_3: ["", [Validators.required]],
      NUMERO_DE_COMPTE_3_TXT: ["", [Validators.required]],
      BANQUE_4: ["", [Validators.required]],
      BANQUE_4_TXT: ["", [Validators.required]],
      NUMERO_DE_COMPTE_4: ["", [Validators.required]],
      NUMERO_DE_COMPTE_4_TXT: ["", [Validators.required]],
      BANQUE_5: ["", [Validators.required]],
      BANQUE_5_TXT: ["", [Validators.required]],
      NUMERO_DE_COMPTE_5: ["", [Validators.required]],
      NUMERO_DE_COMPTE_5_TXT: ["", [Validators.required]],
      // NOM_DESIGNATION_ENTREPRISE,
      NOM_DESIGNATION_ENTREPRISE: ["", [Validators.required]],
      NOM_DESIGNATION_ENTREPRISE_TXT: ["", [Validators.required]],
      // NUMERO_AFFILIATION_CNSS,
      NUMERO_AFFILIATION_CNSS: ["", [Validators.required]],
      NUMERO_AFFILIATION_CNSS_TXT: ["", [Validators.required]],
      // VILLE,
      VILLE: ["", [Validators.required]],
      VILLE_TXT: ["", [Validators.required]],
      // PAYS,
      PAYS: ["", [Validators.required]],
      PAYS_TXT: ["", [Validators.required]],
      // ZONE,
      ZONE: ["", [Validators.required]],
      ZONE_TXT: ["", [Validators.required]],
      // QUATIER,
      QUATIER: ["", [Validators.required]],
      QUATIER_TXT: ["", [Validators.required]],
      // TELEPHONE,
      TELEPHONE: ["", [Validators.required]],
      TELEPHONE_TXT: ["", [Validators.required]],
      // BOITE_POSTAL, 
      BOITE_POSTAL: ["", [Validators.required]],
      BOITE_POSTAL_TXT: ["", [Validators.required]],
      // COURRIEL
      COURRIEL: ["", [Validators.required]],
      COURRIEL_TXT: ["", [Validators.required]],
      //  Nom du DG
      NOM_DG: ["", [Validators.required]],
      NOM_DG_TXT: ["", [Validators.required]],
      // -Logo de l’entreprise
      LOGO_ENTREPRISE: [0, [Validators.required]],
      LOGO_ENTREPRISE_TXT: ["", [Validators.required]],
      // -IFU de l’entreprise
      IFU_ENTREPRISE: ["", [Validators.required]],
      IFU_ENTREPRISE_TXT: ["", [Validators.required]],

    });
  }

  private getTableData(): void {
    this.lstInfosDeBase = [];

    this.data.getAllInfoDeBases().subscribe((res: any) => {
      res.data.data.map((res: getInfoDeBase, index: number) => {
        res.cle_txt = res.cle + "_TXT";
        this.lstInfosDeBase.push(res);
        //this.lstReadonly[res.cle] = true;
        if((res.cle!="SIGNATURE_1") && (res.cle!="SIGNATURE_2") && (res.cle!="LOGO_ENTREPRISE")) {
          this.updateInfo(res);
        } else if(res.cle == "SIGNATURE_1") {
          this.selectedSignature1 += res.valeur_txt;
        } else if(res.cle == "SIGNATURE_2"){
          this.selectedSignature2 += res.valeur_txt;
        }else{
          this.logoentreprise += res.valeur_txt;
        }
      });
    });

    this.data.getAllEmployes().subscribe((res: any) => {
      res.data.map((res: getMiniTemplateEmploye, index: number) => {
        this.lstEmploye.push(res.nom + " " + res.prenom);
      });
    });

  }

  private updateInfo(info: getInfoDeBase) {
    this.setInfoDeBaseForm.patchValue({
      [info.cle]: (info.valeur && (info.valeur!=0)) ? info.valeur : 0,
      [info.cle_txt]: (info.valeur_txt && (info.valeur_txt!=" ")) ? info.valeur_txt : " ",
    });
    if(info.cle == "NOM_SIGNATAIRE_1") { this.selectedSignataire1 = info.valeur_txt; }
    if(info.cle == "NOM_SIGNATAIRE_2") { this.selectedSignataire2 = info.valeur_txt; }
  }

  switchReadOnlyValue(val: string) {
    //this.lstReadonly[val] = !this.lstReadonly[val];
  }

  onFileChange(event: Event, fieldName: string) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.setInfoDeBaseForm.get(fieldName)!.setValue(file);
    }
  }

  setInfoDeBase() {
    console.log(this.setInfoDeBaseForm.value, this.setInfoDeBaseForm.valid)

    if (this.setInfoDeBaseForm.valid){
      const formData = new FormData();
      Object.keys(this.setInfoDeBaseForm.value).forEach(key => {
        formData.append(key, this.setInfoDeBaseForm.get(key)!.value);
      });
      this.data.saveInfoDeBase(formData).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire est mal  renseigné");
    }
  }

}

export interface pageSelection {
  skip: number;
  limit: number;
}
