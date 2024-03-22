import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeService } from '../../../../core/services/employe/employe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employe-modal.component.html',
  styleUrls: ['./employe-modal.component.scss'],
})
export class EmployeModalComponent implements OnInit {
  public addEmployeeForm!: FormGroup;
  public editEmployeeForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private employeservice: EmployeService
  ) {}

  curentId: any;

  listDepartement: any;
  listPoste: any;
  listCategorie: any;
  listClasse: any;

  ngOnInit(): void {
    // "nom": "toto",
    //   "prenom": "dalout",
    //   "telephone": "97602657",
    //   "email": "yacouboubassarou+1@gmail.com",
    //   "date_arrivee": "2024-03-13",
    //   "image": null,
    //   "poste_id": 1,
    //   "user_id": 12,
    //   "departement_id": 1,
    // add employee form validation

    // 'matricule',
    //   'rib',
    //   'sexe',
    //   'affiliation',
    //   'titre',
    //   'anciennete',

    this.getDepartementPost();
    this.addEmployeeForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['123456', [Validators.required]],
      c_password: ['123456', [Validators.required]],
      departement_id: ['', [Validators.required]],
      poste_id: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      date_arrivee: ['', [Validators.required]],

      matricule: ['', []],
      rib: ['', []],
      sexe: ['', []],
      affiliation: ['', []],
      titre: ['', []],
      anciennete: ['', []],
      classe_id: ['', []],
      categorie_id: ['', []],
      date_naisance: ['', []],
      lieu_naisance: ['', []],

      // EmployeeID: ["", [Validators.required]],
    });

    // edit form validation
    this.editEmployeeForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      Password: ['123456', [Validators.required]],
      ConfirmPassword: ['123456', [Validators.required]],
      DepartmentName: ['', [Validators.required]],
      Designation: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      JoinDate: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      EmployeeID: ['', [Validators.required]],
    });
  }

  onClickSubmitAddEmployee() {
    console.log(this.addEmployeeForm.value);
    alert(JSON.stringify(this.addEmployeeForm.value));

    let date = new Date(this.addEmployeeForm.get('date_arrivee')?.value);
    // alert(date.toISOString().slice(0, 10).replace('T', ' '));
    let mdate = date.toISOString().slice(0, 10).replace('T', ' ');
    this.addEmployeeForm.get('date_arrivee')?.setValue(mdate);

    let mdate1 = (new Date(this.addEmployeeForm.get('date_naisance')?.value)).toISOString().slice(0, 10).replace('T', ' ');
    this.addEmployeeForm.get('date_naisance')?.setValue(mdate1);

    // alert(this.addEmployeeForm.get('date_arrivee')?.value);
    if (this.addEmployeeForm.valid) {
      this.employeservice.saveEmploye(this.addEmployeeForm.value).subscribe(
        (data: any) => {
          location.reload();
          this.router.navigate(['/employees/employee-page']);
        },
        (error: any) => {
          alert(JSON.stringify(error.error));
        }
      );
    } else {
      alert("desole le formulaire n'est pas bien renseigné");
    }
  }

  deleteEmploye(id: any) {
    // console.log(this.deleteTypeCongeForm.value, this.deleteTypeCongeForm.valid);

    this.employeservice.deleteEmploye(id).subscribe((response) => {
      console.log(response);
      location.reload();
    });
  }

  getDepartementPost() {
    this.employeservice.getDepartementPoste().subscribe(
      (date: any) => {
        console.log(date);

        this.listDepartement = date.data.departement;
        this.listPoste = date.data.poste;
        this.listCategorie = date.data.categorie;
        this.listClasse = date.data.classe;
      },
      (error: any) => {}
    );
  }
}
