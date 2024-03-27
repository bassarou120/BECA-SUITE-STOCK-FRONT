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
export class DemandeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllUserDemandes(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/demande/${data}`);
  }

  getConnectedEmployeID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getemployeid/${data}`);
  }

  getAllTypeAbsences(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_absence`);
  }

  getAllTypeConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge`);
  }

  getAllEmployes(): Observable<any> {
   return this.http.get<any>(`${this.url}/employe`);
 }


  saveDemande(data:any ): Observable<any> {
    return this.http.post(`${this.url}/demandes`, data);
  }

  editDemande(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/demandes/${data.id}`, data);
  }

  deleteDemande(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/demandes/${data.id}/${data.type_demande}`);
  }

}
