import {
  Component,
  ElementRef,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { routes, TypeContratService } from 'src/app/core/core.index';
import { ContratService } from 'src/app/core/services/contrat/contrat.service';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
import { DocumentService } from 'src/app/core/services/document/document.service';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import * as path from 'path';



interface data {
   value: string;
}
import { formatDate } from '@angular/common';
import { MouvementService } from 'src/app/core/services/mouvement/mouvement.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit {
  public back = environment.base_url_backend;

  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';
  public selectedValue6 = '';
  public selectedValue7 = '';
  public selectedValue8 = '';
  public selectedValue9 = '';
  public selectedValue10 = '';
  public selectedValue11 = '';
  public selectedValue12 = '';
  public selectedValue13 = '';
  public selectedValue14 = '';
  public selectedValue15 = '';
  public routes = routes;
  bsValue = new Date();
  public addEmployeeForm!: FormGroup;

  selectedFile: File | null = null;

  @ViewChild('btnNomination') btnNomination: ElementRef | undefined;

  nbr_prime = 2;

  list_prime: any;
  list_banque: any;

  curentEmploye: any;
  idEmploye: any;

  listTypeContrat: any = [];
  lastContrat: any;
  dureeContrat: any;
  typeContrat: any;

  listDepartement: any;
  listPoste: any;
  listCategorie: any;
  listClasse: any;
  listGrade: any;
  listMouvement: any;
  listDocument: any;

  public editEmployeInfoPersoForm!: FormGroup;
  public affectationForm!: FormGroup;
  public nominationForm!: FormGroup;
  public addEmployeContratForm!: FormGroup;
  public addDocumentForm!: FormGroup;

  public valideContratForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private employeservice: EmployeService,
    private mouvementservice: MouvementService,
    private contraService: ContratService,
    private activatedRoute: ActivatedRoute,
    private typeContratService: TypeContratService,
    private documentService: DocumentService
  ) { }

  totalPrime = 0;
  form = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });

  documentTypes = [
    { lib: 'Acte de Naissance' },
    { lib: 'PassPort' },
    { lib: 'carte d’identité' },
    { lib: 'Attestation de résidence' },
    { lib: 'Copie de la carte CNSS' },
    { lib: 'Lettre de motivation' },
    { lib: 'Curriculum vitae' },
    { lib: 'Attestations de travail' },
    { lib: 'Acte de mariage pour les mariés' },
    { lib: 'Acte de naissance des enfant' },
    // Ajoutez d'autres types de documents ici
  ];
  documentFormat = [
    { lib: 'jpg' },
    { lib: 'png' },
    { lib: 'pdf' },
    { lib: 'doc' },
    { lib: 'docx' },
    { lib: 'jpeg' },
  ];

  showOtherInput = false;

  ngOnInit() {
    this.list_prime = [];
    this.activatedRoute.params.subscribe((params) => {
      const type = params['type'];
      this.idEmploye = params['id'];
    });
    this.addEmployeeForm = this.formBuilder.group({
      client: ['', [Validators.required]],
    });

    this.editEmployeInfoPersoForm = this.formBuilder.group({
      passport_exp: [new Date(), [Validators.required]],
      passport: ['', [Validators.required]],
      matrimoniale: ['', [Validators.required]],
      nbr_enfant: ['', [Validators.required]],
      banque: ['', []],
      banque_id: ['', [Validators.required]],
      rib: ['', [Validators.required]],
    });

    this.addEmployeContratForm = this.formBuilder.group({
      num_contrat: ['', [Validators.required]],
      type_contrat_id: ['', [Validators.required]],
      type_contrat: ['', [Validators.required]],
      employe_id: [this.idEmploye, []],
      base_categorielle: ['', [Validators.required]],
      prime_anciennete: ['', [Validators.required]],
      date_debut: ['', []],
      date_fin: ['', []],
      total_prime: ['', []],
      duree: ['', []],
      // duree: [this.idEmploye, [Validators.required]],
      // num_contrat: ['', [Validators.required]],
    });

    this.valideContratForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      action: ['', [Validators.required]],
    });

    // alert(this.idEmploye);
    this.getCurentEmploy();
    this.getListeBanque();
    this.getDataForListe();
    this.getEmpMeouvemt();



    // console.log(this.curentEmploye);

    this.affectationForm = this.formBuilder.group({
      employe_id: ['', [Validators.required]],
      poste_id: ['', [Validators.required]],
      old_poste_id: ['', [Validators.required]],
      type: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.nominationForm = this.formBuilder.group({
      employe_id: ['', [Validators.required]],
      poste_id: ['', [Validators.required]],
      grade_id: ['', [Validators.required]],
      old_poste_id: ['', [Validators.required]],
      old_grade_id: ['', [Validators.required]],
      type: ['', [Validators.required]],
      last_contrat_id: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });

    this.addDocumentForm = this.formBuilder.group({
      employe_id: ["", [Validators.required]],
      // type_document: ["", [Validators.required]],
      titre: ["", [Validators.required]],
      url: ["", [Validators.required]],
      otherDocument: [""]
    });

    // Synchronise le champ 'titre' avec 'otherDocument' lorsqu'il change
    this.addDocumentForm.get('otherDocument')?.valueChanges.subscribe(value => {
      if (this.showOtherInput) {
        this.addDocumentForm.get('titre')?.setValue(value);
      }
    });

  }

  onSelectionChange(event: any): void {
    const selectedValue = event.value;
    if (selectedValue === 'other') {
      this.showOtherInput = true;
      this.addDocumentForm.get('titre')?.reset();
      this.addDocumentForm.get('titre')?.clearValidators();
      this.addDocumentForm.get('otherDocument')?.setValidators([Validators.required]);
    } else {
      this.showOtherInput = false;
      this.addDocumentForm.get('titre')?.setValue(selectedValue);
      this.addDocumentForm.get('titre')?.setValidators([Validators.required]);
      this.addDocumentForm.get('otherDocument')?.clearValidators();
      this.addDocumentForm.get('otherDocument')?.reset();
    }
    this.addDocumentForm.get('titre')?.updateValueAndValidity();
    this.addDocumentForm.get('otherDocument')?.updateValueAndValidity();
  }

  onFileChange(event: Event, fieldName: string) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.addDocumentForm.get(fieldName)!.setValue(file);
    }
  }

  onClickSubmitDocument() {
    this.addDocumentForm
      .get('employe_id')
      ?.setValue(this.curentEmploye.employe.id);
    console.log(this.addDocumentForm.value, this.addDocumentForm.valid)

    if (this.addDocumentForm.valid) {
      const formData = new FormData();
      Object.keys(this.addDocumentForm.value).forEach(key => {
        formData.append(key, this.addDocumentForm.get(key)!.value);
      });
      this.documentService.saveDocument(formData).subscribe(response => {
        console.log(response);
        location.reload();
      }, error => {
        if (error.status === 422 && error.error.error === 'Le format spécifié n\'est pas identique au format de votre document') {
          alert('Le format spécifié n\'est pas identique au format de votre document');
        } else {
          console.error('Erreur:', error);
        }
      });
    } else {
      console.log("Desolé le formulaire est mal  renseigné");
    }
  }

  //  getFileName(path: string): string {
  //   return path.split('/').pop() || '';
  // }
   getFileName(path: string): string {
    const match = path.match(/[^\\/]+$/);
    return match ? match[0] : '';
  }

  logFileName(fileName: string): void {
    console.log(fileName);
  }

  // getFileExtension(filePath: string): string {
  //   // Séparer le chemin en segments en utilisant '/' pour obtenir le nom du fichier
  //   const segments = filePath.split('/');
  //   const fileName = segments.pop();

  //   // Vérifier si le nom du fichier est valide
  //   if (fileName) {
  //     // Séparer le nom du fichier en segments en utilisant '.' pour obtenir l'extension
  //     const fileNameSegments = fileName.split('.');
  //     const extension = fileNameSegments.pop();

  //     // Vérifier si l'extension est valide et renvoyer
  //     if (extension && fileNameSegments.length > 0) {
  //       return extension;
  //     }
  //   }

  //   return ''; // Retourner une chaîne vide si aucune extension n'est trouvée
  // }

  getDataForListe() {
    this.employeservice.getDepartementPoste().subscribe(
      (date: any) => {
        console.log(date);

        this.listDepartement = date.data.departement;
        this.listPoste = date.data.poste;
        this.listGrade = date.data.grade;
        // this.listCategorie = date.data.categorie;
        // this.listClasse = date.data.classe;
      },
      (error: any) => { }
    );
  }

  getEmpMeouvemt() {
    // alert(this.idEmploye);
    this.mouvementservice
      .getMouvementByEmploye({ id: this.idEmploye })
      .subscribe(
        (res: any) => {
           // alert(JSON.stringify(res.data[0].mouvements));
          this.listMouvement = res.data[0].mouvements;
        },
        (eror: any) => { }
      );
  }



  getMonthName(monthNumber: string): string {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return months[parseInt(monthNumber, 10) - 1];
  }

  get items() {
    return this.form.get('items') as FormArray;
  }
  removePrime(i: number) {
    // alert(JSON.stringify(i))
    this.items.removeAt(i);
    // this.list_prime.splice(i.id-1 ,1);
    this.calucleTotalPrime();
  }

  titreAction: any;
  getValideContratForm(id: any, action: any) {
    this.valideContratForm.patchValue({
      id: id,
      action: action,
    });
    this.titreAction = action;
  }

  showAddContratForm = true;

  showMessage=false
  showMessageStatus=""
  initAddContrat() {
    // alert('init create contrat');
    this.typeContratService.getAllTypeContrat().subscribe(
      (data: any) => {
        // alert(JSON.stringify(data.data.data));
        this.listTypeContrat = data.data.data;
      },
      (erro: any) => { }
    );

    this.employeservice.getLastContrat().subscribe(
      (data: any) => {
        // alert(JSON.stringify(data.data));
        // this.listTypeContrat=data.data.data
        this.lastContrat = data.data;

        console.log(data.data);
        this.addEmployeContratForm
          .get('num_contrat')
          ?.setValue('C-000' + (data.data == 0 ? '1' : data.data.id));
      },
      (erro: any) => { }
    );

    // alert(JSON.stringify(this.curentEmploye.employe.grade_id));
    this.employeservice
      .getGradeById(this.curentEmploye.employe.grade_id)
      .subscribe(
        (data: any) => {
          // alert(JSON.stringify(data.data));
          // this.listTypeContrat=data.data.data
          // this.lastContrat = data.data;

          console.log(data.data);
          this.addEmployeContratForm
            .get('base_categorielle')
            ?.setValue(data.data.base_categorielle);

          this.addEmployeContratForm
            .get('prime_anciennete')
            ?.setValue(data.data.prime_enciennete);
        },
        (erro: any) => {
          alert(JSON.stringify(erro));
        }
      );
    // alert(JSON.stringify(this.idEmploye));

    this.employeservice.getLastContratByEmployeId(this.idEmploye).subscribe(
      (data: any) => {
       // alert(JSON.stringify(data.data.last_contrat));
       // alert(JSON.stringify(data.data.last_contrat[0].etat));
       //  alert(JSON.stringify(data.data.last_contrat[0].status));
        this.showMessageStatus=data.data.last_contrat[0].status;

        if (this.showMessageStatus=="Valide et en cours" || this.showMessageStatus=="En attente de validation"){
          this.showMessage=true;
        }else {
          this.showMessage=false;
        }
        // last_contrat;
        // this.listTypeContrat=data.data.data
        // this.lastContrat=data.data
        //
        // console.log(data.data)
        // this.addEmployeContratForm.get('num_contrat')?.setValue("C-000"+data.data.id)
      },
      (erro: any) => { }
    );
  }

  getEditInfoPersoForm() {
    // alert(JSON.stringify(this.curentEmploye.employe));
    this.editEmployeInfoPersoForm.patchValue({
      passport_exp: this.curentEmploye.employe.passport_exp,
      passport: this.curentEmploye.employe.passport,
      matrimoniale: this.curentEmploye.employe.matrimoniale,
      nbr_enfant: this.curentEmploye.employe.nbr_enfant,
      banque: this.curentEmploye.employe.banque,
      banque_id: this.curentEmploye.employe.bank_id,
      rib: this.curentEmploye.employe.rib,
    });
  }
  onClickSubmitInfoPersoEmployee() {
    // alert(JSON.stringify(this.editEmployeInfoPersoForm.value));
    // console.log(this.editEmployeInfoPersoForm.value);
    this.employeservice
      .updateInfoPerso(
        this.editEmployeInfoPersoForm.value,
        this.curentEmploye.employe.id
      )
      .subscribe(
        (data: any) => {
          // alert(JSON.stringify(data));
          // this.curentEmploye = data.data;
          location.reload();
        },
        (error: any) => { }
      );
  }

  onClickSubmitAfectationEmployee() {
    this.affectationForm
      .get('employe_id')
      ?.setValue(this.curentEmploye.employe.id);
    this.nominationForm
      .get('old_poste_id')
      ?.setValue(this.curentEmploye.poste.id);
    this.affectationForm.get('type')?.setValue('Affectation');

    this.mouvementservice.saveMouvement(this.affectationForm.value).subscribe(
      (res: any) => {
        if (res.success == true) {
          document.location.reload();
        } else {
          alert(
            "Erreur serveur ! \n veuillez contactez l'administarteur du serveur"
          );
        }
        // alert(JSON.stringify(res));
      },
      (error: any) => { }
    );
  }

  onClickSubmitNominationEmployee() {
    this.nominationForm
      .get('employe_id')
      ?.setValue(this.curentEmploye.employe.id);
    this.nominationForm.get('type')?.setValue('Nomination');
    this.nominationForm
      .get('old_poste_id')
      ?.setValue(this.curentEmploye.poste.id);

    this.nominationForm
      .get('old_grade_id')
      ?.setValue(this.curentEmploye.grade.id);

    this.nominationForm
      .get('last_contrat_id')
      ?.setValue(this.curentEmploye?.last_contat.id);

    // alert(JSON.stringify(this.nominationForm.value));

    this.mouvementservice.saveMouvement(this.nominationForm.value).subscribe(
      async (res: any) => {
        if (res.success == true) {
          this.employeservice.getEmploye(this.idEmploye).subscribe(
            (data: any) => {
              // alert(JSON.stringify(data));
              this.curentEmploye = data.data;

              console.log(this.curentEmploye);

              let el: HTMLElement = document.getElementById(
                'btnNewContrat'
              ) as HTMLElement;
              el.click();
            },
            (error: any) => { }
          );

          // this.subContent.nativeElement.click();
          // document.location.reload();
        } else {
          alert(
            "Erreur serveur ! \n veuillez contactez l'administarteur du serveur"
          );
        }
        // alert(JSON.stringify(res));
      },
      (error: any) => { }
    );
  }

  async getCurentEmploy() {
    this.employeservice.getEmploye(this.idEmploye).subscribe(
      (data: any) => {
        // alert(JSON.stringify(data));
        this.curentEmploye = data.data;

        console.log(this.curentEmploye);
      },
      (error: any) => { }
    );
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
      (error: any) => { }
    );
  }

  changeType() {
    if (this.typeContrat?.libelle == 'CDI') {
      // alert(this.typeContrat.libelle);
      // this.addEmployeContratForm.get('date_debut')?.disable();
      this.addEmployeContratForm.get('duree')?.disable();
    } else {
      this.addEmployeContratForm.get('date_debut')?.enable();
      this.addEmployeContratForm.get('duree')?.enable();
    }

    // alert(this.typeContrat?.id);
    this.addEmployeContratForm
      .get('type_contrat_id')
      ?.setValue(this.typeContrat?.id);
  }
  changeDuree() {
    // alert(this.dureeContrat);

    if (this.addEmployeContratForm.get('date_debut')?.value != null) {
      var myDate = new Date(
        this.addEmployeContratForm.get('date_debut')?.value
      );
      myDate.setMonth(myDate.getMonth() + this.dureeContrat);

      this.addEmployeContratForm
        .get('date_fin')
        ?.setValue(formatDate(myDate, 'yyyy-MM-dd', 'en'));
    }
  }

  changeDateDebut() {
    var myDate = new Date(this.addEmployeContratForm.get('date_debut')?.value);
    if (this.dureeContrat != null) {
      myDate.setMonth(myDate.getMonth() + this.dureeContrat);

      this.addEmployeContratForm
        .get('date_fin')
        ?.setValue(formatDate(myDate, 'yyyy-MM-dd', 'en'));
    }

    // alert(myDate.toDateString());
  }

  onClickSubmitaddEmployeContrat() {
    $('#spinner').removeClass('d-none');

    // alert(JSON.stringify(this.addEmployeContratForm.valid))
    // alert(JSON.stringify(this.addEmployeContratForm.value))
    if (this.addEmployeContratForm.valid) {
      this.addEmployeContratForm.get('total_prime')?.setValue(this.totalPrime);
      this.addEmployeContratForm
        .get('date_debut')
        ?.setValue(
          new Date(this.addEmployeContratForm.get('date_debut')?.value)
            .toISOString()
            .slice(0, 10)
            .replace('T', ' ')
        );
      var obj = this.addEmployeContratForm.value;

      if (this.typeContrat?.libelle != 'CDI') {
        this.addEmployeContratForm
          .get('date_fin')
          ?.setValue(
            new Date(this.addEmployeContratForm.get('date_fin')?.value)
              .toISOString()
              .slice(0, 10)
              .replace('T', ' ')
          );
        // var obj = this.addEmployeContratForm.value;
        Object.assign(obj, {
          prime: this.form.value.items,
          duree: this.calculeNomberDay(
            new Date(this.addEmployeContratForm.get('date_debut')?.value),
            new Date(this.addEmployeContratForm.get('date_fin')?.value)
          ),
        });
      }else {

        Object.assign(obj, {
          prime: this.form.value.items,

        });

      }



      // alert(JSON.stringify(obj));

      this.contraService.saveContatEmploye(obj).subscribe(
        (data: any) => {
          $('#spinner').addClass('d-none');
          // alert(JSON.stringify(data.data));
          $('#spinner').addClass('d-none');
          location.reload();
        },
        (error: any) => {
          $('#spinner').addClass('d-none');
          alert(JSON.stringify(error));
        }
      );
    }

    // this.addEmployeContratForm.get('date_debut')?.setValue( (new Date(this.addEmployeContratForm.get('date_debut')?.value)).toISOString().slice(0, 10).replace('T', ' '))
    // this.addEmployeContratForm.get('date_fin')?.setValue( (new Date(this.addEmployeContratForm.get('date_fin')?.value)).toISOString().slice(0, 10).replace('T', ' '))
    //
    // var obj =this.addEmployeContratForm.value;
    // Object.assign(obj, {
    //   prime: this.form.value.items,
    //   duree:this.calculeNomberDay( (new Date(this.addEmployeContratForm.get('date_debut')?.value)),(new Date(this.addEmployeContratForm.get('date_fin')?.value)))
    // });

    // alert(JSON.stringify( this.addEmployeContratForm.value));
    // alert(JSON.stringify( this.form.value.items));
    //  alert(JSON.stringify( obj));
  }

  onClickSubmitValideContrat() {
    this.valideContratForm.value;

    // alert(JSON.stringify(this.valideContratForm.value));

    this.contraService
      .validerContatEmploye(
        this.valideContratForm.value.id,
        this.valideContratForm.value
      )
      .subscribe(
        (data: any) => {
          // alert(JSON.stringify(data.data));
          location.reload();
        },
        (error: any) => {
          if (
            error.error.message ==
            'SQLSTATE[23000]: Integrity constraint violation: 1451 Cannot delete or update a parent row: a foreign key constraint fails (`beca_suite_grh_db`.`fichepaies`, CONSTRAINT `fichepaies_contrat_id_foreign` FOREIGN KEY (`contrat_id`) REFERENCES `contrats` (`id`) ON DELETE NO ACTION) (Connection: mysql, SQL: delete from `contrats` where `id` = 13)'
          ) {
            alert(
              'Desolé nous ne pouvons supprimer ce contrat car il est en relation avec plusieur Fiches de Paie'
            );
          }

          // alert(JSON.stringify(error.error.message));
        }
      );
  }

  addPrime() {
    this.items.push(
      this.formBuilder.group({
        indenmite: [''],
        montant_indenmite: [''],
      })
    );
    this.calucleTotalPrime();

    console.log(this.items.length);

    // alert(JSON.stringify(this.list_prime));
    // this.list_prime.push({'id':this.list_prime.length+1,'indenmite':'', 'montant':'0'},)
  }

  convertStringToInt(str: any) {
    return Number(str);
  }

  calculeNomberDay(date1: any, date2: any) {
    // let date1 = new Date("01/16/2024");
    // let date2 = new Date("01/26/2024");

    // Calculating the time difference
    // of two dates
    let Difference_In_Time = date2.getTime() - date1.getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    // To display the final no. of days (result)
    console.log(
      'Total number of days between dates:\n' +
      date1.toDateString() +
      ' and ' +
      date2.toDateString() +
      ' is: ' +
      Difference_In_Days +
      ' days'
    );

    return Difference_In_Days;
  }
  calucleTotalPrime() {
    var traveler: any = this.form.value.items;

    function montant_indenmite(item: any) {
      return item.montant_indenmite;
    }

    function sum(prev: any, next: any) {
      return prev + next;
    }

    this.totalPrime = traveler.map(montant_indenmite).reduce(sum);

    // alert(this.totalPrime)

    // this.totalPrime=
    // this.form.value.items.reduce((n, {montant_indenmite}) => n + montant_indenmite, 0)
  }

  /*
  selectedList1: data[] = [
    { value: 'Select PF contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList2: data[] = [
    { value: 'Select PF contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList3: data[] = [
    { value: 'Select PF contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList4: data[] = [
    { value: 'Select additional rate' },
    { value: '0%' },
    { value: '1%' },
    { value: '2%' },
    { value: '3%' },
    { value: '4%' },
    { value: '5%' },
    { value: '6%' },
    { value: '7%' },
    { value: '8%' },
    { value: '9%' },
    { value: '10%' },
  ];
  selectedList5: data[] = [
    { value: 'Select PF contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList6: data[] = [
    { value: 'Select additional rate' },
    { value: '0%' },
    { value: '1%' },
    { value: '2%' },
    { value: '3%' },
    { value: '4%' },
    { value: '5%' },
    { value: '6%' },
    { value: '7%' },
    { value: '8%' },
    { value: '9%' },
    { value: '10%' },
  ];
  selectedList7: data[] = [
    { value: 'Select ESI contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList8: data[] = [
    { value: 'Select ESI contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList9: data[] = [
    { value: 'Select ESI contribution' },
    { value: 'Yes' },
    { value: 'No' },
  ];
  selectedList10: data[] = [
    { value: 'Select additional rate' },
    { value: '0%' },
    { value: '1%' },
    { value: '2%' },
    { value: '3%' },
    { value: '4%' },
    { value: '5%' },
    { value: '6%' },
    { value: '7%' },
    { value: '8%' },
    { value: '9%' },
    { value: '10%' },
  ];
  selectedList11: data[] = [{ value: 'Male' }, { value: 'Female' }];
  selectedList12: data[] = [
    { value: 'Select Department' },
    { value: 'Web Development' },
    { value: 'IT Management' },
    { value: 'Marketing' },
  ];
  selectedList13: data[] = [
    { value: 'Select poste_id' },
    { value: 'Web Designer' },
    { value: 'Web Developer' },
    { value: 'Android Developer' },
  ];
  selectedList14: data[] = [
    { value: '-' },
    { value: 'Wilmer Deluna' },
    { value: 'Lesley Grauer' },
    { value: 'Jeffery Lalor' },
  ];
  selectedList15: data[] = [
    { value: '-' },
    { value: 'Single' },
    { value: 'Married' },
  ];

  */

  selectedList15: data[] = [
    { value: '-' },
    { value: 'Celibataire' },
    { value: 'Marié' },
  ];
}
