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

export class TypeCongeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveTypeConge(data: any): Observable<any> {
    return this.http.post(`${this.url}/type_conge`, data);
  }

  getAllTypeConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge`);
  }

  editTypeConge(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/type_conge/${data.id}`, data);
  }

  deleteTypeConge(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/type_conge/${data.id}`);
  }








  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  listTypeConges = [];
}
