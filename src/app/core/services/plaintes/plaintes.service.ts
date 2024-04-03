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
export class PlaintesService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllPlainte(): Observable<any> {
    return this.http.get<any>(`${this.url}/plaintes`);
  }

  getAllUserPlainte(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/plainte/${data}`);
  }

  getConnectedEmployeID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getemployeid/${data}`);
  }

  getAllEmployes(): Observable<any> {
   return this.http.get<any>(`${this.url}/employe`);
  }

  getAllStatuts(): Observable<any> {
    return this.http.get<any>(`${this.url}/status`);
  }


  savePlainte(data:any ): Observable<any> {
    return this.http.post(`${this.url}/plaintes`, data);
  }

  editPlainte(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/plaintes/${data.id}`, data);
  }

  deletePlainte(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/plaintes/${data.id}`);
  }

}
