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
export class MouvementService {
  allAppliedCandidates!: Array<object>;
  public url: string = environment.backend;

  // token = this.authService.getToken();
  token = ')IJ';

  httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  saveMouvement(data: any): Observable<Object> {
    return this.http.post(`${this.url}/mouvement`, data);
  }

  getMouvementByEmploye(data: any): Observable<Object> {
    return this.http.post(`${this.url}/mouvement/getMouvementByEmploye`, data);
  }

  updateEmploye(data: any, id: any): Observable<Object> {
    return this.http.post(`${this.url}/employeUpdate/${id}`, data);
  }

  updateInfoPerso(data: any, id: any): Observable<Object> {
    return this.http.put(`${this.url}/employe/updateInfoPerso/${id}`, data);
  }

  getAllEmploye(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
  }
}
