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
export class immoService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveEntree(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/mouvement_stock`, data);
  }
  save(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/immo`, data);
  }

  saveTransfert(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/transfert-immo`, data);
  }

  getAllTransfer(): Observable<any> {
    return this.http.get<any>(`${this.url}/transfert-immo`);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/immo`);
  }
  getAllStock(): Observable<any> {
    return this.http.get<any>(`${this.url}/stock`);
  }



  edit(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/immo/${data.id}`, data);
  }

  delete(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/immo/${data.id}`);
  }


  getSockByArticle(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/getSockByArticle`, data);
  }

  immoRapport(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/immo-rapport`, data);
  }



  saveRepation(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/reparation`, data);
  }

  getAllReapartion(): Observable<any> {
    return this.http.get<any>(`${this.url}/reparation`);
  }

  editReparation(data:any): Observable<any> {
    return this.http.put<any>(`${this.url}/reparation/${data.id}`, data);
  }

  deleteRepartion(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/reparation/${data.id}`);
  }




}
