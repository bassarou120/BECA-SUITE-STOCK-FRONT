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
export class typeAbsenceService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveTypeAbsence(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/type_absence`, data);
  }

  getAllTypeAbsence(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_absence`);
  }


  editTypeAbsence(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/type_absence/${data.id}`, data);
  }

  deleteTypeAbsence(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/type_absence/${data.id}`);
  }

}
