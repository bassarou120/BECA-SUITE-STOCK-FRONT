import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService, routes } from 'src/app/core/core.index';
import { WebStorage } from 'src/app/core/services/storage/web.storage';

interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public routes = routes;
  public CustomControler!: string | number | returndata;
  public subscription: Subscription;
  public Loginvalue = new BehaviorSubject<string | number | returndata>(0);
  public Toggledata = true;

  showloader = false;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('admin@admin.com', [Validators.required]),
    password: new UntypedFormControl('123456', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    private router: Router,
    private storage: WebStorage,
    private authservice: AuthService
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

    this.authservice.login(this.form.value).subscribe(
      (data: any) => {
        // alert(JSON.stringify(data));

        if (data.message == 'User login successfully.') {
          console.log(data);

          this.Loginvalue.next('Login success');

          localStorage.setItem('LoginData', data.data.token);
          localStorage.setItem('LoginToken', data.data.token);
          localStorage.setItem('userData', data.data.user);
          localStorage.setItem(
            'userDataString',
            JSON.stringify(data.data.user)
          );
          localStorage.setItem('logintime', Date());
          setTimeout(() => {
            // this.router.navigateByUrl('/dashboard/admin');
            this.showloader = false;
            this.router.navigate(['/dashboard/admin']);
          }, 100);
          // this.router.navigate(['/dashboard/admin']);
          this.Loginvalue.next(0);
        } else {
          this.showloader = false;
          alert(alert(JSON.stringify(data.message)));
        }
      },
      (error: any) => {
        this.showloader = false;
        if (error.error.message == 'Unauthorised.') {
          // this.router.navigate(['/dashboard/admin']);
          alert('E-mail ou mot de passe incorrect !  ');
        }
        // alert(JSON.stringify(error.error.message));
      }
    );

    // this.storage.Login(this.form.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
}
