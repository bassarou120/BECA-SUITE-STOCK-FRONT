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
export class TypeDepartService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveTypeDepart(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/Type_depart`, data);
  }

  getAllTypeDepart(): Observable<any> {
    return this.http.get<any>(`${this.url}/Type_depart`);
  }

  editTypeDepart(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/Type_depart/${data.id}`, data);
  }
  deleteTypeDepart(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/Type_depart/${data.id}`);
  }


}
