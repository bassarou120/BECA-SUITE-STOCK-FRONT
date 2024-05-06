import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { getInfoDeBase, getMiniTemplateEmploye, routes, InfosDeBaseService } from 'src/app/core/core.index';



// Les parametres à ajouter sont:
//  "LIMITE_JOURS_CONGE", "LIMITE_HEURES_SUPP",
//  "PREFIXE_MATRICULE", "PREFIXE_CONTRAT",
//  "NOM_ENTREPRISE", "NOM_SIGNATAIRE_1", "NOM_SIGNATAIRE_2",
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

  public lstReadonly: { [key: string]: boolean } = {};
  public selectedSignataire1 = '';
  public selectedSignataire2 = '';

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
    });
  }

  private getTableData(): void {
    this.lstInfosDeBase = [];

    this.data.getAllInfoDeBases().subscribe((res: any) => {
      res.data.data.map((res: getInfoDeBase, index: number) => {
        res.cle_txt = res.cle + "_TXT";
        this.lstInfosDeBase.push(res);
        this.lstReadonly[res.cle] = true;
        this.updateInfo(res);
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
    this.lstReadonly[val] = !this.lstReadonly[val];
  }

  setInfoDeBase() {
    console.log(this.setInfoDeBaseForm.value, this.setInfoDeBaseForm.valid)

    // if (this.setInfoDeBaseForm.valid){
    //   this.data.saveInfoDeBase(this.setInfoDeBaseForm.value).subscribe(response => {
    //     console.log(response);
    //     location.reload();
    //   });
    // } else {
    //   console.log("Desolé le formulaire n'est pas bien renseigné");
    // }
  }
}

export interface pageSelection {
  skip: number;
  limit: number;
}
