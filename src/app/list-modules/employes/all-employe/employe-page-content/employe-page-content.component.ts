import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, lstEmployee, routes } from 'src/app/core/core.index';
import { EmployeService } from '../../../../core/services/employe/employe.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employe-page-content.component.html',
  styleUrls: ['./employe-page-content.component.scss'],
})
export class EmployePageContentComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  // public lstEmployee: Array<lstEmployee>;
  public lstEmployee: Array<any> = [];

  public deleteEmployeForm!: FormGroup;

  public editEmployeeForm!: FormGroup;
  public recherceheEmployeForm!: FormGroup;
  DepatartemtSelectedOption: any;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private http: HttpClient,
    private dataservice: DataService,
    private employeservice: EmployeService
  ) {
    // this.lstEmployee = this.employeservice.lstEmployee
    // this.lstEmployee = this.dataservice.lstEmployee
  }
  duree: any;
  employeForEdit: any;
  ngOnInit(): void {
    this.getEnmpl();
    this.getDataForListe();
    this.deleteEmployeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });

    this.recherceheEmployeForm = this.formBuilder.group({
      matricule: ['', []],
      poste: ['', []],
      nom: ['', []],
    });

    this.editEmployeeForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      // username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      // password: ['123456', [Validators.required]],
      // c_password: ['123456', [Validators.required]],
      departement_id: ['', [Validators.required]],
      poste_id: ['', []],

      telephone: ['', [Validators.required]],
      date_arrivee: ['', [Validators.required]],

      // matricule: ['', []],
      rib: ['', []],
      sexe: ['', []],
      affiliation: ['', []],
      titre: ['', []],
      anciennete: ['', []],
      grade_id: ['', []],

      date_naisance: ['', []],
      lieu_naisance: ['', []],
      address: ['', []],

      // EmployeeID: ["", [Validators.required]],
    });
  }

  getEnmpl() {
    this.employeservice.getAllEmploye().subscribe((data: any) => {
      console.log(data['data']['data']);
      this.lstEmployee = data['data'];
    });
  }

  getIDForm(id: any) {
    this.deleteEmployeForm.patchValue({
      id: id,
    });
  }

  onClickSubmitRechercheEmployee() {
    // this.
    // alert(JSON.stringify(this.recherceheEmployeForm.value));

    this.employeservice
      .getRechercheEmploye(this.recherceheEmployeForm.value)
      .subscribe((data: any) => {
        // alert(JSON.stringify(data));
        console.log(data['data']);
        this.lstEmployee = data['data'];
      });
  }
  onClickSubmitDeleteEmplye() {
    console.log(this.deleteEmployeForm.value);

    // alert(this.deleteEmployeForm.value.id);

    if (this.deleteEmployeForm.valid) {
      this.employeservice
        .deleteEmploye(this.deleteEmployeForm.value.id)
        .subscribe((data: any) => {
          console.log(data['data']['data']);
          // this.lstEmployee = data['data'];
          location.reload();
        });
    }
  }

  // nom: ['', [Validators.required]],
  // prenom: ['', [Validators.required]],
  // username: ['', [Validators.required]],
  // email: ['', [Validators.required]],
  // departement_id: ['', [Validators.required]],
  // poste_id: ['', [Validators.required]],

  // telephone: ['', [Validators.required]],
  // date_arrivee: ['', [Validators.required]],

  // matricule: ['', []],
  // rib: ['', []],
  // sexe: ['', []],
  // affiliation: ['', []],
  // titre: ['', []],
  // anciennete: ['', []],
  // grade_id: ['', []],

  // date_naisance: ['', []],
  // lieu_naisance: ['', []],
  // address: ['', []],

  initEdditEploye(id: any) {
    this.getDataForListe();
    this.employeservice.getEmploye(id).subscribe((res: any) => {
      // alert(JSON.stringify(res.data));
      this.employeForEdit = res.data.employe;
      console.log(res.data);
      this.editEmployeeForm.get('nom')?.setValue(res.data.employe.nom);
      this.editEmployeeForm.get('prenom')?.setValue(res.data.employe.prenom);
      this.editEmployeeForm.get('email')?.setValue(res.data.employe.email);
      this.editEmployeeForm.get('adresse')?.setValue(res.data.employe.adresse);
      this.editEmployeeForm
        .get('username')
        ?.setValue(res.data.employe.username);
      this.editEmployeeForm
        .get('anciennete')
        ?.setValue(res.data.employe.anciennete);
      this.editEmployeeForm
        .get('telephone')
        ?.setValue(res.data.employe.telephone);
      this.editEmployeeForm
        .get('date_arrivee')
        ?.setValue(res.data.employe.date_arrivee);
      this.editEmployeeForm
        .get('affiliation')
        ?.setValue(res.data.employe.affiliation);
      this.editEmployeeForm.get('titre')?.setValue(res.data.employe.titre);
      this.editEmployeeForm
        .get('date_naisance')
        ?.setValue(res.data.employe.date_naisance);
      this.editEmployeeForm
        .get('lieu_naisance')
        ?.setValue(res.data.employe.lieu_naisance);
    });

    this.DepatartemtSelectedOption = 3;
  }

  onClickSubmitEditEmployee() {
    if (this.editEmployeeForm.valid) {
      // console.log(this.editEmployeeForm.value);
      this.employeservice
        .updateEmploye(this.editEmployeeForm.value, this.employeForEdit.id)
        .subscribe(
          (data: any) => {
            $('#spinner').addClass('d-none');
            location.reload();
            // this.router.navigate(['/employees/employee-page']);
          },
          (error: any) => {
            alert(JSON.stringify(error.error));
          }
        );
    } else {
      alert("desole le formulaire n'est pas bien renseigné");
    }
  }

  listDepartement: any;
  listPoste: any;
  listCategorie: any;
  listClasse: any;
  listGrade: any;
  getDataForListe() {
    this.employeservice.getDepartementPoste().subscribe(
      (date: any) => {
        // console.log(date);

        this.listDepartement = date.data.departement;
        this.listPoste = date.data.poste;
        this.listGrade = date.data.grade;
        // this.listCategorie = date.data.categorie;
        // this.listClasse = date.data.classe;
      },
      (error: any) => {}
    );

    // this.employeservice.getLastContrat().subscribe(
    //   (data: any) => {
    //     // alert(JSON.stringify(data.data));
    //     // this.listTypeContrat=data.data.data
    //     // this.lastContrat = data.data;

    //     // console.log(data.data);
    //     this.addEmployeeForm
    //       .get('matricule')
    //       ?.setValue('E-000' + (data.data == 0 ? '1' : data.data.id));
    //   },
    //   (erro: any) => {}
    // );
  }
}
