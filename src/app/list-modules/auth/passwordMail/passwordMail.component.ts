import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService, routes, passwordMailService } from 'src/app/core/core.index';
import { WebStorage } from 'src/app/core/services/storage/web.storage';

interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './passwordMail.component.html',
  styleUrls: ['./passwordMail.component.scss'],
})
export class PasswordMailComponent implements OnInit, OnDestroy {
  public routes = routes;
  public CustomControler!: string | number | returndata;
  public subscription: Subscription;
  public Loginvalue = new BehaviorSubject<string | number | returndata>(0);
  public Toggledata = true;

  showloader = false;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    private router: Router,
    private storage: WebStorage,
    private passwordMailService: passwordMailService
  ) {
    this.subscription = this.storage.Loginvalue.subscribe((data) => {
      if (data !== 0) {
        this.CustomControler = data;
      }
    });
  }

  ngOnInit() {
    // this.storage.Checkuser();
    // localStorage.removeItem('LoginData');
  }

  submit() {
    this.showloader = true; // alert(JSON.stringify(this.form.value));

    if (this.form.valid){
      this.passwordMailService.savePasswordMail(this.form.value).subscribe(
        (data: any) => {
          location.reload();
        });
      } else {
        console.log("Desolé le formulaire n'est pas bien renseigné");
      }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
}
