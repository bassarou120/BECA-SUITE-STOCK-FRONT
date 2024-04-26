import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class AttributionRoleService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllAttributionRole(): Observable<any> {
    return this.http.get<any>(`${this.url}/set_role`);
  }

  getAllRole(): Observable<any> {
    return this.http.get<any>(`${this.url}/role`);
  }

  editAttributionRole(data:any): Observable<any> {
    return this.http.post<any>(`${this.url}/set_roles`, data);
  }

}
