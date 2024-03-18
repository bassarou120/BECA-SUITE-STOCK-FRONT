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

export class HolidayService  {
  allAppliedCandidates!: Array<object>;
  url: string = environment.backend ;
  constructor(private http: HttpClient) {}

  saveHoliday(data: any): Observable<any> {
    return this.http.post(`${this.url}/type_conge`, data);
  }

  getAllHolidays(): Observable<any> {
    return this.http.get<any>(`${this.url}/type_conge`);
  }

  editHoliday(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/type_conge/${data.id}`, data);
  }

  deleteHoliday(data: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/type_conge/${data.id}`);
  }








  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  listHolidays = [];
}
