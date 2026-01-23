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
export class fournisseurService {
  
  // URL de base pointant vers la nouvelle ressource API
  private url: string = `${environment.backend}/fournisseurs-stock`;

  constructor(private http: HttpClient) {}

  /**
   * Créer un nouveau fournisseur
   * @param data { code, intitule, categorie_fournisseur_id }
   */
  save(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  /**
   * Récupérer la liste de tous les fournisseurs
   */
  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  /**
   * Mettre à jour un fournisseur existant
   * @param data l'objet contenant l'id et les champs à modifier
   */
  edit(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${data.id}`, data);
  }

  /**
   * Supprimer un fournisseur
   * @param id l'identifiant du fournisseur
   */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  /**
   * Optionnel: Récupérer un seul fournisseur par son ID
   */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}