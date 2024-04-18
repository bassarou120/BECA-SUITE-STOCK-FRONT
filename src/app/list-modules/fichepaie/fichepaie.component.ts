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
  employes_who_has_fiche: any;

  selectedEmp: any;

  public addEmployeFichePaieForm!: FormGroup;
  public valideFichepaieForm!: FormGroup;

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
      base_categorielle: ['', []],
      prime_anciennete: ['', []],
      autre_primes: ['', []],
      grade_id: ['', []],
      autre_retenues: ['', []],
      rappel_emp: ['', []],
      grade: ['', [Validators.required]],
    });

    this.valideFichepaieForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      action: ['', [Validators.required]],
    });

    this.initAddFiche();
  }

  totalAutrePrime = 0;
  formAutrePrime = this.formBuilder.group({
    itemsAutrePrimes: this.formBuilder.array([]),
  });

  get itemsAutrePrimes() {
    return this.formAutrePrime.get('itemsAutrePrimes') as FormArray;
  }

  addAutrePrime() {
    this.itemsAutrePrimes.push(
      this.formBuilder.group({
        indenmite: [''],
        montant_indenmite: [''],
      })
    );
    this.calucleTotalAutrePrime();

    console.log(this.items.length);
  }

  removeAutrePrime(i: number) {
    // alert(JSON.stringify(i))
    this.itemsAutrePrimes.removeAt(i);
    // this.list_prime.splice(i.id-1 ,1);
    this.calucleTotalAutrePrime();
  }

  totalAutreRetenue = 0;
  formAutreRetenue = this.formBuilder.group({
    itemsAutreRetenues: this.formBuilder.array([]),
  });

  get itemsAutreRetenues() {
    return this.formAutreRetenue.get('itemsAutreRetenues') as FormArray;
  }

  addAutreRetenue() {
    this.itemsAutreRetenues.push(
      this.formBuilder.group({
        retenue: [''],
        montant: [''],
      })
    );
    this.calucleTotalAutreRetenue();

    // console.log(this.items.length);
  }

  removeAutreRetenue(i: number) {
    // alert(JSON.stringify(i))
    this.itemsAutreRetenues.removeAt(i);
    // this.list_prime.splice(i.id-1 ,1);
    this.calucleTotalAutreRetenue();
  }

  calucleTotalAutreRetenue() {
    var traveler: any = this.formAutreRetenue.value.itemsAutreRetenues;

    function montant(item: any) {
      return item.montant;
    }

    function sum(prev: any, next: any) {
      return prev + next;
    }

    this.totalAutreRetenue = traveler.map(montant).reduce(sum);
  }

  calucleTotalAutrePrime() {
    var traveler: any = this.formAutrePrime.value.itemsAutrePrimes;

    function montant_indenmite(item: any) {
      return item.montant_indenmite;
    }

    function sum(prev: any, next: any) {
      return prev + next;
    }

    this.totalAutrePrime = traveler.map(montant_indenmite).reduce(sum);
  }

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

  selectedEmpChange() {
    // alert('je viens de changer');
    this.addEmployeFichePaieForm
      .get('grade')
      ?.setValue(this.selectedEmp.grade.lib);
    this.addEmployeFichePaieForm
      .get('grade_id')
      ?.setValue(this.selectedEmp.grade.id);

    this.addEmployeFichePaieForm
      .get('base_categorielle')
      ?.setValue(this.selectedEmp.contrats[0].base_categorielle);

    this.addEmployeFichePaieForm
      .get('prime_anciennete')
      ?.setValue(this.selectedEmp.contrats[0].prime_anciennete);

    this.addEmployeFichePaieForm
      .get('contrat_id')
      ?.setValue(this.selectedEmp.contrats[0].id);

    this.addEmployeFichePaieForm
      .get('employe_id')
      ?.setValue(this.selectedEmp.id);

    this.addEmployeFichePaieForm
      .get('rappel_emp')
      ?.setValue(this.selectedEmp.nom + ' ' + this.selectedEmp.prenom);
  }

  onClickSubmitaddEmployeFiche() {
    if (this.addEmployeFichePaieForm.valid) {
      this.addEmployeFichePaieForm
        .get('autre_primes')
        ?.setValue(this.itemsAutrePrimes.value);

      this.addEmployeFichePaieForm
        .get('autre_retenues')
        ?.setValue(this.itemsAutreRetenues.value);

      // alert(JSON.stringify(this.addEmployeFichePaieForm.value));

      this.fichepaieService
        .saveFichePaieEmploye(this.addEmployeFichePaieForm.value)
        .subscribe((response: any) => {
          if (response.success == true) {
            // alert(JSON.stringify(response.data));
            location.reload();
          } else {
            alert(response.message);
          }
        });
    } else {
      alert("Désolé la saisie n'est pas  correct veuilez revoir vos entrées");
    }

    console.log(this.addEmployeFichePaieForm.value);
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
    this.valideFichepaieForm.patchValue({
      id: id,
      action: action,
    });
    this.titreAction = action;
  }

  onClickSubmitValideFiche() {
    this.valideFichepaieForm.value;

    // alert(JSON.stringify(this.valideContratForm.value));

    this.contraService
      .validerContatEmploye(
        this.valideFichepaieForm.value.id,
        this.valideFichepaieForm.value
      )
      .subscribe(
        (data: any) => {
          // alert(JSON.stringify(data.data));
          location.reload();
        },
        (error: any) => {}
      );
  }
}
