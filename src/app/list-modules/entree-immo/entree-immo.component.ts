import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ExportsService, routes } from 'src/app/core/core.index';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import { LocalisationService } from "../../core/services/localisation/localisation.service";
import { immoService } from "../../core/services/immo/immo.service";

import { FamilleImmoService } from "../../core/services/famille-immo/famille-immo.service";
import { getFamilleImmo} from 'src/app/core/core.index';
//import Swal from 'sweetalert2';

@Component({
  selector: 'app-banque',
  templateUrl: './entree-immo.component.html',
  styleUrls: ['./entree-immo.component.scss']
})
export class EntreeImmoComponent implements OnInit {
  public routes = routes;
  selected = 'option1';

  public lstPst: Array<any> = [];

  public lstEntreeImmo: Array<any> = [];
  public lstFamilleImmo:  Array<getFamilleImmo> = [];
  lstDesignation: any[] = [];

  lstLocalisation: any;

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
  article_id: any;
  public addEntreeImmoForm!: FormGroup;
  public editEntreeImmoForm!: FormGroup
  public deleteEntreeImmoForm!: FormGroup

  showAlert = false;
  messageAlert = ""

  isDisabledBtn = false

  constructor(private formBuilder: FormBuilder, public router: Router,
    private localisationService: LocalisationService,
    private immoService: immoService,
    private familleImmoService: FamilleImmoService,
    private exp: ExportsService) { }


  ngOnInit(): void {
    this.getTableData();
    this.getLocalisation();
    this.loadFamilleImmo();

    this.addEntreeImmoForm = this.formBuilder.group({
      familleimmo_id: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      date_entree: ["", [Validators.required]],
      valeur_origine: ["", [Validators.required]],
      //duree_amortissement: [""],
      duree_amortissement: ["", [Validators.required, Validators.min(0)]],
      //date_fin_amortissement: [""],
      date_fin_amortissement: [{ value: "", disabled: true }, [Validators.required]],
      code: ["", [Validators.required]],
      localisation_id: ["", [Validators.required]],
      etat: ["", [Validators.required]],
      bien_amortissable: ["oui", [Validators.required]],
    });

    this.setupCodeGeneration();

    this.editEntreeImmoForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      familleimmo_id: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      date_entree: ["", [Validators.required]],
      valeur_origine: ["", [Validators.required]],
      duree_amortissement: ["", [Validators.required]],
      date_fin_amortissement: ["", [Validators.required]],
      code: ["", [Validators.required]],
      localisation_id: ["", [Validators.required]],
      etat: ["", [Validators.required]],
    });
    this.deleteEntreeImmoForm = this.formBuilder.group({
      id: [0, [Validators.required]],
    });
    this.initBienAmortissableListener();
    this.applyBienAmortissableValidators();

    this.addEntreeImmoForm.get('date_entree')?.valueChanges.subscribe(() => {
      this.calculateDateFin();
    });

    this.addEntreeImmoForm.get('duree_amortissement')?.valueChanges.subscribe(() => {
      this.calculateDateFin();
    });
  }

  calculateDateFin() {
  const dateEntree = this.addEntreeImmoForm.get('date_entree')?.value;
  const duree = this.addEntreeImmoForm.get('duree_amortissement')?.value;

  if (dateEntree && duree >= 0) {
    const date = new Date(dateEntree);
    date.setFullYear(date.getFullYear() + Number(duree));

    const formattedDate = date.toISOString().split('T')[0];

    this.addEntreeImmoForm.get('date_fin_amortissement')?.setValue(formattedDate);
  }
}


setupCodeGeneration() {
  this.addEntreeImmoForm.get('familleimmo_id')?.valueChanges.subscribe(
    (familleId) => {
      if (familleId) {
        console.log('Famille sélectionnée:', familleId); // Pour débugger
        this.generateCode(familleId);
      }
    }
  );
}

  generateCode(familleId: number) {
    const familleSelectionnee = this.lstFamilleImmo.find(
      (f) => f.id === familleId
    );

    if (familleSelectionnee) {
      const prefixe = familleSelectionnee.intitule
        .substring(0, 3)
        .toUpperCase();

      this.immoService.getNextNumero().subscribe({
        next: (response) => {
          const numero = String(response.nextNumero).padStart(3, '0');
          const codeGenere = `${prefixe}-${numero}`;

          console.log("Code généré:", codeGenere);

          // Mettre à jour le champ code
          this.addEntreeImmoForm.get('code')?.setValue(codeGenere);
        },
        error: (err) => {
          console.error('Erreur lors de la génération du code:', err);
        }
      });
    }
  }

  hideAlert() {
    this.showAlert = false;
  }

  resetAlert() {
    // Utilisez cette méthode pour réinitialiser l'alerte si nécessaire
    this.showAlert = true;
  }

  private applyBienAmortissableValidators(): void {
  const val = this.addEntreeImmoForm.get('bien_amortissable')?.value;
  const duree = this.addEntreeImmoForm.get('duree_amortissement');
  const dateFin = this.addEntreeImmoForm.get('date_fin_amortissement');

  if (val === 'oui') {
    duree?.setValidators([Validators.required, Validators.min(1)]);
    dateFin?.setValidators([Validators.required]);
  } else {
    duree?.clearValidators();
    dateFin?.clearValidators();
    duree?.setValue(null);
    dateFin?.setValue(null);
  }

  duree?.updateValueAndValidity();
  dateFin?.updateValueAndValidity();
}

  private initBienAmortissableListener(): void {
  this.addEntreeImmoForm.get('bien_amortissable')?.valueChanges.subscribe(val => {
    const duree = this.addEntreeImmoForm.get('duree_amortissement');
    const dateFin = this.addEntreeImmoForm.get('date_fin_amortissement');

    if (val === 'oui') {
      duree?.setValidators([Validators.required, Validators.min(1)]);
      dateFin?.setValidators([Validators.required]);
    } else {
      duree?.clearValidators();
      dateFin?.clearValidators();
      duree?.setValue(null);
      dateFin?.setValue(null);
    }

    // ⚡ Mise à jour des validateurs
    duree?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    dateFin?.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    // ⚡ Marquer comme touché pour déclencher les messages
    duree?.markAsTouched();
    dateFin?.markAsTouched();
  });
}





  getLocalisation() {

    this.localisationService.getAll().subscribe(
      (res: any) => {

        // alert(JSON.stringify(res.data ))
        this.lstLocalisation = res.data.data

      },
      (error: any) => {

      });
  }

  loadFamilleImmo(): void {
    this.familleImmoService.getAll().subscribe({
      next: (res: any) => {
        console.log('famille API:', res);

        // ✅ ICI EST LA CLÉ
        this.lstFamilleImmo = res.data.data;

        console.log('Liste des famille immo:', this.lstFamilleImmo);
      },
      error: (err) => {
        console.error('Erreur chargement famille immo', err);
      }
    });
  }

  onClickSubmitAddImmo() {

    console.log(this.addEntreeImmoForm.value)

    if (this.addEntreeImmoForm.valid) {
      $('#spinnerr').removeClass('d-none');
      this.immoService.save(this.addEntreeImmoForm.getRawValue()).subscribe(
        (data: any) => {
          this.getTableData();
          const closeBtn = document.querySelector('#add_immo .btn-close') as HTMLElement;
          closeBtn?.click();

          alert("Immobilisation enrégistré avec succès");
          //location.reload();
         
        }
      )
    } else {
      $('#spinnerr').addClass('d-none');
      this.messageAlert = "Attention ! Desolé le formulaire n'est pas bien renseigné"
      this.showAlert = true;

      alert("desole le formulaire n'est pas bien renseigné")
    }


  }

  onClickSubmitEditArticle() {
    console.log(this.editEntreeImmoForm.value)

    if (this.editEntreeImmoForm.valid) {
      const id = this.editEntreeImmoForm.value.id;
      $('#spinner').removeClass('d-none');
      this.immoService.edit(this.editEntreeImmoForm.getRawValue()).subscribe(
        (data: any) => {
          //location.reload();
          this.getTableData();
          const closeBtn = document.querySelector('#edit_immo .btn-close') as HTMLElement;
          closeBtn?.click();

          alert("Immobilisation mise à jour avec succès");
        }
      )
      console.log("success")
    } else {
      $('#spinner').addClass('d-none');
      alert("desole le formulaire n'est pas bien renseigné")
    }

  }

  onClickSubmitDeleteImmo() {
    console.log(this.deleteEntreeImmoForm.value)

    if (this.deleteEntreeImmoForm.valid) {
      const id = this.deleteEntreeImmoForm.value.id;
      this.immoService.delete(this.deleteEntreeImmoForm.value).subscribe(
        (data: any) => {

          this.getTableData();
          const closeBtn = document.querySelector('#delete_immo .btn-close') as HTMLElement;
          closeBtn?.click();

          alert("Immobilisation supprimé avec succès");
          //location.reload();
        }
      )
      console.log("success")
    } else {

      alert("desole le formulaire n'est pas bien renseigné")
    }

  }



  getEditForm(row: any) {
  this.editEntreeImmoForm.patchValue({
    id: row.id,
    familleimmo_id: row.familleimmo_id,
    designation: row.designation,
    date_entree: row.date_entree,
    valeur_origine: row.valeur_origine,
    //valeur_origine: Number(row.valeur_origine),
    duree_amortissement: row.duree_amortissement,
    date_fin_amortissement: row.date_fin_amortissement,
    code: row.code,
    localisation_id: row.localisation_id,
    etat: row.etat,
  });
}


  getDeleteForm(row: any) {
    this.deleteEntreeImmoForm.patchValue({
      id: row.id,
    })
  }


  private getTableData(): void {
    this.lstEntreeImmo = [];
    this.serialNumberArray = [];

    this.immoService.getAll().subscribe((res: any) => {
      this.totalData = res.data.total;
      res.data.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id;// = serialNumber;

          // alert(res.type);

          this.lstEntreeImmo.push(res);

          this.serialNumberArray.push(serialNumber);


        }
      });
      console.log(this.lstEntreeImmo);
      this.dataSource = new MatTableDataSource<any>(this.lstEntreeImmo);
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
    const data = this.lstEntreeImmo.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstEntreeImmo = data;
    } else {
      this.lstEntreeImmo = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEntreeImmo = this.dataSource.filteredData;
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
