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
export class AbsencesService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllAbsence(): Observable<any> {
    return this.http.get<any>(`${this.url}/absences`);
  }
  getAllTypeAbsences(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_absence`);
  }

  getAllEmployes(): Observable<any> {
   return this.http.get<any>(`${this.url}/employe`);
 }


  saveAbsence(data:any ): Observable<any> {
    return this.http.post(`${this.url}/absences`, data);
  }

  editAbsence(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/absences/${data.id}`, data);
  }

  deleteAbsence(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/absences/${data.id}`);
  }

}
