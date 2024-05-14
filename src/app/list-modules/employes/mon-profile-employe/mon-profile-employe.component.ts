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
  public editPasswordForm!: FormGroup ;
  public routes = routes;
  public curentEmploye: any;
  public Toggledata = [true, true, true];
  //Toggledata: boolean = false;
  employeeId: any;

  constructor(private monprofileservice: MonprofileService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.getLoggedUserId();
    this.getCurentEmploy();

    this.editPasswordForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    }, { validator: this.newPasswordValidator });
  }

  private newPasswordValidator(group: FormGroup) {
    const newPasswordControl = group.get('new_password');
    const confirmNewPasswordControl = group.get('confirm_password');
    if (!newPasswordControl || !confirmNewPasswordControl) {
      return null;
    }
    const newPassword = newPasswordControl.value;
    if (newPassword && (newPassword.length < 6)) {
      return { passwordTooShort: true };
    }
    const confirmNewPassword = confirmNewPasswordControl.value;
    if (newPassword && confirmNewPassword && (newPassword != confirmNewPassword)) {
      return { unmatchedPasswords: true };
    }
    return null;
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
        },
        (error: any) => {}
        );

      },
      (error: any) => {}
    );
  }


  saveMotdepasse() {
    // console.log(this.addTypeCongeForm.value, this.addTypeCongeForm.valid);
    if (this.editPasswordForm.valid){
      var data = this.editPasswordForm.value;
      data["id_user"] = this.loggedUserId;
      this.monprofileservice.saveMotdepasse(data).subscribe(response => {
        alert("Mot de passe modifié avec succes");
        location.reload();
      },
      (error: string) => {
        this.showModal(error);
      });
    }
  }

  showModal(message: string) {
    const modal = document.getElementById('alert_modal');
    if (modal) {
      const messageElement = modal.querySelector('.modal-body p');
      if (messageElement) {
        messageElement.textContent = message;
      }
      modal.style.display = 'block';
      modal.classList.add('show');
      const firstFocusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement).focus();
      }
      const okButton = modal.querySelector('.cancel-btn');
      if (okButton) {
        okButton.addEventListener('click', () => {
          this.hideModal(modal);
        });
      }
      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.hideModal(modal);
        }
      });
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.hideModal(modal);
        }
      });
  } else {
    console.error("Modal element not found!");
  }
  }

  hideModal(modal: HTMLElement) {
    modal.style.display = 'none';
    modal.classList.remove('show');
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

  iconLogle(index: number) {
    this.Toggledata[index] = !this.Toggledata[index];
  }

}
