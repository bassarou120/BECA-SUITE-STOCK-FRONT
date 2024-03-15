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

//   saveEmploye(data:any ): Observable<Object> {
//     return this.http.post("http://127.0.0.1:8001/api/employe", data);
//   }

  getAllHolidays(): Observable<any> {

     // return this.http.get("http://127.0.0.1:8000/api/employe");
    return this.http.get<any>(`${this.url}/type_conge`);
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
