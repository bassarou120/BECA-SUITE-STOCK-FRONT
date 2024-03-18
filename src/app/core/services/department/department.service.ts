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
export class DepartmentService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveDepartement(data:any ): Observable<any> {
    return this.http.post(`${this.url}/departement`, data);
  }

  getAllDepartment(): Observable<any> {
    return this.http.get<any>(`${this.url}/departement`);
  }

  editDepartment(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/departement/${data.id}`, data);
  }

  deleteDepartment(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/departement/${data.id}`);
  }

}
