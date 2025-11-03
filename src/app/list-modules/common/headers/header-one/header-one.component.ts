import { Component, OnInit } from '@angular/core';

import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { NavigationEnd, Router } from '@angular/router';
import { WebStorage } from 'src/app/core/services/storage/web.storage';
import { routes } from 'src/app/core/helpers/routes/routes';
import { ExportsService, InfosDeBaseService } from 'src/app/core/core.index';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent implements OnInit {
  nomEntreprise: string | null = null;
  public loggedUserData = this.getLoggedUserData();
  public base = '';
  public page = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  constructor(
    private sideBar: SideBarService,
    private router: Router,
    private web: WebStorage,
    private data: InfosDeBaseService,
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }
  }

  ngOnInit(): void {
    this.data.getAllInfoDeBases().subscribe(response => {
      if (response.success && response.data && response.data.data) {
        const infoDeBases = response.data.data;
        const nomEntreParam = infoDeBases.find((param: { cle: string; valeur_txt: string }) => param.cle === 'NOM_ENTREPRISE');
        this.nomEntreprise = nomEntreParam ? nomEntreParam.valeur_txt : 'Nom Entreprise';
      } else {
        console.error('Erreur dans la réponse de l\'API:', response);
      }
    }, error => {
      console.error('Erreur lors de la récupération des données:', error);
    });
  }

  private getLoggedUserData() {
    const userDataString = localStorage.getItem('userDataString');
    if(userDataString) {
      return JSON.parse(userDataString);
    } else {
      return null;
    }
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  logout() {
    localStorage.removeItem('LoginData');
    localStorage.removeItem('LoginToken');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  navigation() {
    this.router.navigate([routes.search]);
  }
}
