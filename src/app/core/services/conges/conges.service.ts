import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, throwError, catchError  } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class CongeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllConge(): Observable<any> {
    return this.http.get<any>(`${this.url}/conges`);
  }

  getAllTypeConges(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge`);
  }

  getAllEmployes(): Observable<any> {
   return this.http.get<any>(`${this.url}/employe`);
 }
 getAllStatuts(): Observable<any> {
  return this.http.get<any>(`${this.url}/status`);
}


editConge(data:any): Observable<any> {
  return this.http.put<any>(`${this.url}/conges/${data.id}`, data);
}

deleteConge(data:any): Observable<any> {
  return this.http.delete<any>(`${this.url}/conges/${data.id}`);
}

  saveConge(data:any ): Observable<any> {
    return this.http.post(`${this.url}/conges`, data).pipe(
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
