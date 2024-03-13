import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService  {
  constructor(public router: Router) {}

  canActivate(): boolean {
    if (!localStorage.getItem('LoginData')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
