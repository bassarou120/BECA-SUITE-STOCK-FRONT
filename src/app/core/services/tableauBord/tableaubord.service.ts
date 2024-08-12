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
export class TableauBordService {
  allAppliedCandidates!: Array<object>;
  public url: string = environment.backend;

  // token = this.authService.getToken();
  token = ')IJ';

  httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getAllEmploye(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
  }

  getEmploye(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/employe/${id}`);
  }

  getDataTableauBord() {
    return this.http.get<any>(`${this.url}/getDataTableauBord`);
  }

  getDataTableauBordStock() {
    return this.http.get<any>(`${this.url}/getDataTableauBordStock`);
  }
}
