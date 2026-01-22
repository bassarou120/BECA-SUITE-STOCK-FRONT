import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public router: Router, private http: HttpClient) {}

  public url: string = environment.backend;

  canActivate(): boolean {
    // alert(localStorage.getItem('LoginData'));
    if (
      localStorage.getItem('LoginToken') === undefined ||
      localStorage.getItem('LoginToken') == null
    ) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  login(data: any): Observable<Object> {
    return this.http.post(`${this.url}/login`, data);
  }

  get userRole(): number | null {
    const userDataString = localStorage.getItem('userDataString');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        // VÉRIFIEZ CECI : Si le nouveau rôle_id doit remplacer l'ancien niveau.
        // La nouvelle structure est : userData.role.id
        // L'ancien était : userData.role.niveau
        if (userData && userData.role && userData.role.id) {
            return userData.role.id;
        }

        return null; // Retourne null si la structure n'est pas trouvée
      } catch (e) {
        console.error("Erreur de parsing de userDataString", e);
        return null;
      }
    }
    return null;
  }
}
