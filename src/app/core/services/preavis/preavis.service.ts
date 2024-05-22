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
export class PreavisService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllPreavis(): Observable<any> {
    return this.http.get<any>(`${this.url}/preavis`);
  }

  getAllUserPreavis(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/preavis/${data}`);
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


  savePreavis(data:any ): Observable<any> {
    return this.http.post(`${this.url}/preavis`, data);
  }

  editPreavis(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/preavis/${data.id}`, data);
  }

  deletePreavis(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/preavis/${data.id}`);
  }

}
