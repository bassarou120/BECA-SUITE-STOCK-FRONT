import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {EmployeService} from "../../../../core/services/employe/employe.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employe-modal.component.html',
  styleUrls: ['./employe-modal.component.scss']
})
export class EmployeModalComponent implements OnInit {
  public addEmployeeForm!: FormGroup ;
  public editEmployeeForm!: FormGroup
  constructor(private formBuilder: FormBuilder,public router: Router,private employeservice :EmployeService) { }

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
    this.addEmployeeForm = this.formBuilder.group({
      nom: ["", [Validators.required]],
      prenom: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      c_password: ["", [Validators.required]],
      departement_id: ["", [Validators.required]],
      poste_id: ["", [Validators.required]],
      email: ["", [Validators.required]],
      telephone: ["", [Validators.required]],
      date_arrivee: ["", [Validators.required]],

      // EmployeeID: ["", [Validators.required]],
    });

    // edit form validation
    this.editEmployeeForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      ConfirmPassword: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
      Designation: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      JoinDate: ["", [Validators.required]],
      CompanyName: ["", [Validators.required]],
      EmployeeID: ["", [Validators.required]],
    });
  }


  onClickSubmitAddEmployee(){
    console.log(this.addEmployeeForm.value)

    if (this.addEmployeeForm.valid){
      this.employeservice.saveEmploye(this.addEmployeeForm.value).subscribe(
        (data:any)=>{
          this.router.navigate(['/employees/employee-page'])
        }
      )
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

  }



}
