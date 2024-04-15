import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TypeContratService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend;
  constructor(private http: HttpClient) {}

  saveTypeContrat(data: any): Observable<any> {
    return this.http.post(`${this.url}/type_contrat`, data);
  }

  getAllTypeContrat(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_contrat`);
  }

  editTypeContrat(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/type_contrat/${data.id}`, data);
  }

  deleteTypeContrat(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/type_contrat/${data.id}`);
  }

  listConstracts = [];
}
