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
export class entreeSortieStockService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveEntree(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/mouvement_stock`, data);
  }
  save(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/article`, data);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/mouvement_stock`);
  }


  edit(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/mouvement_stock/${data.id}`, data);
  }

  delete(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/mouvement_stock/${data.id}`);
  }

}
