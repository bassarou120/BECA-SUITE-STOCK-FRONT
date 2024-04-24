import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { getInfoDeBase, routes, InfosDeBaseService } from 'src/app/core/core.index';



// Les parametres à ajouter sont: "LIMITE_JOURS_CONGE", "LIMITE_HEURES_SUPP".


@Component({
  selector: 'app-infos-de-base',
  templateUrl: './infos-de-base.component.html',
  styleUrls: ['./infos-de-base.component.scss']
})
export class InfosDeBaseComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstInfosDeBase: Array<getInfoDeBase> = [];
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

      this.initValidator(this.lstInfosDeBase);
    });
  }

  private initValidator(lst: Array<getInfoDeBase>) {
    lst.forEach(item => {
      const group = this.formBuilder.group({
        cle: [item.cle, [Validators.required]],
        valeur: [item.valeur, [Validators.required]],
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
