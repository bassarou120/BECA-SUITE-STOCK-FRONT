import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class entreeSortieStockService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend;

  constructor(private http: HttpClient) {}

  /**
   * Enregistre une entrée (peut être un FormData pour plusieurs articles avec fichier)
   */
  saveEntree(data: any): Observable<Object> {
    return this.http.post(`${this.url}/mouvement_stock`, data);
  }

  save(data: any): Observable<Object> {
    return this.http.post(`${this.url}/article`, data);
  }

  getNextReferenceEntree() {
  return this.http.get<any>(`${this.url}/mouvements/entree/next-reference`);
}


  /**
   * Récupère la liste groupée des mouvements
   */
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/mouvement_stock`);
  }

  /**
   * Récupère les détails d'une référence spécifique (Nouveauté)
   * @param reference La référence de la facture ou du BL
   */
  getDétailsParRéférence(reference: string): Observable<any> {
    return this.http.get<any>(`${this.url}/mouvement_stock/details/${reference}`);
  }

  getAllStock(): Observable<any> {
    return this.http.get(`${this.url}/get-etat-stock`);
  }

  /**
 * Modifie un mouvement (supporte FormData pour les fichiers)
 */
  edit(data: FormData): Observable<any> {
    const id = data.get('id'); // L'ID doit être présent dans le FormData
    // On utilise POST car on a ajouté _method: PUT dans le FormData côté composant
    return this.http.post<any>(`${this.url}/mouvements/entrees/${id}`, data);
  }

  /**
  * Supprime un mouvement
  * @param id L'identifiant numérique directement
  */
  delete(id: any): Observable<any> {
    // Si l'ID arrive en tant qu'objet {id: 25}, on extrait la valeur
    const numericId = typeof id === 'object' ? id.id : id;
    return this.http.delete<any>(`${this.url}/mouvements/entrees/${numericId}`);
  }

  getStockByArticle(data: any): Observable<Object> {
    return this.http.post(`${this.url}/getStockByArticle`, data);
  }

  /**
   * Récupère les données du rapport d'entrées (JSON)
   */
  getRapportEntreesData(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get<any>(`${this.url}/rapports/entrees/data`, { params });
  }

  /**
   * Génère l'URL pour le téléchargement du PDF des entrées
   */
  exportPdfEntrees(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get<any>(`${this.url}/rapports/entrees/pdf`, { params });
  }

  /**
   * Récupère les données de l'état du stock actuel (JSON)
   */
  getRapportEtatStockData(): Observable<any> {
    return this.http.get<any>(`${this.url}/rapports/etat-stock/data`);
  }

  /**
   * Génère l'URL pour le téléchargement du PDF de l'état du stock
   */
  exportPdfEtatStock(): Observable<any> {
    return this.http.get<any>(`${this.url}/rapports/etat-stock/pdf`);
  }

  // --- NOUVELLES MÉTHODES (Sorties & Rapports Sorties) ---

  /**
   * Enregistrer une sortie de stock
   */
  saveSortie(data: any): Observable<any> {
    return this.http.post(`${this.url}/mouvement_stock/sortie`, data);
  }

  getNextReferenceSortie() {
  return this.http.get<any>(`${this.url}/mouvements/sortie/next-reference`);
}

exportPdfSortie(reference: string): Observable<Blob> {
  return this.http.get(
    `${this.url}/sorties/pdf/${reference}`,
    { responseType: 'blob' }
  );
}


  /**
   * Récupérer la liste des sorties
   */
  getAllSorties(): Observable<any> {
    return this.http.get<any>(`${this.url}/mouvement_stock/sortie`);
  }

  /**
   * Supprimer/Annuler une sortie
   */
  deleteSortie(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/mouvement_stock/sortie/${id}`);
  }

  /**
   * Supprimer TOUT un bon de sortie par sa référence
   */
  deleteSortieByRef(reference: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/mouvement_stock/sortie/reference/${reference}`);
  }

  /**
   * Récupérer les détails d'un bon de sortie par sa référence
   */
  getDetailsSortie(reference: string): Observable<any> {
    return this.http.get<any>(`${this.url}/mouvement_stock/sortie/details/${reference}`);
  }

  /**
   * Récupère les données du rapport de sorties (JSON)
   * Utilisé pour l'affichage dans le tableau avant export
   */
  getRapportSortiesData(params: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/sorties/data`, { params });
}
  getRapportTotalFamilleData(params: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/total-famille/data`, { params });
}

  /**
   * Génère l'URL pour le téléchargement du PDF des sorties
   */
  // Lancer la génération du PDF côté serveur
  exportPdfSorties(params: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/sorties/pdf`, { params });
  }
  exportPdfTotalFamille(params: any): Observable<Blob> {
  return this.http.get(
    `${this.url}/rapports/total-famille/pdf`,
    {
      params,
      responseType: 'blob'
    }
  );
}


  /**
   * Récupère les données consolidées du stock par famille (JSON)
   */
  getRapportEtatConsolideData(): Observable<any> {
    return this.http.get<any>(`${this.url}/rapports/etat-stock-consolide/data`);
  }

  exportPdfEtatConsolide(): Observable<any> {
    // L'ajout de responseType: 'blob' empêche l'erreur de parsing JSON (status 200 ok: false)
    return this.http.get(`${this.url}/rapports/etat-stock-consolide/pdf`, {
      responseType: 'blob'
    });
  }

  getRapportAchatsData(params: any): Observable<any> {
    return this.http.post(`${this.url}/rapports/rapport-achats-data`, params);
  }

  // 2. Exportation du PDF (BLOB)
  exportPdfAchatsParArticle(params: any): Observable<Blob> {
    return this.http.post(`${this.url}/rapports/export-pdf-achats`, params, {
      responseType: 'blob'
    });
  }

  /**
   * Récupère les données de consommation moyenne (Passage en GET suite à erreur 405)
   */
  getConsommationMoyenneData(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get<any>(`${this.url}/rapports/consommations-moyennes-data`, { params });
  }

  /**
   * Exportation du PDF de consommation moyenne (Passage en GET si le backend suit la même logique)
   */
  exportPdfConsommationMoyenne(filters: any): Observable<Blob> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get(`${this.url}/rapports/export-pdf-consommation`, {
      params,
      responseType: 'blob'
    });
  }

  /** Récupère les données de Total par article*/
  getTotalSortiesParArticleData(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get<any>(`${this.url}/rapports/sorties-par-article-data`, { params });
  }

  /** Exportation du PDF de Total par article */
  exportPdfTotalSortiesParArticle(filters: any): Observable<Blob> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get(`${this.url}/rapports/export-pdf-total-sorties`, {
      params,
      responseType: 'blob'
    });
  }

  getConsommationParCentreData(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get<any>(`${this.url}/rapports/consommations-parcentre-data`, { params });
  }

  exportPdfConsommationParCentre(filters: any): Observable<Blob> {
    let params = new HttpParams()
      .set('date_debut', filters.date_debut)
      .set('date_fin', filters.date_fin);

    return this.http.get(`${this.url}/rapports/export-pdf-consommation-parcentre`, {
      params,
      responseType: 'blob'
    });
  }



}
