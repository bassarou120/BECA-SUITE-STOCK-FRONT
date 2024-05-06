import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  getMonprofile, routes, } from 'src/app/core/core.index';
import { MonprofileService } from 'src/app/core/services/mon-profile/mon-profile';
//import { EmployeService } from 'src/app/core/services/employe/employe.service';
interface data {
  value: string;
}

@Component({
  selector: 'app-mon-profile-employe',
  templateUrl: './mon-profile-employe.component.html',
  styleUrls: ['./mon-profile-employe.component.scss']
})
export class MonProfilComponent implements OnInit {
  public loggedUserId: number = 0
  public loggedEmployeId: number = 0;
  public addMotdepasseForm!: FormGroup ;
  public routes = routes;
  public curentEmploye: any;
  employeeId: any; 

  constructor(private monprofileservice: MonprofileService, private formBuilder: FormBuilder) { }
  

  ngOnInit(): void {
    this.getLoggedUserId();
    this.getCurentEmploy();

    this.addMotdepasseForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      
  })
   
    //this.employeeId = this.monprofileservice.getConnectedEmployeID();
  }
  private getLoggedUserId() {
    const userDataString = localStorage.getItem('userDataString');
    if(userDataString) {
      const userData = JSON.parse(userDataString)
      this.loggedUserId = userData['id'];
    } else {
      console.log("erreur")
    }
  }

  getCurentEmploy() {
    this.monprofileservice.getConnectedEmployeID(this.loggedUserId).subscribe((res: any) => {
      this.loggedEmployeId = res.data;
      
        this.monprofileservice.getConnectedEmployeWithID(this.loggedEmployeId).subscribe((res: any) => {
          this.curentEmploye = res.data;
          console.log(this.curentEmploye)
        },
        (error: any) => {}
        );
      
      },
      (error: any) => {}
    );    
  }


  saveMotdepasse() {
    // console.log(this.addTypeCongeForm.value, this.addTypeCongeForm.valid);
    if (this.addMotdepasseForm.valid){
      var data = this.addMotdepasseForm.value;
      data["id_user"] = this.loggedUserId;
      this.monprofileservice.saveMotdepasse(data).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } 
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

  

}
