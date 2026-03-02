import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../../core.index';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;

    // Seul Super Admin a accès
    if (userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ML) {
      return true;
    }
    this.router.navigate(['/dashboard/admin']);
    return false;
  }

  /*   canActivate(): boolean {
      return this.authService.canActivate();
    } */

}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.userRole;

    // Admin ou Supérieur (Super Admin)
    if ([UserRole.SUPER_ADMIN, UserRole.ML].includes(userRole!)) {
      return true;
    }

    this.router.navigate(['/dashboard/admin']);
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

    // GRH + Admin + SuperAdmin
    if ([UserRole.SUPER_ADMIN, UserRole.ML].includes(userRole!)) {
      return true;
    }

    this.router.navigate(['/dashboard/admin']);
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

    // Tout le monde sauf rôles inconnus
    if ([UserRole.SUPER_ADMIN, UserRole.ML].includes(userRole!)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: UserRole[] = route.data['roles'];
    const userRole = this.authService.userRole;

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}



// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.service';
//
//
// @Injectable({
//   providedIn: 'root',
// })
// export class SuperAdminGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   canActivate(): boolean {
//     const userRole = this.authService.userRole;
//     // Si le rôle de l'utilisateur est: SuperAdmin, il a accès
//     if (userRole! <= 1) {
//       return true;
//     }
//     // Sinon, redirigez vers la page unauthorized
//     this.router.navigate(['/dashboard/employee']);
//     return false;
//   }
// }
//
// @Injectable({
//   providedIn: 'root',
// })
// export class AdminGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   canActivate(): boolean {
//     const userRole = this.authService.userRole;
//     // Si le rôle de l'utilisateur est: Admin ou Supérieur, il a accès
//     if (userRole! <= 2) {
//       return true;
//     }
//     // Sinon, redirigez vers la page unauthorized
//     this.router.navigate(['/dashboard/employee']);
//     return false;
//   }
// }
//
// @Injectable({
//   providedIn: 'root',
// })
// export class GRHGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   canActivate(): boolean {
//     const userRole = this.authService.userRole;
//     // Si le rôle de l'utilisateur est: GRH ou Supérieur, il a accès
//     if (userRole! <= 3) {
//       return true;
//     }
//     // Sinon, redirigez vers la page unauthorized
//     this.router.navigate(['/login']);
//     return false;
//   }
// }
//
// @Injectable({
//   providedIn: 'root',
// })
// export class EmployeGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   canActivate(): boolean {
//     const userRole = this.authService.userRole;
//     // Si le rôle de l'utilisateur: Employee ou Superieurs, il a accès
//     if (userRole! <= 4) {
//       return true;
//     }
//     // Sinon, redirigez vers la page unauthorized
//     this.router.navigate(['/unauthorized']);
//     return false;
//   }
// }
//
