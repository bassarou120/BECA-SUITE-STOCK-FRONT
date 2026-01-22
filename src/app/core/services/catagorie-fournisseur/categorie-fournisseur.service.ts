import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategorieFournisseurService {
  // Récupération de l'URL de base depuis l'environnement (utilisant backend ou apiUrl selon votre config)
  private url: string = environment.backend;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer toutes les catégories
   * URL: GET /api/categorie-fournisseurs
   */
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/categorie-fournisseurs`);
  }

  /**
   * Enregistrer une nouvelle catégorie
   * URL: POST /api/categorie-fournisseurs
   * @param data { intitule: string }
   */
  save(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/categorie-fournisseurs`, data);
  }

  /**
   * Modifier une catégorie existante
   * URL: PUT /api/categorie-fournisseurs/{id}
   * @param data { id: number, intitule: string }
   */
  edit(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/categorie-fournisseurs/${data.id}`, data);
  }

  /**
   * Supprimer une catégorie
   * URL: DELETE /api/categorie-fournisseurs/{id}
   * @param id L'identifiant de la catégorie
   */
  delete(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/categorie-fournisseurs/${id}`);
  }
}