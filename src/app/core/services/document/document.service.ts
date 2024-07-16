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

export class DocumentService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveDocument(data: any): Observable<any> {
    return this.http.post(`${this.url}/documents`, data);
  }

  getEmploye(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/employe/${id}`);
  }

  getAllUserDocuments(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/documents/${data}`);
  }

  deleteDocument(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/documents/${data.id}`);
  }

}
