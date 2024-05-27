import { Injectable } from '@angular/core';

import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';

import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// @ts-ignore
@Injectable({
  providedIn: 'root',
})
export class ExportsService {
  allAppliedCandidates!: Array<object>;
  public url: string = environment.backend;

  // token = this.authService.getToken();
  token = '';

  httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  exportMesContrats(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/mes_contrats/${user_id}`);
  }

  exportMesDemandes(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/mes_demandes/${user_id}`);
  }

  exportMesHeuresSupp(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/mes_heures_supp/${user_id}`);
  }

  exportMesPlaintes(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/mes_plaintes/${user_id}`);
  }



  exportHeuresSupp(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/heures_supp`);
  }

  exportAbsences(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/absences`);
  }

  exportConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/conges`);
  }

  exportExperiences(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/experience`);
  }

  exportPlaintes(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/plaintes`);
  }

  exportFormations(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/formations`);
  }

  exportDepartEmploye(type: string): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/depart_employes/${type}`);
  }



  exportPointConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/point_conges`);
  }

  exportPointCongeDetails(id_employe: number): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/point_conges_details/${id_employe}`);
  }

  exportPointContrat(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/point_contrat`);
  }



  exportAttributionRoles(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/attr_roles`);
  }

  exportBanques(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/banques`);
  }

  exportCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/categories`);
  }

  exportClasses(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/classes`);
  }

  exportDepartements(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/departements`);
  }

  exportPostes(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/postes`);
  }

  exportTypesAbsence(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/types_absence`);
  }

  exportTypesConge(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/types_conge`);
  }

  exportTypesContrat(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/types_contrat`);
  }

  exportTypesDepart(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/types_depart`);
  }

  exportTypesPrime(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/types_prime`);
  }

  exportRoles(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/roles`);
  }
}
