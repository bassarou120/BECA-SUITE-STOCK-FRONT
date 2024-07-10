import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, throwError  } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../environments/environment";

import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class passwordMailService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  savePasswordMail(data: any): Observable<any> {
    return this.http.post(`${this.url}/modifier_mot_de_passe_par_mail`, data)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  savePasswordMail2(data: any): Observable<any> {
    return this.http.post(`${this.url}/reset-password`, data)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

}
