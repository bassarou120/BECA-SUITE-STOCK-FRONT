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
  // getAllStock(): Observable<any> {
  //   return this.http.get<any>(`${this.url}/stock`);
  // }

  getAllStock(): Observable<any> {
    return this.http.get(`${this.url}/get-etat-stock`); 
  }


  edit(data: FormData): Observable<any> {
    // On récupère l'ID depuis le FormData (car data n'est plus un objet simple)
    const id = data.get('id'); 
    
    // On utilise POST au lieu de PUT pour supporter les fichiers
    // Laravel comprendra que c'est un PUT grâce au champ '_method' que nous avons ajouté dans le composant
    return this.http.post<any>(`${this.url}/mouvement_stock/${id}`, data);
  }

  delete(data:any): Observable<any> {
    return this.http.delete<any>(`${this.url}/mouvement_stock/${data.id}`);
  }


  getSockByArticle(data:any ): Observable<Object> {
    return this.http.post(`${this.url}/getSockByArticle`, data);
  }
}
