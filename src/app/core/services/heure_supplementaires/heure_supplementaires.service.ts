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
export class HeureSupplementaireService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveHeureSupplementaire(data:any ): Observable<any> {
    return this.http.post(`${this.url}/heure_supplementaires`, data);
  }

  getAllUserHeureSupplementaire(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/heure_supplementaires/${data}`);
  }

  getConnectedEmployeID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getemployeid/${data}`);
  }

  getAllHeureSupplementaire(): Observable<any> {
    return this.http.get<any>(`${this.url}/heure_supplementaires`);
  }

  getAllEmployes(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
  }

  editHeureSupplementaire(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/heure_supplementaires/${data.id}`, data);
  }

  deleteHeureSupplementaire(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/heure_supplementaires/${data.id}`);
  }

}
