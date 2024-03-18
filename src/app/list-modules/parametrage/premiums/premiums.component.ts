import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getpremiums, routes, PremiumService } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-premiums',
  templateUrl: './premiums.component.html',
  styleUrls: ['./premiums.component.scss']
})
export class PremiumsComponent implements OnInit {
  title = 'pagination';
  public routes = routes;
  public lstPremiums: Array<getpremiums> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getpremiums>;
  public addPremiumForm!: FormGroup ;
  public editPremiumForm!: FormGroup;
  public deletePremiumForm!: FormGroup;

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

  constructor(private data: PremiumService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getTableData();
    this.addPremiumForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
    this.editPremiumForm = this.formBuilder.group({
      id: [0, Validators.required],
      libelle: ['', Validators.required]
    });
    this.deletePremiumForm = this.formBuilder.group({
      id: [0, Validators.required],
    });
  }

  private getTableData(): void {
    this.lstPremiums = [];
    this.serialNumberArray = [];

    this.data.getAllPremiums().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: getpremiums, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstPremiums.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getpremiums>(this.lstPremiums);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  savePremium() {
    // console.log(this.addPremiumForm.value, this.addPremiumForm.valid);
    if (this.addPremiumForm.valid){
      this.data.savePremium(this.addPremiumForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    } 
  }

  getEditPremium(row: any) {
    this.editPremiumForm.patchValue({
      id: row.id,
      libelle: row.libelle
    })
  }

  editPremium() {
    // console.log(this.editHolidayForm.value, this.editHolidayForm.valid);
    if (this.editPremiumForm.valid){
      this.data.editPremium(this.editPremiumForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  }

  getDeletePremium(row: any) {
    this.deletePremiumForm.patchValue({
      id: row.id
    })
  }

  deletePremium() {
    // console.log(this.deleteHolidayForm.value, this.deleteHolidayForm.valid);
    if (this.deletePremiumForm.valid){
      this.data.deletePremium(this.deletePremiumForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Erreur");
    }
  }






  public sortData(sort: Sort) {
    const data = this.lstPremiums.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstPremiums = data;
    } else {
      this.lstPremiums = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstPremiums = this.dataSource.filteredData;
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