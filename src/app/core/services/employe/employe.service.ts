import { Injectable } from '@angular/core';

import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';

import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// @ts-ignore
@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  allAppliedCandidates!: Array<object>;
  public url: string = environment.backend;

  // token = this.authService.getToken();
  token = ')IJ';

  httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  updateEmploye(data: any, id: any): Observable<Object> {
    return this.http.post(`${this.url}/employeUpdate/${id}`, data);
  }

  saveEmploye(data: any): Observable<Object> {
    return this.http.post(`${this.url}/employe`, data);
  }

  updateInfoPerso(data: any, id: any): Observable<Object> {
    return this.http.put(`${this.url}/employe/updateInfoPerso/${id}`, data);
  }

  getAllEmploye(): Observable<any> {
    return this.http.get<any>(`${this.url}/employe`);
  }

  getEmploye(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/employe/${id}`);
  }

  saveContatEmploye(data: any): Observable<Object> {
    return this.http.post(`${this.url}/contrats`, data);
  }

  deleteEmploye(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/employe/${id}`);
  }

  getDepartementPoste() {
    return this.http.get<any>(`${this.url}/getDepartementPoste`);
  }

  getLastContrat() {
    return this.http.get<any>(`${this.url}/getLastContrat`);
  }

  getLastEmploye() {
    return this.http.get<any>(`${this.url}/getLastContrat`);
  }
  getLastContratByEmployeId(id: any) {
    return this.http.get<any>(`${this.url}/getLastContratByEmployeId/${id}`);
  }

  getGradeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/les_grades/${id}`);
  }

  getMonprofile(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/mon-profile/${id}`);
  }

  /*
  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  lstEmployee = [
    {
      firstname: 'John Doe',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Designer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 1,
      img: 'assets/img/profiles/avatar-02.jpg',
    },
    {
      firstname: 'Richard Miles',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 2,
      img: 'assets/img/profiles/avatar-09.jpg',
    },
    // {
    //   firstname: 'John Smith',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Android Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-05-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 3,
    //   img: "assets/img/profiles/avatar-10.jpg"
    // },
    // {
    //   firstname: 'Mike Litorus',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'IOS Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 4,
    //   img: "assets/img/profiles/avatar-05.jpg"
    // },
    // {
    //   firstname: 'Wilmer Deluna',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Team Leader',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 5,
    //   img: "assets/img/profiles/avatar-01.jpg"
    // },
    // {
    //   firstname: 'Jeffrey Warden',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Web  Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 6,
    //   img: "assets/img/profiles/avatar-12.jpg"
    // },
    // {
    //   firstname: 'Bernardo Galaviz',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Web  Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 7,
    //   img: "assets/img/profiles/avatar-13.jpg"
    // },
    // {
    //   firstname: 'Lesley Grauer',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Team Leader',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 8,
    //   img: "assets/img/profiles/avatar-16.jpg"
    // },
    // {
    //   firstname: 'Jeffery Lalor',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Team Leader',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 9,
    //   img: "assets/img/profiles/avatar-16.jpg"
    // },
    // {
    //   firstname: 'Loren Gatlin',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Android Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 10,
    //   img: "assets/img/profiles/avatar-04.jpg"
    // },
    // {
    //   firstname: 'Tarah Shropshire',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Android Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 11,
    //   img: "assets/img/profiles/avatar-03.jpg"
    // },
    // {
    //   firstname: 'Catherine Manseau',
    //   lastname: 'Manseau',
    //   username: 'Manseau',
    //   password: '123445',
    //   confirmpassword: '123456',
    //   department: 'software',
    //   designation: 'Android Developer',
    //   phone: '9842354254',
    //   email: 'catherine@example.com',
    //   mobile: '9876543210',
    //   joindate: '18-04-2013',
    //   role: 'Web Developer',
    //   employeeId: 'FT-0001',
    //   company: 'FT-0001',
    //   id: 12,
    //   img: "assets/img/profiles/avatar-08.jpg"
    // }
  ];

  */
}
