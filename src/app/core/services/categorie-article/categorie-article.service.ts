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
export class categorieArticleService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  save(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/categorie-article`, data);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/categorie-article`);
  }


  edit(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/categorie-article/${data.id}`, data);
  }

  delete(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/categorie-article/${data.id}`);
  }

}
