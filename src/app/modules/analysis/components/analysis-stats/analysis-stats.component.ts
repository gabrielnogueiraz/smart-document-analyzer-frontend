import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { AnalysisStats } from 'src/app/core/models/analysis.model';

@Component({
  selector: 'app-analysis-stats',
  standalone: true,
  imports: [
    CommonModule,
    LucideIconsModule,
    StatCardComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="min-h-screen bg-ibm-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-ibm border-b border-ibm-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <button
                (click)="goBack()"
                class="mr-4 p-2 hover:bg-ibm-gray-100 rounded-ibm transition-colors"
              >
                <lucide-angular name="arrow-left" size="20" class="text-ibm-gray-600" ></lucide-angular>
              </button>
              <h1 class="text-xl font-light text-ibm-gray-900">
                Estatísticas de Análise
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando estatísticas..."
          ></app-loading-spinner>
        </div>

        <!-- Stats Content -->
        <div *ngIf="!isLoading && stats" class="space-y-8">
          <!-- Overview Cards -->
          <div class="ibm-grid">
            <app-stat-card
              icon="bar-chart-3"
              label="Total de Análises"
              [value]="stats.totalAnalyses"
              color="blue"
            ></app-stat-card>
            
            <app-stat-card
              icon="trending-up"
              label="Análises Recentes"
              [value]="stats.recentAnalyses"
              color="green"
            ></app-stat-card>
          </div>

          <!-- Topics Chart -->
          <div *ngIf="stats.mostFrequentTopics.length > 0" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-6">Tópicos Mais Frequentes</h3>
            
            <div class="space-y-4">
              <div
                *ngFor="let topic of stats.mostFrequentTopics; let i = index"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-ibm-purple text-white rounded-ibm flex items-center justify-center text-sm font-medium mr-4">
                    {{ i + 1 }}
                  </div>
                  <span class="text-ibm-gray-900 font-medium">{{ topic.topic }}</span>
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="w-48 bg-ibm-gray-200 rounded-full h-3">
                    <div
                      class="bg-ibm-purple h-3 rounded-full transition-all duration-500"
                      [style.width.%]="getTopicPercentage(topic.count)"
                    ></div>
                  </div>
                  <span class="text-sm text-ibm-gray-600 w-8 text-right">{{ topic.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="stats.mostFrequentTopics.length === 0" class="ibm-card p-12 text-center">
            <div class="mx-auto h-16 w-16 bg-ibm-gray-100 rounded-ibm flex items-center justify-center mb-4">
              <lucide-angular name="bar-chart-3" size="32" class="text-ibm-gray-400" ></lucide-angular>
            </div>
            <h3 class="ibm-heading-3 mb-2">Nenhuma análise encontrada</h3>
            <p class="ibm-body text-ibm-gray-600 mb-6">
              Crie sua primeira análise para ver estatísticas detalhadas.
            </p>
            <button
              (click)="navigateToCreate()"
              class="ibm-button-primary"
            >
              <lucide-angular name="sparkles" size="20" class="mr-2" ></lucide-angular>
              Nova Análise
            </button>
          </div>

          <!-- Insights -->
          <div *ngIf="stats.mostFrequentTopics.length > 0" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4">Insights</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-blue-50 rounded-ibm">
                <h4 class="font-medium text-ibm-gray-900 mb-2">Tópico Principal</h4>
                <p class="text-sm text-ibm-gray-600">
                  "{{ stats.mostFrequentTopics[0].topic }}" é o tópico mais analisado,
                  aparecendo em {{ stats.mostFrequentTopics[0].count }} análises.
                </p>
              </div>
              
              <div class="p-4 bg-green-50 rounded-ibm">
                <h4 class="font-medium text-ibm-gray-900 mb-2">Diversidade</h4>
                <p class="text-sm text-ibm-gray-600">
                  Você tem {{ stats.mostFrequentTopics.length }} tópicos únicos 
                  em suas análises, mostrando boa diversidade de conteúdo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AnalysisStatsComponent implements OnInit, OnDestroy {
  stats: AnalysisStats | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private analysisService: AnalysisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    this.analysisService.getAnalysisStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats: any) => {
          this.stats = stats;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar estatísticas:', error);
          this.isLoading = false;
        }
      });
  }

  getTopicPercentage(count: number): number {
    if (!this.stats?.mostFrequentTopics.length) return 0;
    const maxCount = Math.max(...this.stats.mostFrequentTopics.map((t: any) => t.count));
    return (count / maxCount) * 100;
  }

  navigateToCreate(): void {
    this.router.navigate(['/analysis/create']);
  }

  goBack(): void {
    this.router.navigate(['/analysis']);
  }
}
