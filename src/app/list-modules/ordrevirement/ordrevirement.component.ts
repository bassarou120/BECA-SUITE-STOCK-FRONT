import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat/contrat.service';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { FichepaieService } from 'src/app/core/services/fiche-paie/fichepaie.service';
import { TypeContratService } from 'src/app/core/services/typeContrat/typeContrat.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
@Component({
  selector: 'app-ordrevirement',
  templateUrl: './ordrevirement.component.html',
  styleUrls: ['./ordrevirement.component.scss'],
})
export class ordrevirementComponent implements OnInit {
  curentEmploye: any;
  idEmploye: any;

  employes_who_has_no_fiche: any;
  employes_who_has_fiche: any;
  list_banque: any;

  selectedEmp: any;
  selectedFiche: any;

  showloader = false;

  editMode = false;

  ordreVierementData: any = [];
  urlOrdrevirement: any;

  public addEmployeFichePaieForm!: FormGroup;
  public valideFichepaieForm!: FormGroup;
  public ordreVirementForm!: FormGroup;
  listAnnee: any;
  listMois = [
    { id: 1, name: 'Janvier' },
    { id: 2, name: 'Février' },
    { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' },
    { id: 5, name: 'Mai' },
    { id: 6, name: 'Juin' },
    { id: 7, name: 'Jueillet' },
    { id: 8, name: 'Août' },
    { id: 9, name: 'Septemnbre' },
    { id: 10, name: 'Octobre' },
    { id: 11, name: 'Novemvre' },
    { id: 12, name: 'Decembre' },
  ];
  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private employeservice: EmployeService,
    private contraService: ContratService,
    private activatedRoute: ActivatedRoute,
    private typeContratService: TypeContratService,
    private fichepaieService: FichepaieService
  ) {}

  ngOnInit() {
    this.addEmployeFichePaieForm = this.formBuilder.group({
      date_fiche: [this.formatDate(new Date()), [Validators.required]],
      contrat_id: ['', [Validators.required]],
      employe_id: ['', [Validators.required]],
      employe: ['', []],
      employe_edit: ['', []],
      base_categorielle: ['', []],
      prime_anciennete: ['', []],
      autre_primes: ['', []],
      grade_id: ['', []],
      autre_retenues: ['', []],
      rappel_emp: ['', []],
      grade: ['', [Validators.required]],
      edite_fiche_mode: [null, []],
      fiche_id: [null, []],
    });

    this.valideFichepaieForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      action: ['', [Validators.required]],
    });

    this.ordreVirementForm = this.formBuilder.group({
      banque_id: ['', [Validators.required]],
      annee: ['', [Validators.required]],
      mois: ['', [Validators.required]],
    });

    this.initAddFiche();

    let res = [];
    for (let index = 2024; index < 2050; index++) {
      res.push(index);
    }

    this.listAnnee = res;

    this.getListeBanque();
  }
  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
  getListeBanque() {
    this.employeservice.getlisteBanque().subscribe(
      (data: any) => {
        // alert(JSON.stringify(data.data.data));
        this.list_banque = data.data.data;
      },
      (error: any) => {}
    );
  }

  totalAutrePrime = 0;
  formAutrePrime = this.formBuilder.group({
    itemsAutrePrimes: this.formBuilder.array([]),
  });

  totalAutreRetenue = 0;
  formAutreRetenue = this.formBuilder.group({
    itemsAutreRetenues: this.formBuilder.array([]),
  });

  form = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });

  get items() {
    return this.form.get('items') as FormArray;
  }
  initAddFiche() {
    this.fichepaieService.initgetEmployeForFichepaie().subscribe(
      (response: any) => {
        console.log(response.data);

        this.employes_who_has_no_fiche =
          response.data.employes_who_has_no_fiche;

        this.employes_who_has_fiche = response.data.employes_who_has_fiche;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  compareEmployeObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  telechargerOrdreVirement() {
    alert(this.urlOrdrevirement);
    window.open(this.urlOrdrevirement, '_blank');
  }

  onClickSubmitordreVirement() {
    // alert(JSON.stringify(this.ordreVirementForm.value));

    this.showloader = true;
    if (this.ordreVirementForm.valid) {
      this.fichepaieService
        .getOrdreVirement(this.ordreVirementForm.value)
        .subscribe(
          (res: any) => {
            // alert(JSON.stringify(res.data));
            if (res.success == true) {
              console.log(res.data.data);
              this.ordreVierementData = res.data.data.ordre;
              this.urlOrdrevirement = res.data.url;
              this.showloader = false;

              // window.open(res.data, '_blank');
              // window.open(this.urlOrdrevirement, '_blank');
            } else {
              this.showloader = false;
              alert(res.message);
            }
          },
          (error: any) => {}
        );
    } else {
      this.showloader = false;
      alert('Veuillez bien remplire le formulaire');
    }
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

  calculateTotalAutrePrime(listPrime: any) {
    let mAllprime = 0;
    listPrime.map((p: any) => {
      mAllprime = mAllprime + p.montant;
    });

    return mAllprime;
  }

  calculateTotalRetenue(listRe: any) {
    let mAllprime = 0;
    listRe.map((p: any) => {
      mAllprime = mAllprime + p.montant;
    });

    return mAllprime;
  }

  titreAction: any;
  getValideFicheForm(id: any, action: any) {
    // $('#valide_fiche').modal('show');

    this.valideFichepaieForm.patchValue({
      id: id,
      action: action,
    });
    this.titreAction = action;
  }
}
