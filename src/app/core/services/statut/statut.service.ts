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

export class StatutService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveStatut(data: any): Observable<any> {
    return this.http.post(`${this.url}/status`, data);
  }

  getAllStatuts(): Observable<any> {
    return this.http.get<any>(`${this.url}/status`);
  }

  editStatut(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/status/${data.id}`, data);
  }

  deleteStatut(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/status/${data.id}`);
  }








  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  listStatuts = [];
}
