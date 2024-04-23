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
export class HeureSupplementaireService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}


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

  saveHeureSupplementaire(data:any ): Observable<any> {
    return this.http.post(`${this.url}/heure_supplementaires`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur s\'est produite lors de la communication avec le serveur.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        // alert(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

}
