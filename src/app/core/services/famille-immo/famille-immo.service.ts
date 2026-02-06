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
export class FamilleImmoService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  save(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/famille-immo`, data);
  }

  update(data:any): Observable<any> {
    console.log("log sur data", data);

    return this.http.put(`${this.url}/famille-immo/${data.id}`, data);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/famille-immo`);
  }


  edit(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/famille-immo/${data.id}`, data);
  }

  delete(data: any): Observable<any> {
    const deleteUrl = `${this.url}/famille-immo/${data.id}`;
    console.log("URL de suppression:", deleteUrl);
    return this.http.delete<any>(deleteUrl);
  }

}
