import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRole, getInfoDeBase, getMiniTemplateEmploye, getRole, getUsers, Param } from '../../core.index';
import { tap } from 'rxjs/operators';
//import { ExportsService, getAbsence, routes, AbsencesService, getTypeAbsence, getMiniTemplateEmploye } from 'src/app/core/core.index';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*   constructor(public router: Router, private http: HttpClient) {

      // Charger l'utilisateur depuis le localStorage au démarrage
      const storedUser = localStorage.getItem('userDataString'); // ✅ Utilisez la bonne clé
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error('Erreur lors du chargement de l\'utilisateur', e);
        }
      }

    } */
  constructor(public router: Router, private http: HttpClient) {
    // ✅ CRITIQUE : Charger depuis 'userDataString' et pas 'currentUser'
    const storedUser = localStorage.getItem('userDataString');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        console.log('✅ Utilisateur chargé:', user);
      } catch (e) {
        console.error('❌ Erreur chargement utilisateur:', e);
      }
    }
  }

  public url: string = environment.backend;

  private apiUrl = `${this.url}/auth`;
  private currentUserSubject = new BehaviorSubject<getUsers | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  /* =========================
     AUTH GUARD BASIQUE
     ========================= */
  canActivate(): boolean {
    const token = localStorage.getItem('LoginToken');
    //const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userDataString');

    if (!token || !userData) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  /* =========================
     LOGIN
     ========================= */

  login(data: any): Observable<any> {
    return this.http.post(`${this.url}/login`, data);
    //   this.http.post(`${this.url}/login`, data).pipe(
    //   tap((response: any) => {
    //     // On appelle ta fonction de sauvegarde ici
    //     this.saveLoginData(response);
    //   })
    // );
  }

  verifyOtp(data: any) {
    return this.http.post(
      `${this.url}/verify-otp1`,
      data
    );
  }

  /* saveLoginData(response: any): void {
    // Vérifie bien la structure de ta réponse (certains API n'ont pas le champ .data)
    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    //localStorage.setItem('role', JSON.stringify(user.role));
    // Mettre à jour le BehaviorSubject pour que l'app réagisse en temps réel
    this.currentUserSubject.next(user);
  } */

  saveLoginData(response: any): void {

    console.log(response)
    const token = response.data.token;
    const user = response.data.user;

    // Sauvegarder avec les bonnes clés
    localStorage.setItem('LoginToken', token);  // ✅ Correspond à canActivate()
    localStorage.setItem('LoginData', token);  // ✅ Correspond à canActivate()
    localStorage.setItem('userDataString', JSON.stringify(user));  // ✅ Correspond à canActivate()

    // Gardez aussi ces lignes si vous les utilisez ailleurs
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);
  }

  /* =========================
     RÔLE UTILISATEUR (ENUM)
     ========================= */
  get userRole(): UserRole | null {
    const userDataString = localStorage.getItem('userDataString');
    if (!userDataString) return null;

    try {
      const userData = JSON.parse(userDataString);
      const roleFromApi: string | undefined =
        userData?.role?.libelle_role;

      if (
        roleFromApi &&
        Object.values(UserRole).includes(roleFromApi as UserRole)
      ) {
        return roleFromApi as UserRole;
      }

      console.error('Rôle inconnu reçu du backend :', roleFromApi);
      return null;
    } catch (e) {
      console.error('Erreur parsing userDataString', e);
      return null;
    }
  }


  /* =========================
     ID DU RÔLE (OPTIONNEL)
     ========================= */
  get userRoleId(): number | null {
    const userDataString = localStorage.getItem('userDataString');
    if (!userDataString) return null;

    try {
      const userData = JSON.parse(userDataString);
      return userData?.role?.id ?? null;
    } catch (e) {
      console.error('Erreur parsing userDataString', e);
      return null;
    }
  }

  /* =========================
     VÉRIFICATION DES RÔLES
     ========================= */
  hasRole(roles: UserRole[]): boolean {
    const role = this.userRole;
    return role ? roles.includes(role) : false;
  }

  /* =========================
     LOGOUT
     ========================= */
  logout(): void {
    localStorage.removeItem('LoginToken');
    localStorage.removeItem('userDataString');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  registerUser(data: {
    employe_id: number;
    email: string;
    mot_de_passe: string;
  }): Observable<any> {
    return this.http.post(`${this.url}/register`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }

  updateUser(userId: string, payload: any) {
    return this.http.patch(`${this.url}/update/${userId}`, payload);
  }

  // Dans auth.service.ts
  updatePassword(payload: any): Observable<any> {
    return this.http.put(`${this.url}/change-password`, payload);
  }

  get userId(): number | null {
    return this.currentUser?.id || null;
  }

  get userName(): string | null {
    return this.currentUser?.name || null;
  }

  get currentUser(): getUsers | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  updateProfil(userId: string, payload: any): Observable<any> {
    // On utilise PATCH car on ne modifie qu'une partie de la ressource
    return this.http.patch(`${this.url}/update/${userId}`, payload);
  }

  updatePhoto(userId: any, photoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('photoDeProfile', photoFile);

    // Utilisez explicitement .post ici
    return this.http.post(`${this.url}/employe/updatePhoto/${userId}`, formData);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /*   getUser(): any {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : 'null';
    }  */

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }


  getRole(): any {
    const role = localStorage.getItem('role');
    return role ? JSON.parse(role) : null;
  }

  /*   logout(): void {
      localStorage.clear();
    }
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Ajoutez cette méthode dans votre AuthService existant

// Méthode pour obtenir l'ID utilisateur depuis localStorage
  getUserIdFromStorage(): string | null {
    const userDataString = localStorage.getItem('userDataString');
    if (!userDataString) return null;

    try {
      const userData = JSON.parse(userDataString);
      return userData?.id || null;
    } catch (e) {
      console.error('Erreur parsing userDataString', e);
      return null;
    }
  }

// Méthode pour obtenir le nom utilisateur depuis localStorage
  getUserNameFromStorage(): string | null {
    const userDataString = localStorage.getItem('userDataString');
    if (!userDataString) return null;

    try {
      const userData = JSON.parse(userDataString);
      return userData?.name || null;
    } catch (e) {
      console.error('Erreur parsing userDataString', e);
      return null;
    }
  }



}



// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   constructor(public router: Router, private http: HttpClient) {}
//
//   public url: string = environment.backend;
//
//   canActivate(): boolean {
//     // alert(localStorage.getItem('LoginData'));
//     if (
//       localStorage.getItem('LoginToken') === undefined ||
//       localStorage.getItem('LoginToken') == null
//     ) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
//
//   login(data: any): Observable<Object> {
//     return this.http.post(`${this.url}/login`, data);
//   }
//
//   get userRole(): number | null {
//     const userDataString = localStorage.getItem('userDataString');
//     if (userDataString) {
//       try {
//         const userData = JSON.parse(userDataString);
//
//         // VÉRIFIEZ CECI : Si le nouveau rôle_id doit remplacer l'ancien niveau.
//         // La nouvelle structure est : userData.role.id
//         // L'ancien était : userData.role.niveau
//         if (userData && userData.role && userData.role.id) {
//             return userData.role.id;
//         }
//
//         return null; // Retourne null si la structure n'est pas trouvée
//       } catch (e) {
//         console.error("Erreur de parsing de userDataString", e);
//         return null;
//       }
//     }
//     return null;
//   }
// }
