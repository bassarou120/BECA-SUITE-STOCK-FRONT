import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map,  throwError, catchError } from 'rxjs';
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
export class GradeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  getAllGrades(): Observable<any> {
    return this.http.get<any>(`${this.url}/les_grades`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/categorie`);
  }

  getAllClasses(): Observable<any> {
   return this.http.get<any>(`${this.url}/classes`);
 }


  saveGrade(data:any ): Observable<any> {
    return this.http.post(`${this.url}/les_grades`, data).pipe(
      catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  editGrade(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/les_grades/${data.id}`, data);
  }

  deleteGrade(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/les_grades/${data.id}`).pipe(
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
