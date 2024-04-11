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
export class ExperiencesService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveExperience(data:any ): Observable<any> {
    return this.http.post(`${this.url}/employe_experiences`, data);
  }

  getAllExperience(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe_experiences`);
  }

  getAllEmployes(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
   }


  editExperience(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/employe_experiences/${data.id}`, data);
  }

  deleteExperience(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/employe_experiences/${data.id}`);
  }

}
