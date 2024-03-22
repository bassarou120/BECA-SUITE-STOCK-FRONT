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
export class CategorieService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveCategorie(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/categorie`, data);
  }

  getAllCategorie(): Observable<any> {
    return this.http.get<any>(`${this.url}/categorie`);
  }

  editCategorie(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/categorie/${data.id}`, data);
  }
  deleteCategorie(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/categorie/${data.id}`);
  }


}
