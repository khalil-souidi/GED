import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document/document.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {

  chartData: any[] = [];
  view: [number, number] = [700, 400];  // Correctly typed as a tuple
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Right;

  selectedStatsType: string = 'type'; // Default to type statistics

  constructor(private documentService: DocumentService, private router: Router) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    if (this.selectedStatsType === 'type') {
      this.documentService.getDocumentTypeStatistics().subscribe({
        next: (stats) => {
          this.chartData = stats.map(stat => ({
            name: stat.type,
            value: stat.count
          }));
        },
        error: (err) => console.error('Error loading document type statistics', err)
      });
    } else if (this.selectedStatsType === 'department') {
      this.documentService.getDocumentDepartmentStatistics().subscribe({
        next: (stats) => {
          this.chartData = stats.map(stat => ({
            name: stat.department,
            value: stat.count
          }));
        },
        error: (err) => console.error('Error loading department statistics', err)
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
