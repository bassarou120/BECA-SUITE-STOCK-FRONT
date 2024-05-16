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

  exportAttributionRoles(): Observable<any> {
    return this.http.get<any>(`${this.url}/exports/attr_roles`);
  }
}
