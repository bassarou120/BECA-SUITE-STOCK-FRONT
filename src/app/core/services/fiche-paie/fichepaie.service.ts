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
export class FichepaieService {
  allAppliedCandidates!: Array<object>;
  public url: string = environment.backend;

  // token = this.authService.getToken();
  token = '';

  httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  initgetEmployeForFichepaie() {
    return this.http.get(`${this.url}/fiche_paies/getEmpNeedFichePay`);
  }

  saveFichePaieEmploye(data: any): Observable<Object> {
    return this.http.post(`${this.url}/fiche_paie`, data);
  }

  calculeheureSup(data: any): Observable<Object> {
    return this.http.post(`${this.url}/fiche_paies/calculeheureSup`, data);
  }


  validerFicheEmploye(id: any, data: any): Observable<Object> {
    return this.http.post(`${this.url}/fiche_paies/valider/${id}`, data);
  }

  getOrdreVirement(data: any): Observable<Object> {
    return this.http.post(`${this.url}/getOrdreVirement`, data);
  }

  getFichepaie(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/fiche_paie/${id}`);
  }

  exportFichepaie(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/fiche_paies/export/${id}`);
  }

  deleteEmploye(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/employe/${id}`);
  }

  getDepartementPoste() {
    return this.http.get<any>(`${this.url}/getDepartementPoste`);
  }

  getLastContrat() {
    return this.http.get<any>(`${this.url}/getLastContrat`);
  }
  getLastContratByEmployeId(id: any) {
    return this.http.get<any>(`${this.url}/getLastContratByEmployeId/${id}`);
  }
}
