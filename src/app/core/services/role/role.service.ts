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
export class roleService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveRole(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/role`, data);
  }

  getAllRole(): Observable<any> {
    return this.http.get<any>(`${this.url}/role`);
  }


  editRole(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/role/${data.id}`, data);
  }

  deleteRole(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/role/${data.id}`);
  }

}
