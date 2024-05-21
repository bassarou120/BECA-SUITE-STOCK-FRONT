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

 
  public lstGrades: Array<getGrade> = [];
  public lstClasse: Array<getClasse> = [];
 
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
      taux_retenu_its_employeur: [" ", [Validators.required]],
      taux_retenu_cnss_employeur: [" ", [Validators.required]],
      taux_retenu_ipts_employe: ["", [Validators.required]],
      taux_retenu_ipts_employeur: ["", [Validators.required]],
    });


    this.addGradeForm.get('prime_enciennete')?.valueChanges.subscribe(() => {
      this.calculateITSPercent();
      this.calculateIPTSPercent();
    });

    this.addGradeForm.get('base_categorielle')?.valueChanges.subscribe(() => {
      this.calculateITSPercent();
      this.calculateIPTSPercent();
    });


     this.editGradeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      categorie_id: [0, [Validators.required]],
      classe_id: [0, [Validators.required]],
      base_categorielle: ["", [Validators.required]],
      prime_enciennete: ["", [Validators.required]],
      tauxHoraireHeureSup: ["", [Validators.required]],
      taux_retenu_its_employe: ["", [Validators.required]],
      taux_retenu_cnss_employe: ["", [Validators.required]],

      taux_retenu_ipts_employe: ["", [Validators.required]],

      taux_retenu_its_employeur: ["", [Validators.required]],
      taux_retenu_cnss_employeur: ["", [Validators.required]],

      taux_retenu_ipts_employeur: ["", [Validators.required]],
    });

    this.editGradeForm.get('prime_enciennete')?.valueChanges.subscribe(() => {
      this.calculateITSPercentEdit();
      this.calculateIPTSPercentEdit();
    });

    this.editGradeForm.get('base_categorielle')?.valueChanges.subscribe(() => {
      this.calculateITSPercentEdit();
      this.calculateIPTSPercentEdit();
    });

     this.deleteGradeForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
  }


  onClickSubmitAddGrade(){

    if (this.addGradeForm.valid){
        this.data.saveGrade(this.addGradeForm.value).subscribe(response => {
          console.log(response);
          location.reload();
        });
      } else {
        console.log("Desolé le formulaire n'est pas bien renseigné");
      }

  }

  calculateITSPercent() {
    const baseCategorielle = this.addGradeForm.get('base_categorielle')?.value;
    const primeAnciennete = this.addGradeForm.get('prime_enciennete')?.value;

    // Calculer la somme de la base catégorielle et de la prime d'ancienneté
    const total = baseCategorielle + primeAnciennete;

    // Calculer le pourcentage de taux ITS employé en fonction de l'intervalle
    let tauxITS = 0;
    if (total >= 0 && total <= 60000) {
      tauxITS = 0;
    } else if (total > 60000 && total <= 150000) {
      tauxITS = 10;
    } else if (total > 150000 && total <= 250000) {
      tauxITS = 15;
    } else if (total > 250000 && total <= 500000) {
      tauxITS = 19;
    } else if (total > 500000 && total <= 1990000) {
      tauxITS = 30;
    } else {
      // Si le total dépasse l'intervalle le plus élevé, utiliser le taux ITS maximum (30%)
      tauxITS = 30;
    }

    // Mettre à jour la valeur du champ taux_retenu_its_employe dans le formulaire
    this.addGradeForm.patchValue({
      taux_retenu_its_employe: tauxITS
    });
  }


  calculateIPTSPercent() {
    const baseCategorielle = this.addGradeForm.get('base_categorielle')?.value;
    const primeAnciennete = this.addGradeForm.get('prime_enciennete')?.value;

    console.log("Base Categorielle:", baseCategorielle);
    console.log("Prime Anciennete:", primeAnciennete);
    // Calculer la somme de la base catégorielle et de la prime d'ancienneté
    const totalpts = baseCategorielle + primeAnciennete;
    console.log("Total:", totalpts);

    // Calculer le pourcentage de taux ITS employé en fonction de l'intervalle
    let tauxIPTS = 0;
    if (totalpts >= 0 && totalpts <= 50000) {
      tauxIPTS = 0;
    } else if (totalpts > 50000 && totalpts <= 130000) {
      tauxIPTS = 10;
    } else if (totalpts > 130000 && totalpts <= 280000) {
      tauxIPTS = 15;
    } else if (totalpts > 280000 && totalpts <= 530000) {
      tauxIPTS = 20;
    } else if (totalpts > 530000 && totalpts <= 1990000) {
      tauxIPTS = 30;
    } else {
      // Si le total dépasse l'intervalle le plus élevé, utiliser le taux ITS maximum (30%)
      tauxIPTS = 30;
    }

    console.log("Taux IPTS:", tauxIPTS);

    // Mettre à jour la valeur du champ taux_retenu_its_employe dans le formulaire
    this.addGradeForm.patchValue({
      taux_retenu_ipts_employe: tauxIPTS
    });
  }

  onClickSubmitEditGrade(){
    if (this.editGradeForm.valid){
      this.data.editGrade(this.editGradeForm.value).subscribe(response => {
        console.log(response);
        location.reload();
      });
    } else {
      console.log("Desolé le formulaire n'est pas bien renseigné");
    }
  
      }

      calculateITSPercentEdit() {
        const baseCategorielle = this.editGradeForm.get('base_categorielle')?.value;
        const primeAnciennete = this.editGradeForm.get('prime_enciennete')?.value;
    
        // Calculer la somme de la base catégorielle et de la prime d'ancienneté
        const total = baseCategorielle + primeAnciennete;
    
        // Calculer le pourcentage de taux ITS employé en fonction de l'intervalle
        let tauxITS = 0;
        if (total >= 0 && total <= 60000) {
          tauxITS = 0;
        } else if (total > 60000 && total <= 150000) {
          tauxITS = 10;
        } else if (total > 150000 && total <= 250000) {
          tauxITS = 15;
        } else if (total > 250000 && total <= 500000) {
          tauxITS = 19;
        } else if (total > 500000 && total <= 1990000) {
          tauxITS = 30;
        } else {
          // Si le total dépasse l'intervalle le plus élevé, utiliser le taux ITS maximum (30%)
          tauxITS = 30;
        }
    
        // Mettre à jour la valeur du champ taux_retenu_its_employe dans le formulaire
        this.editGradeForm.patchValue({
          taux_retenu_its_employe: tauxITS
        });
      }

      calculateIPTSPercentEdit() {
        const baseCategorielle = this.editGradeForm.get('base_categorielle')?.value;
        const primeAnciennete = this.editGradeForm.get('prime_enciennete')?.value;
    
        console.log("Base Categorielle:", baseCategorielle);
        console.log("Prime Anciennete:", primeAnciennete);
        // Calculer la somme de la base catégorielle et de la prime d'ancienneté
        const totalpts = baseCategorielle + primeAnciennete;
        console.log("Total:", totalpts);
    
        // Calculer le pourcentage de taux ITS employé en fonction de l'intervalle
        let tauxIPTS = 0;
    if (totalpts >= 0 && totalpts <= 50000) {
      tauxIPTS = 0;
    } else if (totalpts > 50000 && totalpts <= 130000) {
      tauxIPTS = 10;
    } else if (totalpts > 130000 && totalpts <= 280000) {
      tauxIPTS = 15;
    } else if (totalpts > 280000 && totalpts <= 530000) {
      tauxIPTS = 20;
    } else if (totalpts > 530000 && totalpts <= 1990000) {
      tauxIPTS = 30;
    } else {
      // Si le total dépasse l'intervalle le plus élevé, utiliser le taux ITS maximum (30%)
      tauxIPTS = 30;
    }

    
        console.log("Taux IPTS:", tauxIPTS);
    
        // Mettre à jour la valeur du champ taux_retenu_its_employe dans le formulaire
        this.editGradeForm.patchValue({
          taux_retenu_ipts_employe: tauxIPTS
        });
      }

  
  onClickSubmitDeleteGrade(){
    console.log(this.deleteGradeForm.value)

      if (this.deleteGradeForm.valid){
        const id = this.deleteGradeForm.value.id;
        this.data.deleteGrade(this.deleteGradeForm.value).subscribe(
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
    this.editGradeForm.patchValue({
      id: row.id,
      // employe_id: row.employe_id,
      // intitule: row.intitule,
      // domaine: row.domaine,
      // diplome: row.diplome,
      // employe: row.employe,

      categorie_id: row.categorie_id,
      classe_id: row.classe_id,
      base_categorielle: row.base_categorielle,
      prime_enciennete: row.prime_enciennete,
      tauxHoraireHeureSup: row.tauxHoraireHeureSup,

      taux_retenu_its_employe: row.taux_retenu_its_employe,
      taux_retenu_cnss_employe: row.taux_retenu_cnss_employe,
      taux_retenu_ipts_employe: row.taux_retenu_ipts_employe,

      taux_retenu_its_employeur: row.taux_retenu_its_employeur,
      taux_retenu_cnss_employeur: row.taux_retenu_cnss_employeur,
      taux_retenu_ipts_employeur: row.taux_retenu_ipts_employeur,
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


