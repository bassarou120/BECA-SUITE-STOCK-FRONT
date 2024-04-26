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
export class MesContratsService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllMesContrats(): Observable<any> {
    return this.http.get<any>(`${this.url}//contrats/{user_id}/mes_contrats`);
  }

  getConnectedEmployeID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getemployeid/${data}`);
  }

}
