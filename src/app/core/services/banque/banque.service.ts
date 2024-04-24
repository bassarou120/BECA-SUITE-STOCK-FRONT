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
export class banqueService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveBanque(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/banques`, data);
  }

  getAllBanque(): Observable<any> {
    return this.http.get<any>(`${this.url}/banques`);
  }


  editBanque(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/banques/${data.id}`, data);
  }

  deleteBanque(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/banques/${data.id}`);
  }

}
