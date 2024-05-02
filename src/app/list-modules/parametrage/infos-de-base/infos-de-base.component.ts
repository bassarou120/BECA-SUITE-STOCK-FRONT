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
  public lstInfosDeBase: Array<getInfoDeBase> = [];
  public lstInfosDeBaseLIMITE: Array<getInfoDeBase> = [];
  public lstInfosDeBasePREFIXE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseNOM_SIGNATAIRE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseBANQUE: Array<getInfoDeBase> = [];
  public lstInfosDeBaseNUMERO_DE_COMPTE: Array<getInfoDeBase> = [];

  public lstReadonly: { [key: string]: boolean } = {};
  public searchDataValue = '';
  public setInfoDeBaseForm!: FormGroup;
  public setInfoDeBaseFormArray: FormGroup[] = [];

  constructor(private data: InfosDeBaseService, private formBuilder: FormBuilder) {
    this.setInfoDeBaseForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.getTableData();
  }

  private getTableData(): void {
    this.lstInfosDeBase = [];

    this.data.getAllInfoDeBases().subscribe((res: any) => {
      res.data.data.map((res: getInfoDeBase, index: number) => {
        this.lstInfosDeBase.push(res);
        this.lstReadonly[res.cle] = true;
      });

      this.lstInfosDeBaseLIMITE = this.lstInfosDeBase.filter(info => info.cle.startsWith('LIMITE'));
      this.lstInfosDeBasePREFIXE = this.lstInfosDeBase.filter(info => info.cle.startsWith('PREFIXE'));
      this.lstInfosDeBaseNOM_SIGNATAIRE = this.lstInfosDeBase.filter(info => info.cle.startsWith('NOM_SIGNATAIRE'));
      this.lstInfosDeBaseBANQUE = this.lstInfosDeBase.filter(info => info.cle.startsWith('BANQUE'));
      this.lstInfosDeBaseNUMERO_DE_COMPTE = this.lstInfosDeBase.filter(info => info.cle.startsWith('NUMERO_DE_COMPTE'));

      this.initValidator([...this.lstInfosDeBaseLIMITE, ...this.lstInfosDeBasePREFIXE, ...this.lstInfosDeBaseNOM_SIGNATAIRE, ...this.lstInfosDeBaseBANQUE, ...this.lstInfosDeBaseNUMERO_DE_COMPTE]);
    });

    this.data.getAllEmployes().subscribe((res: any) => {
      res.data.map((res: getMiniTemplateEmploye, index: number) => {
        this.lstEmploye.push(res.nom + " " + res.prenom);
      });
    });
  }

  private initValidator(lst: Array<getInfoDeBase>) {
    lst.forEach(item => {
      const group = this.formBuilder.group({
        cle: [item.cle, [Validators.required]],
        valeur: [(item.valeur && (item.valeur != 0)) ? item.valeur : 0, [Validators.required]],
        valeur_txt: [(item.valeur_txt && (item.valeur_txt != " ")) ? item.valeur_txt : " ", [Validators.required]],
      });
      this.setInfoDeBaseFormArray.push(group);
    });

    this.setInfoDeBaseForm = this.formBuilder.group({
      items: this.formBuilder.array(this.setInfoDeBaseFormArray)
    });
  }

  get itemsFormArray() {
    return this.setInfoDeBaseForm.get('items') as FormArray;
  }

  switchReadOnlyValue(val: string) {
    this.lstReadonly[val] = !this.lstReadonly[val];
  }

  setInfoDeBase() {

    if (this.setInfoDeBaseForm.valid){
      this.data.saveInfoDeBase(this.setInfoDeBaseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }
}

export interface pageSelection {
  skip: number;
  limit: number;
}
