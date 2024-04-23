import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService,apiResultFormat, getGrade, routes, GradeService,getMiniTemplateEmploye, getClasse, getCategorie } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  public routes = routes;

  public selected: string = "Taux Impo en %";
  public select: string = "Taux CNSS en %";
  public  employe: string ="Valeur Impo";
  public selection: string ="Valeur CNSS"

  public selectedEdit: string = "Taux Impo en %";
  public selectEdit: string = "Taux CNSS en %";
  public  employeEdit: string ="Valeur Impo";
  public selectionEdit: string ="Valeur CNSS"

  public lstGrades: Array<getGrade> = [];
  public lstClasse: Array<getClasse> = [];
  public lstImpo: Array<string> = ["Taux Impo en %", "Valeur Impo"];
  public lstCNSS: Array<string> = ["Taux CNSS en %", "Valeur CNSS"];
  public lstIts: Array<string> = ["Taux Impo en %", "Valeur Impo"];
  public lstcnss: Array<string> = ["Taux CNSS en %", "Valeur CNSS"];
  public lstCategorie: Array<getCategorie> = [];
  public editFormSelectedEmployeId: number = 0;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getGrade>;
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

  public editFormSelectedCategorieId: number = 0;
  public editFormSelectedClasseId: number = 0;
  //** / pagination variables

  public addGradeForm!: FormGroup ;
  public editGradeForm!: FormGroup
  public deleteGradeForm!: FormGroup

  constructor(private formBuilder: FormBuilder,public router: Router,private data: GradeService) {}

  ngOnInit(): void {
     this.getTableData();
     this.addGradeForm = this.formBuilder.group({
      categorie_id: [0, [Validators.required]],
      classe_id: [0, [Validators.required]],
      base_categorielle: ["", [Validators.required]],
      prime_enciennete: ["", [Validators.required]],
      tauxHoraireHeureSup: ["", [Validators.required]],
      taux_retenu_its_employe: [" ", [Validators.required]],
      taux_retenu_cnss_employe: [" ", [Validators.required]],
      valeur_retenu_its_employe: [" ", [Validators.required]],
      valeur_retenu_cnss_employe: [" ", [Validators.required]],
      taux_retenu_its_employeur: [" ", [Validators.required]],
      taux_retenu_cnss_employeur: [" ", [Validators.required]],
      valeur_retenu_its_employeur: [" ", [Validators.required]],
      valeur_retenu_cnss_employeur: [" ", [Validators.required]],
      selected: ["Taux Impo en %", [Validators.required]],
      select: ["Taux CNSS en %", [Validators.required]],
      employe: ["Taux Impo en %", [Validators.required]],
      selection: ["Taux CNSS en %", [Validators.required]],
    });
     this.editGradeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      categorie_id: [0, [Validators.required]],
      classe_id: [0, [Validators.required]],
      base_categorielle: ["", [Validators.required]],
      prime_enciennete: ["", [Validators.required]],
      tauxHoraireHeureSup: ["", [Validators.required]],
      taux_retenu_its_employe: [" ", [Validators.required]],
      taux_retenu_cnss_employe: [" ", [Validators.required]],
      valeur_retenu_its_employe: [" ", [Validators.required]],
      valeur_retenu_cnss_employe: [" ", [Validators.required]],
      taux_retenu_its_employeur: [" ", [Validators.required]],
      taux_retenu_cnss_employeur: [" ", [Validators.required]],
      valeur_retenu_its_employeur: [" ", [Validators.required]],
      valeur_retenu_cnss_employeur: [" ", [Validators.required]],

      selectedEdit: ["Taux Impo en %", [Validators.required]],
      selectEdit: ["Taux CNSS en %", [Validators.required]],
      employeEdit: ["Taux Impo en %", [Validators.required]],
      selectionEdit: ["Taux CNSS en %", [Validators.required]],
    });
     this.deleteGradeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }


  onClickSubmitAddGrade(){

      if (this.addGradeForm.valid){
        if (this.addGradeForm.value.selected == "Taux Impo en %") {
          this.addGradeForm.patchValue({valeur_retenu_its_employe: ""});
        } else {
          this.addGradeForm.patchValue({taux_retenu_its_employe: ""});
        }

        if (this.addGradeForm.value.select == "Taux CNSS en %") {
          this.addGradeForm.patchValue({valeur_retenu_cnss_employe: ""});
        } else {
          this.addGradeForm.patchValue({taux_retenu_cnss_employe: ""});
        }


        this.data.saveGrade(this.addGradeForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        );
      }if (this.addGradeForm.valid){
          if (this.addGradeForm.value.employe == "Taux Impo en %") {
            this.addGradeForm.patchValue({valeur_retenu_its_employeur: ""});
          } else {
            this.addGradeForm.patchValue({taux_retenu_its_employeur: ""});
          }

          if (this.addGradeForm.value.selection == "Taux CNSS en %") {
            this.addGradeForm.patchValue({valeur_retenu_cnss_employeur: ""});
          } else {
            this.addGradeForm.patchValue({taux_retenu_cnss_employeur: ""});
          }


          this.data.saveGrade(this.addGradeForm.value).subscribe(
            (data:any)=>{
              location.reload();
            }
          );
      }else {
        //alert("desole le formulaire n'est pas bien renseigné")
      }


  }

  onClickSubmitEditGrade(){
    // console.log(this.editGradeForm.value)
    //   if (this.editGradeForm.valid){
    //     const id = this.editGradeForm.value.id;
    //     this.data.editGrade(this.editGradeForm.value).subscribe(
    //       (data:any)=>{
      if (this.editGradeForm.valid){
        if (this.editGradeForm.value.selectedEdit == "Taux Impo en %") {
          this.editGradeForm.patchValue({valeur_retenu_its_employe: ""});
        } else {
          this.editGradeForm.patchValue({taux_retenu_its_employe: ""});
        }

        if (this.editGradeForm.value.selectEdit == "Taux CNSS en %") {
          this.editGradeForm.patchValue({valeur_retenu_cnss_employe: ""});
        } else {
          this.editGradeForm.patchValue({taux_retenu_cnss_employe: ""});
        }


        this.data.editGrade(this.editGradeForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        );
      }if (this.editGradeForm.valid){
          if (this.editGradeForm.value.employeEdit == "Taux Impo en %") {
            this.editGradeForm.patchValue({valeur_retenu_its_employeur: ""});
          } else {
            this.editGradeForm.patchValue({taux_retenu_its_employeur: ""});
          }

          if (this.editGradeForm.value.selectionEdit == "Taux CNSS en %") {
            this.editGradeForm.patchValue({valeur_retenu_cnss_employeur: ""});
          } else {
            this.editGradeForm.patchValue({taux_retenu_cnss_employeur: ""});
          }


          this.data.editGrade(this.editGradeForm.value).subscribe(
            (data:any)=>{
            location.reload();
          }
        );
        //console.log("success")
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }
  onClickSubmitDeleteGrade(){

      if (this.deleteGradeForm.valid){
        const id = this.deleteGradeForm.value.id;
        this.data.deleteGrade(this.deleteGradeForm.value).subscribe(
          (data:any)=>{
            location.reload();
          }
        )
      }else {

        alert("desole le formulaire n'est pas bien renseigné")
      }

  }




  getEditForm(row: any){
    this.editGradeForm.patchValue({
      id: row.id,
      employe_id: row.employe_id,
      intitule: row.intitule,
      domaine: row.domaine,
      diplome: row.diplome,
      employe: row.employe,

      categorie_id: row.categorie_id,
      classe_id: row.classe_id,
      base_categorielle: row.base_categorielle,
      prime_enciennete: row.prime_enciennete,
      taux_retenu_its_employe: row.taux_retenu_impo,
      taux_retenu_cnss_employe: row.taux_retenu_cnss,
      valeur_retenu_its_employe: row.valeur_retenu_impo,
      valeur_retenu_cnss_employe: row.valeur_retenu_cnss,
    });

    this.editFormSelectedCategorieId = row.categorie_id;
    this.editFormSelectedClasseId = row.classe_id;
 }

  getDeleteForm(row: any){
    this.deleteGradeForm.patchValue({
     id:row.id,
    })
 }




  private getTableData(): void {
    this.lstGrades = [];
    this.serialNumberArray = [];

    this.data.getAllGrades().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.map((res: getGrade, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;
          this.lstGrades.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });

      this.data.getAllCategories().subscribe((res: any) => {
        res.data.data.map((res: getCategorie, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstCategorie.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      });
      this.data.getAllClasses().subscribe((res: any) => {
        res.data.data.map((res: getClasse, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            res.id;// = serialNumber;
            this.lstClasse.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      });

      this.dataSource = new MatTableDataSource<getGrade>(this.lstGrades);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }

  public sortData(sort: Sort) {
    const data = this.lstGrades.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstGrades = data;
    } else {
      this.lstGrades = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }






  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstGrades = this.dataSource.filteredData;
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


