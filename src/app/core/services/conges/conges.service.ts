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
export class CongeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllConge(): Observable<any> {
    return this.http.get<any>(`${this.url}/conges`);
  }

  getTypeCongeWithID(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge/${id}`);
  }

  getEmployeWithID(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/employe/${id}`);
  }

  getAllTypeConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge`);
  }

  getAllEmployes(): Observable<any> {
   return this.http.get<any>(`${this.url}/employe`);
 }


  saveConge(data:any ): Observable<any> {
    return this.http.post(`${this.url}/conges`, data);
  }

  editConge(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/conges/${data.id}`, data);
  }

  deleteConge(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/conges/${data.id}`);
  }

}
