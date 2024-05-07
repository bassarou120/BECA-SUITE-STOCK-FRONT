import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, catchError, throwError } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class MonprofileService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  // getAllMesContrats(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.url}/contrats/mes_contrats/${id}`);
  // }

  getConnectedEmployeID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/getemployeid/${data}`);
  }

  getConnectedEmployeWithID(data: any): Observable<any> {
    return this.http.get<any>(`${this.url}/employe/${data}`);
  }

  saveMotdepasse(data: any): Observable<Object> {
    return this.http.post(`${this.url}/modifier_mot_de_passe`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur s\'est produite lors de la communication avec le serveur.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(errorMessage);
      })
    );
  }
}
