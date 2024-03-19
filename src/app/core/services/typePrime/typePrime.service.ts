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

export class TypePrimeService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveTypePrime(data: any): Observable<any> {
    return this.http.post(`${this.url}/type_prime`, data);
  }

  getAllTypePrimes(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_prime`);
  }

  editTypePrime(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/type_prime/${data.id}`, data);
  }

  deleteTypePrime(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/type_prime/${data.id}`);
  }


  listTypePrimes = [];
}
