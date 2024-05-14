import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getEmployees, routes, lstEmployee } from 'src/app/core/core.index';
import { EmployeService } from 'src/app/core/services/employe/employe.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.scss'],
})
export class EmployeListComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  // public lstEmployee: Array<lstEmployee>;
  public lstEmployee: Array<any> = [];


  // public lstEmployee: Array<getEmployees> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getEmployees>;
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables

  public deleteEmployeForm!: FormGroup;
  public recherceheEmployeForm!: FormGroup;

  public editEmployeeForm!: FormGroup;
  duree: any;
  employeForEdit: any;

  constructor(
    private data: DataService,
    private formBuilder: FormBuilder,
    private employeservice: EmployeService
  ) {}

  ngOnInit(): void {
    // this.getTableData();
    this.getEnmpl();
    this.getDataForListe();
    this.deleteEmployeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });

    this.recherceheEmployeForm = this.formBuilder.group({
      matricule: ['', []],
      poste: ['', []],
      nom: ['', []],
    });

    this.editEmployeeForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      // username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      // password: ['123456', [Validators.required]],
      // c_password: ['123456', [Validators.required]],
      departement_id: ['', [Validators.required]],
      poste_id: ['', [Validators.required]],

      telephone: ['', [Validators.required]],
      date_arrivee: ['', [Validators.required]],

      // matricule: ['', []],
      rib: ['', []],
      sexe: ['', []],
      affiliation: ['', []],
      titre: ['', []],
      anciennete: ['', []],
      grade_id: ['', []],

      date_naisance: ['', []],
      lieu_naisance: ['', []],
      address: ['', []],

      // EmployeeID: ["", [Validators.required]],
    });
  }

  getEnmpl() {
    this.employeservice.getAllEmploye().subscribe((data: any) => {
      console.log(data['data']['data']);
      this.lstEmployee = data['data'];
    });
  }

  onClickSubmitRechercheEmployee() {
    alert(JSON.stringify(this.recherceheEmployeForm.value));

    this.employeservice
      .getRechercheEmploye(this.recherceheEmployeForm.value)
      .subscribe((data: any) => {
        // alert(JSON.stringify(data));
        console.log(data['data']);
        // this.lstEmployee = data['data'];
      });
  }

  initEdditEploye(id: any) {
    this.getDataForListe();
    this.employeservice.getEmploye(id).subscribe((res: any) => {
      // alert(JSON.stringify(res.data));
      this.employeForEdit = res.data.employe;
      console.log(res.data);
      this.editEmployeeForm.get('nom')?.setValue(res.data.employe.nom);
      this.editEmployeeForm.get('prenom')?.setValue(res.data.employe.prenom);
      this.editEmployeeForm.get('email')?.setValue(res.data.employe.email);
      this.editEmployeeForm.get('adresse')?.setValue(res.data.employe.adresse);
      this.editEmployeeForm
        .get('username')
        ?.setValue(res.data.employe.username);
      this.editEmployeeForm
        .get('anciennete')
        ?.setValue(res.data.employe.anciennete);
      this.editEmployeeForm
        .get('telephone')
        ?.setValue(res.data.employe.telephone);
      this.editEmployeeForm
        .get('date_arrivee')
        ?.setValue(res.data.employe.date_arrivee);
      this.editEmployeeForm
        .get('affiliation')
        ?.setValue(res.data.employe.affiliation);
      this.editEmployeeForm.get('titre')?.setValue(res.data.employe.titre);
      this.editEmployeeForm
        .get('date_naisance')
        ?.setValue(res.data.employe.date_naisance);
      this.editEmployeeForm
        .get('lieu_naisance')
        ?.setValue(res.data.employe.lieu_naisance);
    });
  }

  onClickSubmitEditEmployee() {
    if (this.editEmployeeForm.valid) {
      // console.log(this.editEmployeeForm.value);
      this.employeservice
        .updateEmploye(this.editEmployeeForm.value, this.employeForEdit.id)
        .subscribe(
          (data: any) => {
            $('#spinner').addClass('d-none');
            location.reload();
            // this.router.navigate(['/employees/employee-page']);
          },
          (error: any) => {
            alert(JSON.stringify(error.error));
          }
        );
    } else {
      alert("desole le formulaire n'est pas bien renseigné");
    }
  }

  listDepartement: any;
  listPoste: any;
  listCategorie: any;
  listClasse: any;
  listGrade: any;
  getDataForListe() {
    this.employeservice.getDepartementPoste().subscribe(
      (date: any) => {
        // console.log(date);

        this.listDepartement = date.data.departement;
        this.listPoste = date.data.poste;
        this.listGrade = date.data.grade;
        // this.listCategorie = date.data.categorie;
        // this.listClasse = date.data.classe;
      },
      (error: any) => {}
    );

    // this.employeservice.getLastContrat().subscribe(
    //   (data: any) => {
    //     // alert(JSON.stringify(data.data));
    //     // this.listTypeContrat=data.data.data
    //     // this.lastContrat = data.data;

    //     // console.log(data.data);
    //     this.addEmployeeForm
    //       .get('matricule')
    //       ?.setValue('E-000' + (data.data == 0 ? '1' : data.data.id));
    //   },
    //   (erro: any) => {}
    // );
  }

  private getTableData(): void {
    this.lstEmployee = [];
    this.serialNumberArray = [];

    this.data.getEmployees().subscribe((res: apiResultFormat) => {
      this.totalData = res.totalData;
      res.data.map((res: getEmployees, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id = serialNumber;
          this.lstEmployee.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getEmployees>(this.lstEmployee);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  public sortData(sort: Sort) {
    const data = this.lstEmployee.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstEmployee = data;
    } else {
      this.lstEmployee = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEmployee = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
export interface pageSelection {
  skip: number;
  limit: number;
}
