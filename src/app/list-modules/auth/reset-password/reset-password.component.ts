import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService, routes, passwordMailService } from 'src/app/core/core.index';
import { WebStorage } from 'src/app/core/services/storage/web.storage';
import { HttpClient } from '@angular/common/http';


interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  public routes = routes;
  public CustomControler!: string | number | returndata;
  public subscription: Subscription;
  public Loginvalue = new BehaviorSubject<string | number | returndata>(0);
  public Toggledata = [true, true, true];

  password: string= '';
  passwordConfirmation: string= '';
  token: string;
  email: string;


successMessage: string | null = null;
errorMessage: string | null = null;

public editPasswordForm!: FormGroup ;

  showloader = false;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required]),
  });

  iconLogle(index: number) {
    this.Toggledata[index] = !this.Toggledata[index];
  }

  get f() {
    return this.form.controls;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private storage: WebStorage,
    private passwordMailService: passwordMailService,
    private formBuilder: FormBuilder,

  ) {
    this.subscription = this.storage.Loginvalue.subscribe((data) => {
      if (data !== 0) {
        this.CustomControler = data;
      }
    });

    this.token = this.route.snapshot.queryParamMap.get('token')?? '';
    this.email = this.route.snapshot.queryParamMap.get('email')?? '';
  }

  ngOnInit() {
    // this.storage.Checkuser();
    // localStorage.removeItem('LoginData');

    this.editPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    }, { validator: this.newPasswordValidator });
  }

  resetPassword() {
    var data = this.editPasswordForm.value;
    data["email"] = this.email;
    data["token"] = this.token;
    this.passwordMailService.savePasswordMail2(data).subscribe(response => {
      alert("Mot de passe modifié avec succes");
      this.router.navigate(['/login']);
    },
    (error: string) => {
      alert("erreur");
    });
  }


  private newPasswordValidator(group: FormGroup) {
    const newPasswordControl = group.get('password');
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




  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
