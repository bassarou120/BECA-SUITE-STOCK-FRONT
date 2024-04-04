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

export class InfosDeBaseService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveInfoDeBase(data: any): Observable<any> {
    return this.http.post(`${this.url}/parametres`, data);
  }

  getAllInfoDeBases(): Observable<any> {
    return this.http.get<any>(`${this.url}/parametres`);
  }

  editInfoDeBase(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/parametres/${data.id}`, data);
  }

  deleteInfoDeBase(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/parametres/${data.id}`);
  }








  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  listInfoDeBases = [];
}
