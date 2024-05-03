import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { getInfoDeBase, getMiniTemplateEmploye, routes, InfosDeBaseService } from 'src/app/core/core.index';



// Les parametres à ajouter sont:
//  "LIMITE_JOURS_CONGE", "LIMITE_HEURES_SUPP", "PREFIXE_MATRICULE", "PREFIXE_CONTRAT",
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
  public lstInfosDeBase: any = {};
  public lstInfosDeBaseLIMITE: Array<getInfoDeBase> = [];
  public lstInfosDeBasePREFIXE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseNOM_SIGNATAIRE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseBANQUE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseNUMERO_DE_COMPTE: Array<getInfoDeBase> = [];

  public lstReadonly: { [key: string]: boolean } = {};
  public searchDataValue = '';
  public setInfoDeBaseForm!: FormGroup;

  constructor(private data: InfosDeBaseService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.setInfoDeBaseForm = this.formBuilder.group({
      items: this.formBuilder.array([
        this.createItem("LIMITE_JOURS_CONGE"),
      ])
    });
  }

  createItem(cle: string): FormGroup {
    const info = this.lstInfosDeBase[cle];
    console.log(this.lstInfosDeBase, "\n", info, "\n", this.lstInfosDeBase[cle])
    return this.formBuilder.group({
      cle: [info!.cle, Validators.required],
      valeur: [(info!.valeur && (info!.valeur!=0)) ? info!.valeur : 0, Validators.required],
      valeur_txt: [(info!.valeur_txt && (info!.valeur_txt!=" ")) ? info!.valeur_txt : " ", Validators.required]
    });
  }

  private getTableData(): void {
    this.lstInfosDeBase = [];

    this.data.getAllInfoDeBases().subscribe((res: any) => {
      res.data.data.map((res: getInfoDeBase, index: number) => {
        this.lstInfosDeBase[res.cle] = (res);
        this.lstReadonly[res.cle] = true;
      });
    });

    this.data.getAllEmployes().subscribe((res: any) => {
      res.data.map((res: getMiniTemplateEmploye, index: number) => {
        this.lstEmploye.push(res.nom + " " + res.prenom);
      });
    });
  }

  switchReadOnlyValue(val: string) {
    this.lstReadonly[val] = !this.lstReadonly[val];
  }

  setInfoDeBase() {
    console.log(this.setInfoDeBaseForm.value)

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
