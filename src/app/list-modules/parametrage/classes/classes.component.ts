import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { getClasse, routes, ClasseService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClasseComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstClasses: Array<getClasse> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getClasse>;
  public addClasseForm!: FormGroup ;
  public editClasseForm!: FormGroup;
  public deleteClasseForm!: FormGroup;


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

  constructor(private data: ClasseService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addClasseForm = this.formBuilder.group({
      lib: ['', Validators.required],
      borneInf: ['', Validators.required],
      borneSup: ['', Validators.required],
    }, { validator: this.bornesValidator });
    this.editClasseForm = this.formBuilder.group({
      id: [0, Validators.required],
      lib: ['', Validators.required],
      borneInf: ['', Validators.required],
      borneSup: ['', Validators.required],
    }, { validator: this.bornesValidator });
    this.deleteClasseForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private bornesValidator(group: FormGroup) {
    const startBorneControl = group.get('borneInf');
    const endBorneControl = group.get('borneSup');
    if (!startBorneControl || !endBorneControl) {
      return null;
    }
    const startBorne = startBorneControl.value;
    const endBorne = endBorneControl.value;
    if (startBorne && endBorne && startBorne >= endBorne) {
      return { bornesInvalid: true };
    }
    return null;
  }

  private getTableData(): void {
    this.lstClasses = [];
    this.serialNumberArray = [];

    this.data.getAllClasses().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getClasse, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstClasses.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getClasse>(this.lstClasses);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  saveClasse() {

    if (this.addClasseForm.valid){
      this.data.saveClasse(this.addClasseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getEditClasse(row: any) {
    this.editClasseForm.patchValue({
      id: row.id,
      lib: row.lib,
      borneInf: row.borneInf,
      borneSup: row.borneSup,
    })
  }

  editClasse() {
    console.log(this.editClasseForm.value, this.editClasseForm.valid);

    if (this.editClasseForm.valid){
      this.data.editClasse(this.editClasseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeleteClasse(row: any) {
    this.deleteClasseForm.patchValue({
      id: row.id
    })
  }

  deleteClasse() {

    if (this.deleteClasseForm.valid){
      this.data.deleteClasse(this.deleteClasseForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }





  public sortData(sort: Sort) {
    const data = this.lstClasses.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstClasses = data;
    } else {
      this.lstClasses = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstClasses = this.dataSource.filteredData;
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
