import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class SuperAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;
    // Si le rôle de l'utilisateur est: SuperAdmin, il a accès
    if (userRole! == 0) {
      return true;
    }
    // Sinon, redirigez vers la page unauthorized
    this.router.navigate(['/dashboard/employee']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;
    // Si le rôle de l'utilisateur est: Admin ou Supérieur, il a accès
    if (userRole! <= 1) {
      return true;
    }
    // Sinon, redirigez vers la page unauthorized
    this.router.navigate(['/dashboard/employee']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GRHGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;
    // Si le rôle de l'utilisateur est: GRH ou Supérieur, il a accès
    if (userRole! <= 2) {
      return true;
    }
    // Sinon, redirigez vers la page unauthorized
    this.router.navigate(['/dashboard/employee']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EmployeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;
    // Si le rôle de l'utilisateur: Employee ou Superieurs, il a accès
    if (userRole! <= 3) {
      return true;
    }
    // Sinon, redirigez vers la page unauthorized
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
