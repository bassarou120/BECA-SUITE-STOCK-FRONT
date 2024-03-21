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

  ngOnInit(): void {
    this.getEnmpl();
    this.deleteEmployeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
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
}
