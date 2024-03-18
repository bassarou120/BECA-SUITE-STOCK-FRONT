import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';


import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
  constructor(private http: HttpClient ) {}

  saveEmploye(data: any): Observable<Object> {
    return this.http.post('http://127.0.0.1:8001/api/employe', data);
  }

  getAllEmploye(): Observable<Object> {
    // return this.http.get();
    let a=this.http.get('http://127.0.0.1:80001/api/employe');
    console.log(a)
    return this.http.get('http://127.0.0.1:80001/api/employe');
    // return this.http.get<any>(`${this.url}/departement`);
  }


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
}
