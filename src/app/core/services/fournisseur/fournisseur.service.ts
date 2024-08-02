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
export class fournisseurService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  save(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/fournisseur`, data);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/fournisseur`);
  }


  edit(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/fournisseur/${data.id}`, data);
  }

  delete(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/fournisseur/${data.id}`);
  }

}
