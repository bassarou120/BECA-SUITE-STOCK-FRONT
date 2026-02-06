import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class immoService {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend;
  constructor(private http: HttpClient) { }

  saveEntree(data: any): Observable<Object> {
    return this.http.post(`${this.url}/mouvement_stock`, data);
  }
  save(data: any): Observable<Object> {
    return this.http.post(`${this.url}/immobilisation`, data);
  }

  saveTransfert(data: any): Observable<Object> {
    return this.http.post(`${this.url}/transfert-immo`, data);
  }

  getAllTransfer(): Observable<any> {
    return this.http.get<any>(`${this.url}/transfert-immo`);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.url}/immobilisation`);
  }
  getAllStock(): Observable<any> {
    return this.http.get<any>(`${this.url}/stock`);
  }

  getLastTransfertByImmo(immoId: number): Observable<any> {
    return this.http.get(`${this.url}/transferts/last/${immoId}`);
  }

  deleteTransfertImmo(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/transfert-immo/${data.id}`);
  }



  edit(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/immo/${data.id}`, data);
  }

  editTransfert(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/transfert-immo/${data.id}`, data);
  }

  delete(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/immo/${data.id}`);
  }


  getSockByArticle(data: any): Observable<Object> {
    return this.http.post(`${this.url}/getSockByArticle`, data);
  }

  immoRapport(data: any): Observable<Object> {
    return this.http.post(`${this.url}/immo-rapport`, data);
  }

  getNextNumero(): Observable<{ nextNumero: number }> {
    return this.http.get<{ nextNumero: number }>(
      `${this.url}/immobilisations/next-numero`
    );
  }

  saveRepation(data: any): Observable<Object> {
    return this.http.post(`${this.url}/interventions`, data);
  }

  getAllReapartion(): Observable<any> {
    return this.http.get<any>(`${this.url}/interventions`);
  }

  editReparation(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/interventions/${data.id}`, data);
  }

  deleteRepartion(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/interventions/${data.id}`);
  }

  getByFamille(id: number): Observable<any> {
    return this.http.get(`${this.url}/immos/famille/${id}`);
  }





  // Rapport des immobilisations

// 1️⃣ Rapport général des immobilisations
  getRapportImmo(): Observable<any> {
    return this.http.get(`${this.url}/rapports/immos/data`);
  }

  exportPdfRapportImmo(): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/pdf`, { responseType: 'blob' });
  }

  // 2️⃣ Rapport des transferts
  getRapportTransfert(data: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/immos/transferts/data`, { params: data });
  }

  exportPdfRapportTransfert(data: any): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/transferts/pdf`, { params: data, responseType: 'blob' });
  }

  // 3️⃣ Rapport des interventions
  getRapportIntervention(data: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/immos/interventions/data`, { params: data });
  }

  exportPdfRapportIntervention(data: any): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/interventions/pdf`, { params: data, responseType: 'blob' });
  }

  // 4️⃣ Fiche d'inventaire
  getRapportInventaire(): Observable<any> {
    return this.http.get(`${this.url}/rapports/immos/inventaire/data`);
  }

  exportPdfInventaire(): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/inventaire/pdf`, { responseType: 'blob' });
  }

  // 5️⃣ Mise à disposition
  getRapportMiseADispo(data: any): Observable<any> {
    return this.http.get(`${this.url}/rapports/immos/mise-dispo/data`, { params: data });
  }

  exportPdfRapportMiseADispo(data: any): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/mise-dispo/pdf`, { params: data, responseType: 'blob' });
  }

  // 6️⃣ QR Code des immobilisations
  exportPdfQrCodeImmo(): Observable<Blob> {
    return this.http.get(`${this.url}/rapports/immos/qrcode/pdf`, { responseType: 'blob' });
  }


}
