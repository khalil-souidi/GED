import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { DocumentService } from 'src/app/services/document/document.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {

  documentTypeData: any[] = [];
  view: [number, number] = [700, 400];  // Correctly typed as a tuple
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Right;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.documentService.getDocumentTypeStatistics().subscribe({
      next: (stats) => {
        this.documentTypeData = stats.map(stat => ({
          name: stat.type,
          value: stat.count
        }));
      },
      error: (err) => console.error('Error loading statistics', err)
    });
  }

}
