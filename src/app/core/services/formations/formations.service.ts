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
export class FormationsService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveFormation(data:any ): Observable<any> {
    return this.http.post(`${this.url}/employe_education`, data);
  }

  getAllFormation(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe_education`);
  }

  getAllEmployes(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
   }


  editFormation(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/employe_education/${data.id}`, data);
  }

  deleteFormation(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/employe_education/${data.id}`);
  }

}
