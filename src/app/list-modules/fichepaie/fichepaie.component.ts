import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat/contrat.service';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { FichepaieService } from 'src/app/core/services/fiche-paie/fichepaie.service';
import { TypeContratService } from 'src/app/core/services/typeContrat/typeContrat.service';

@Component({
  selector: 'app-fichepaie',
  templateUrl: './fichepaie.component.html',
  styleUrls: ['./fichepaie.component.scss'],
})
export class fichepaieComponent implements OnInit {
  curentEmploye: any;
  idEmploye: any;

  employes_who_has_no_fiche: any;

  selectedEmp: any;

  public addEmployeFichePaieForm!: FormGroup;

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private employeservice: EmployeService,
    private contraService: ContratService,
    private activatedRoute: ActivatedRoute,
    private typeContratService: TypeContratService,
    private fichepaieService: FichepaieService
  ) {}
  form = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });

  ngOnInit() {
    this.addEmployeFichePaieForm = this.formBuilder.group({
      date_fiche: [this.formatDate(new Date()), [Validators.required]],
      contrat_id: ['', [Validators.required]],
      employe_id: ['', [Validators.required]],
      employe: ['', []],
      base_categorielle: ['', []],
      prime_anciennete: ['', []],
      grade: ['', [Validators.required]],
    });
  }

  get items() {
    return this.form.get('items') as FormArray;
  }
  initAddFiche() {
    this.fichepaieService.initgetEmployeForFichepaie().subscribe(
      (response: any) => {
        console.log(response.data.employes_who_has_no_fiche);

        this.employes_who_has_no_fiche =
          response.data.employes_who_has_no_fiche;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  selectedEmpChange() {
    // alert('je viens de changer');
    this.addEmployeFichePaieForm
      .get('grade')
      ?.setValue(this.selectedEmp.grade.lib);

    this.addEmployeFichePaieForm
      .get('base_categorielle')
      ?.setValue(this.selectedEmp.contrats[0].base_categorielle);

    this.addEmployeFichePaieForm
      .get('prime_anciennete')
      ?.setValue(this.selectedEmp.contrats[0].prime_anciennete);
  }

  onClickSubmitaddEmployeFiche() {
    alert(JSON.stringify(this.addEmployeFichePaieForm.value));
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  strToNumber(v: any) {
    return Number(v);
  }
}
