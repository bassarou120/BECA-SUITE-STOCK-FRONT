import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
  DataService,
  SideBar,
  SideBarMenu,
  SubMenu,
  routes,
} from 'src/app/core/core.index';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';

@Component({
  selector: 'app-side-menu-one',
  templateUrl: './side-menu-one.component.html',
  styleUrls: ['./side-menu-one.component.scss'],
})
export class SideMenuOneComponent implements OnDestroy {
  public routes = routes;
  public multilevel: Array<boolean> = [false, false, false];
  base = 'dashboard';
  page = '';

  side_bar_data: Array<SideBar> = [];
  constructor(
    public router: Router,
    private data: DataService,
    private sideBar: SideBarService
  ) {
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        this.updateMenuState(event.urlAfterRedirects);
      }
    });
    // get sidebar data as observable because data is controlled for design to expand submenus
    this.data.getSideBarData.subscribe((res: Array<SideBar>) => {
      this.side_bar_data = res;
      this.updateMenuState(this.router.url); // Initialiser l'état du menu
    });

    // alert(JSON.stringify(this.side_bar_data))
  }

  private resetMenuState() {
    this.side_bar_data.forEach(mainMenu => {
      mainMenu.menu.forEach(menuItem => {
        menuItem.dot = false;
        menuItem.isActive = false;

        if (menuItem.subMenus) {
          menuItem.subMenus.forEach(subMenuItem => {
            subMenuItem.isActive = false;
          });
        }
      });
    });
  }





  public updateMenuState(url: string) {
    this.resetMenuState(); // Réinitialiser tous les points et états actifs

    this.side_bar_data.forEach(mainMenu => {
      mainMenu.menu.forEach(menuItem => {
        // Vérifier si la route actuelle est incluse dans le chemin de base du menu principal
        const menuItemActive = url.includes(menuItem.base);
        menuItem.isActive = menuItemActive;
        menuItem.dot = menuItemActive; // Afficher le point si le menu principal est actif

        if (menuItem.subMenus) {
          // Vérifier les sous-menus
          let hasActiveSubMenu = false; // Pour déterminer si un sous-menu est actif
          menuItem.subMenus.forEach(subMenuItem => {
            const subMenuItemActive = url.includes(subMenuItem.base);
            subMenuItem.isActive = subMenuItemActive;
            if (subMenuItemActive) {
              hasActiveSubMenu = true; // Si un sous-menu est actif, mettre à jour l'état du menu principal
            }

            // Afficher le point (dot) si un sous-menu est actif
            menuItem.dot = hasActiveSubMenu || menuItem.dot;
          });
        }
      });
    });
  }



  public miniSideBarMouseHover(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  public expandSubMenus(menu: SideBarMenu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  public expandSubSubMenus(subMenus: SubMenu): void {
    // sessionStorage.setItem('menuValue', subMenus.menuValue);
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        resMenu.subMenus?.map((subMenu: SubMenu) => {
          // alert(JSON.stringify(subMenu));
          if (subMenu.menuValue === subMenus.menuValue) {
            subMenus.showSubSubRoute = !subMenus.showSubSubRoute;
          } else {
            subMenu.showSubSubRoute = false;
          }
        });

        /*
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {

          menu.showSubRoute = !menu.showSubRoute;

          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }

        */
      });
    });
  }

  ngOnDestroy(): void {
    this.data.resetData();
  }
  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
}


