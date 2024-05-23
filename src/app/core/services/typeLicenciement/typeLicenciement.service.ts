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

export class TypeLicenciementService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveTypeLicenciement(data: any): Observable<any> {
    return this.http.post(`${this.url}/Type_Licenciement`, data);
  }

  getAllTypeLicenciement(): Observable<any> {
    return this.http.get<any>(`${this.url}/Type_Licenciement`);
  }

  editTypeLicenciement(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/Type_Licenciement/${data.id}`, data);
  }

  deleteTypeLicenciement(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/Type_Licenciement/${data.id}`);
  }


  listTypeLicenciemment = [];
}
