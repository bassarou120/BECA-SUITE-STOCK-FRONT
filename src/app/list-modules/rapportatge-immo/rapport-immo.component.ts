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
@Component({
  selector: 'app-ordrevirement',
  templateUrl: './rapport-immo.component.html',
  styleUrls: ['./rapport-immo.component.scss'],
})
export class rapportImmoComponent implements OnInit {
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
  public rapportImmoForm!: FormGroup;
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

  lstEmployer:any;
  lstBureau:any;

  selectedType:any;
  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private employeservice: EmployeService,
    private contraService: ContratService,
    private activatedRoute: ActivatedRoute,
    private typeContratService: TypeContratService,
    private fichepaieService: FichepaieService,
    private immoService: immoService,
    private employeService:EmployeService,
    private  bureauService:bureauService,
  ) {}

  ngOnInit() {

    this.getBureau();
    this.getEmploye();

    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate);
    oneYearFromNow.setFullYear(currentDate.getFullYear() - 1);

console.log(currentDate.toISOString().split('T')[0],oneYearFromNow.toISOString().split('T')[0])

    this.rapportImmoForm = this.formBuilder.group({
      type_rapport: ['', [Validators.required]],
      bureau_id: ['', [ ]],
      employe_id: ['', [ ]],
      date_fin: [currentDate.toISOString().split('T')[0], []],
      date_debut: [oneYearFromNow.toISOString().split('T')[0], []],
    });

    // this.init();

    let res = [];
    for (let index = 2024; index < 2050; index++) {
      res.push(index);
    }

    this.listAnnee = res;

    this.getListeBanque();
  }


  init(){
    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate);
    oneYearFromNow.setFullYear(currentDate.getFullYear() - 1);

    this.rapportImmoForm.get('date_debut')?.setValue(oneYearFromNow.toISOString().split('T')[0])
    this.rapportImmoForm.get('date_fin')?.setValue(currentDate.toISOString().split('T')[0])
  }


  getEmploye(){

    this.employeService.getAllEmploye().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data ))
        this.lstEmployer=res.data

      },
      (error:any)=>{

      });
  }

  getBureau(){

    this.bureauService.getAll().subscribe(
      (res: any) => {
        // alert(JSON.stringify(res.data ))
        this.lstBureau=res.data.data

      },
      (error:any)=>{

      });
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

  onClickSubmitRapportImmo() {
    // alert(JSON.stringify(this.rapportImmoForm.value));

    this.showloader = true;
    if (this.rapportImmoForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.immoService.immoRapport(this.rapportImmoForm.value)
        .subscribe(
          (res: any) => {
            // alert(JSON.stringify(res.data));
            if (res.success == true) {
              $('#spinnerr').addClass('d-none');
              console.log(res.data.data);
              this.ordreVierementData = res.data.data.ordre;
              var url = res.data.url;
              this.showloader = false;

              // window.open(res.data, '_blank');
              window.open(url , '_blank');
              location.reload();
            } else {
              $('#spinnerr').addClass('d-none');
              this.showloader = false;
              alert(res.message);
            }
          },
          (error: any) => {
            $('#spinnerr').addClass('d-none');
            this.showloader = false;
            alert("error serveur veuillez contacter l'administrateur du site");
          }
        );
    } else {
      $('#spinnerr').addClass('d-none');
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
