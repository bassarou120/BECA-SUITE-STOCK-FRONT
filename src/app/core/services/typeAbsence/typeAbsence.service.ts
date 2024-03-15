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

  // saveDepartment(data:any ): Observable<Object> {
  //   return this.http.post(`${this.url}/departement`, data);
  // }

  getAllTypeAbsence(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_absence`);
  }


  // public getDepartment(): Observable<apiResultFormat> {
  //   return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
  //     map((res: apiResultFormat) => {
  //       return res;
  //     })
  //   );
  // }

}
