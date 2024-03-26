import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { EmployeService } from 'src/app/core/services/employe/employe.service';
interface data {
  value: string;
}

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit {
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

  curentEmploye: any;
  idEmploye: any;
  public editEmployeInfoPersoForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private employeservice: EmployeService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const type = params['type'];
      this.idEmploye = params['id'];
    });
    this.addEmployeeForm = this.formBuilder.group({
      client: ['', [Validators.required]],
    });

    this.editEmployeInfoPersoForm = this.formBuilder.group({
      passport_exp: ['', [Validators.required]],
      passport: ['', [Validators.required]],
      matrimoniale: ['', [Validators.required]],
      nbr_enfant: ['', [Validators.required]],
      banque: ['', [Validators.required]],
      rib: ['', [Validators.required]],
    });

    // alert(this.idEmploye);
    this.getCurentEmploy();
  }
  getEditInfoPersoForm(){
    this.editEmployeInfoPersoForm.patchValue(
      {
        passport_exp: this.curentEmploye.passport_exp ,
        passport:   this.curentEmploye.passport ,
        matrimoniale: this.curentEmploye.matrimoniale ,
        nbr_enfant: this.curentEmploye.nbr_enfant ,
        banque: this.curentEmploye.banque ,
        rib: this.curentEmploye.rib ,
      }
    );
  }

  onClickSubmitInfoPersoEmployee(){
    // alert(JSON.stringify(this.editEmployeInfoPersoForm.value))
    console.log(this.editEmployeInfoPersoForm.value)
    this.employeservice.updateInfoPerso(this.editEmployeInfoPersoForm.value,this.curentEmploye.id)
      .subscribe(
        (data: any) => {
          // alert(JSON.stringify(data));
          // this.curentEmploye = data.data;
          location.reload()
        },
        (error: any) => {}
      );

  }

  getCurentEmploy() {
    this.employeservice.getEmploye(this.idEmploye).subscribe(
      (data: any) => {
        // alert(JSON.stringify(data));
        this.curentEmploye = data.data;
      },
      (error: any) => {}
    );
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
