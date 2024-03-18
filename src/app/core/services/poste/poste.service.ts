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
export class posteService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  savePoste(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/postes`, data);
  }

  getAllPoste(): Observable<any> {
    return this.http.get<any>(`${this.url}/postes`);
  }


  editPoste(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/postes/${data.id}`, data);
  }

  deletePoste(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/postes/${data.id}`);
  }

}
