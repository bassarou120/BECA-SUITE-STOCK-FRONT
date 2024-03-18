import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService,apiResultFormat, routes, roleService, getRole  } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstRl: Array<any>=[];


  public lstRole: Array<getRole> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getRole>;
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


  public addRoleForm!: FormGroup ;
  public editRoleForm!: FormGroup
  public deleteRoleForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router, private data: roleService) {}


  ngOnInit(): void {
    this.getTableData();
    this.addRoleForm = this.formBuilder.group({
      lib: ["", [Validators.required]],
   });
   this.editRoleForm = this.formBuilder.group({
    id: [0, [Validators.required]],
    lib: ["", [Validators.required]],
  });
   this.deleteRoleForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

 onClickSubmitAddRole(){

  console.log(this.addRoleForm.value)

  if (this.addRoleForm.valid){
    this.data.saveRole(this.addRoleForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {

    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditRole(){
  console.log(this.editRoleForm.value)

    if (this.editRoleForm.valid){
      const id = this.editRoleForm.value.id;
      this.data.editRole(this.editRoleForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

}

onClickSubmitDeleteRole(){
  console.log(this.deleteRoleForm.value)

    if (this.deleteRoleForm.valid){
      const id = this.deleteRoleForm.value.id;
      this.data.deleteRole(this.deleteRoleForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

}

getEditForm(row: any){
  this.editRoleForm.patchValue({
   id:row.id,
   lib:row.lib
  })
}

getDeleteForm(row: any){
  this.deleteRoleForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstRole = [];
    this.serialNumberArray = [];

    this.data.getAllRole().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getRole, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstRole.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getRole>(this.lstRole);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstRole.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstRole = data;
    } else {
      this.lstRole = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstRole = this.dataSource.filteredData;
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
