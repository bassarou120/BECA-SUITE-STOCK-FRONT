import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import {ExportsService, routes, banqueService, getBanque, getFournisseur} from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import {entreeSortieStockService} from "../../core/services/entree-sortie-stock/entree-sortie-stock.service";
import {categorieArticleService} from "../../core/services/categorie-article/categorie-article.service";
import {articleService} from "../../core/services/article/article.service";
import {fournisseurService} from "../../core/services/fournisseur/fournisseur.service";
import {EmployeService} from "../../core/services/employe/employe.service";
import {bureauService} from "../../core/services/bureau/bureau.service";



@Component({
  selector: 'app-banque',
  templateUrl: './sortie-stock.component.html',
  styleUrls: ['./sortie-stock.component.scss']
})
export class  SortieStockComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any>=[];


  public lstSortieStock: Array<any> = [];
  stockDisponible=0;
  lstCategorie:any;
  lstForuniseur:any;
  lstEmployer:any;
  lstBureau:any;
  lstArticel:any;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;
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
  article_id:any;
  public addEntreeStockForm!: FormGroup ;
  public editEntreeStockForm!: FormGroup
  public deleteEntreeStockForm!: FormGroup

  showAlert=false;
  messageAlert=""

  isDisabledBtn=false

  constructor(private formBuilder: FormBuilder,public router: Router,
              private articleService:articleService,
              private employeService:EmployeService,
              private  bureauService:bureauService,
              private fournisseurService: fournisseurService,
              private entreeSortieStockService: entreeSortieStockService,
              private categorieService: categorieArticleService,
              private exp: ExportsService) {}


  ngOnInit(): void {
    this.getTableData();
   // this.getFournisseur();
    this.getBureau();
   this.getEmploye();
   this.getArticle();

    this.addEntreeStockForm = this.formBuilder.group({
      article_id: ["", [Validators.required]],
      date_mouvement: ["", [Validators.required]],
      type: ["SORTIE", []],
      bureau_id:['',[Validators.required]],
      employe_id:['',[Validators.required]],
      qte: ["", [Validators.required,Validators.min(0)]],
      fournisseur: ["",  [ ]],
   });

   this.editEntreeStockForm = this.formBuilder.group({
    id: [0, [Validators.required]],
     article_id: ["", [Validators.required]],
     date_mouvement: ["", [Validators.required]],
     type: ["SORTIE", []],
     qte: ["", [Validators.required,Validators.min(0)]],
     bureau_id:['',[]],
     employe_id:['',[]],
     fourniseur: ["",  []],
  });
   this.deleteEntreeStockForm = this.formBuilder.group({
    id: [0, [Validators.required]],
  });
 }

  hideAlert() {
    this.showAlert = false;
  }

  resetAlert() {
    // Utilisez cette méthode pour réinitialiser l'alerte si nécessaire
    this.showAlert = true;
  }

  changeQte(){

    var t=this.stockDisponible-this.addEntreeStockForm.get('qte')?.value
    if(t<0 ){

      this.messageAlert="Attention ! Vous ne pouvez pas sortir ce article au dela de "+this.stockDisponible
      this.showAlert=true;
      this.isDisabledBtn=true
  // alert('Vous ne pouvez pas sortir ce article au dela de '+this.stockDisponible)
    }else {
      this.isDisabledBtn=false
    }
  }
  changeArtice(){

    this.entreeSortieStockService.getSockByArticle({
      article_id:this.addEntreeStockForm.get('article_id')?.value
    }).subscribe(
      (resp:any)=>{

        // alert(resp.data.qte)
        this.stockDisponible=resp.data.qte;

        this.addEntreeStockForm.get('qte')?.setValue('')

      }
    )

    // alert(this.addReparationImmoForm.get('article_id')?.value)
  }


 getEmploye(){

   this.employeService.getAllEmploye().subscribe(
     (res: any) => {

         // alert(JSON.stringify(res.data ))
       this.lstEmployer=res.data

     },
     (error:any)=>{

     });
 }

  getBureau(){

    this.bureauService.getAll().subscribe(
      (res: any) => {
        // alert(JSON.stringify(res.data ))
        this.lstBureau=res.data.data

      },
      (error:any)=>{

      });
  }

  getCategorie(){

    this.categorieService.getAll().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data.data))
        this.lstCategorie=res.data.data

    },
      (error:any)=>{

    });


  }

  getFournisseur(){

    this.fournisseurService.getAll().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data.data))
        this.lstForuniseur=res.data.data

    },
      (error:any)=>{

    });


  }

  getArticle(){

    this.articleService.getAll().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data.data))
        this.lstArticel=res.data.data

    },
      (error:any)=>{

    });


  }

 onClickSubmitAddEntreeStock(){

  console.log(this.addEntreeStockForm.value)

  if (this.addEntreeStockForm.valid){
    $('#spinnerr').removeClass('d-none');
    this.entreeSortieStockService.saveEntree(this.addEntreeStockForm.value).subscribe(
      (data:any)=>{
        location.reload();
      }
    )
  }else {
    $('#spinnerr').addClass('d-none');
    alert("desole le formulaire n'est pas bien renseigné")
  }


}

onClickSubmitEditArticle(){
  console.log(this.editEntreeStockForm.value)

    if (this.editEntreeStockForm.valid){
      $('#spinner').removeClass('d-none');
      const id = this.editEntreeStockForm.value.id;
      this.entreeSortieStockService.edit(this.editEntreeStockForm.value).subscribe(
        (data:any)=>{
          location.reload();
        }
      )
      console.log("success")
    }else {
      $('#spinner').addClass('d-none');
      alert("desole le formulaire n'est pas bien renseigné")
    }

}

onClickSubmitDeleteBanque(){
  console.log(this.deleteEntreeStockForm.value)

    if (this.deleteEntreeStockForm.valid){
      const id = this.deleteEntreeStockForm.value.id;
      this.entreeSortieStockService.delete(this.deleteEntreeStockForm.value).subscribe(
        (data:any)=>{

          // alert(JSON.stringify(data))
          location.reload();
        }
      )
      console.log("success")
    }else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

}



getEditForm(row: any){
  this.editEntreeStockForm.patchValue({
   id:row.id,
    article_id:row.article_id,
    date_mouvement: row.date_mouvement,
    qte:row.qte,
    code: row.code,
    fournisseur: row.fournisseur,
  })
}

getDeleteForm(row: any){
  this.deleteEntreeStockForm.patchValue({
   id:row.id,
  })
}


  private getTableData(): void {
    this.lstSortieStock = [];
    this.serialNumberArray = [];

    this.entreeSortieStockService.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;

          // alert(res.type);
          if(res.type=="SORTIE"){
            this.lstSortieStock.push(res);

            this.serialNumberArray.push(serialNumber);
          }

        }
      });
      console.log(this.lstSortieStock);
      this.dataSource = new MatTableDataSource<any>(this.lstSortieStock);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


  }



  exportToPDF() {
    $('#spinner_pdf').removeClass('d-none');
    this.exp.exportBanques().subscribe(
      (response: any) => {
        $('#spinner_pdf').addClass('d-none');
        window.open(response.data, '_blank');
      },
      (error: any) => {
        $('#spinner_pdf').addClass('d-none');
        alert(JSON.stringify(error));
      }
    );
  }

  exportToXLSX() {
    $('#spinner_xlsx').removeClass('d-none');
    setTimeout(() => {
      const table: HTMLElement | null = document.getElementById('to_export');
      const filename = "Les Bureau.xlsx";

      if (table) {
        const wb = XLSX.utils.book_new();
        const tableCopy = table.cloneNode(true) as HTMLElement;

        const idsToExclude: string[] = ['exclusion-1', 'exclusion-2'];
        idsToExclude.forEach(id => {
          const elementsToRemove = tableCopy.querySelectorAll(`#${id}`);
          elementsToRemove.forEach(element => {
            const columnIndex = Array.from(element.parentElement!.children).indexOf(element);
            const rows = tableCopy.querySelectorAll('tr');
            rows.forEach(row => {
              if (row.children[columnIndex]) {
                row.removeChild(row.children[columnIndex]);
              }
            });
          });
        });

        const ws1 = XLSX.utils.table_to_sheet(tableCopy);
        XLSX.utils.book_append_sheet(wb, ws1, "Les Bureau");

        XLSX.writeFile(wb, filename);
        $('#spinner_xlsx').addClass('d-none');
      } else {
        console.error("L'Id spécifié n'a pas été trouvé.");
        $('#spinner_xlsx').addClass('d-none');
      }
    }, 10);
  }

  public sortData(sort: Sort) {
    const data = this.lstSortieStock.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstSortieStock = data;
    } else {
      this.lstSortieStock = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstSortieStock = this.dataSource.filteredData;
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
