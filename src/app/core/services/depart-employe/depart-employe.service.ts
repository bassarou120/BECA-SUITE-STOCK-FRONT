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
export class DepartEmployeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveDepartEmploye(data:any ): Observable<any> {
    return this.http.post(`${this.url}/les_departs`, data);
  }

  getAllPreavis(): Observable<any> {
    return this.http.get<any>(`${this.url}/preavis`);
  }

  getAllDepartEmploye(): Observable<any> {
    return this.http.get<any>(`${this.url}/les_departs`);
  }

  getAllEmployes(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
  }

  getAllTypeLicenciement(): Observable<any> {
    return this.http.get<any>(`${this.url}/Type_Licenciement`);
  }

  getAllTypeDepart(): Observable<any> {
    return this.http.get<any>(`${this.url}/Type_depart`);
  }

  editDepartEmploye(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/les_departs/${data.id}`, data);
  }

  deleteDepartEmploye(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/les_departs/${data.id}`);
  }

}
