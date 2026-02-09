import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexResponsive,
} from 'ng-apexcharts';
import { routes } from 'src/app/core/helpers/routes/routes';
import { TableauBordService } from 'src/app/core/services/tableauBord/tableaubord.service';
import { entreeSortieStockService } from "src/app/core/services/entree-sortie-stock/entree-sortie-stock.service";
import { MatTableDataSource } from '@angular/material/table';
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis | ApexYAxis[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | any;
  public chartOptions2: Partial<ChartOptions> | any;
  public chartOptions1: Partial<ChartOptions> | any;
  public layoutWidth = '1';
  public routes = routes;

  public lstEtatStock: Array<any> = [];
  public serialNumberArray: Array<number> = [];
  dataSource!: MatTableDataSource<any>;

    // Pagination
    public pageSize = 10;
    public totalData = 0;
    public skip = 0;
    public limit: number = this.pageSize;
    public pageIndex = 0;
    public currentPage = 1;
    public pageNumberArray: Array<number> = [];
    public pageSelection: Array<any> = [];
    public totalPages = 0;

  dataTableauBord: any = [];
  constructor(private tableauBordService: TableauBordService, private entreeSortieStockService: entreeSortieStockService) {
    this.chartOptions2 = {
      series: [
        {
          name: 'Total Income',
          data: [120, 90, 60, 90, 60, 90, 120],
          color: '#ff9b44',
        },
        {
          name: 'Total Outcome',
          data: [85, 75, 57, 85, 61, 75, 85],
          color: '#fc6075',
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['2006', '2008', '2010', '2012', '2013', '2014'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
    };
    this.chartOptions1 = {
      series: [
        {
          name: 'series1',
          data: [50, 75, 50, 75, 50, 75, 100],
          color: '#ff9b44',
        },
        {
          name: 'series2',
          data: [95, 70, 40, 65, 40, 45, 41],
          color: '#fc6075',
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
    };
  }
  ngOnInit(): void {
    this.getTableauBord();
  }

  getTableauBord() {
    this.lstEtatStock = [];
    this.serialNumberArray = [];
    this.tableauBordService.getDataTableauBordStock().subscribe(
      (data: any) => {
        // alert(JSON.stringify(data.data));
        this.dataTableauBord = data.data;
      },
      (error: any) => {}
    );

    this.entreeSortieStockService.getAllStock().subscribe({
      next: (res: any) => {
        // 1. Récupération des données
        const data = res.data || [];
    
        // 2. Tri par criticité : 
        // On calcule le ratio (quantité / seuil). Plus le ratio est petit, plus c'est critique.
        // Les articles en rupture (quantité <= 0) apparaîtront en premier.
        const sortedData = data.sort((a: any, b: any) => {
          const ratioA = a.seuil_alerte > 0 ? a.quantite / a.seuil_alerte : 1;
          const ratioB = b.seuil_alerte > 0 ? b.quantite / b.seuil_alerte : 1;
          return ratioA - ratioB;
        });
    
        // 3. Limiter aux 10 premiers
        this.lstEtatStock = sortedData.slice(0, 10);
        
        // 4. Mise à jour de la table et pagination
        this.totalData = this.lstEtatStock.length;
        this.dataSource = new MatTableDataSource<any>(this.lstEtatStock);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
      error: (err) => console.error("Erreur lors de la récupération du stock", err)
    });

  }



  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: (i - 1) * pageSize, limit: i * pageSize });
    }
  }

}
