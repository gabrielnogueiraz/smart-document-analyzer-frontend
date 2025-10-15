import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { Analysis } from 'src/app/core/models/analysis.model';

@Component({
  selector: 'app-analysis-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LucideIconsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
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
                Análises
              </h1>
            </div>
            
            <div class="flex space-x-4">
              <button
                (click)="navigateToStats()"
                class="flex items-center space-x-2 text-ibm-gray-600 hover:text-ibm-gray-900 transition-colors"
              >
                <lucide-angular name="bar-chart-3" size="20" ></lucide-angular>
                <span>Estatísticas</span>
              </button>
              <button
                (click)="navigateToCreate()"
                class="ibm-button-primary flex items-center space-x-2"
              >
                <lucide-angular name="plus" size="20" ></lucide-angular>
                <span>Nova Análise</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search and Filters -->
        <div class="mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide-angular name="search" size="20" class="text-ibm-gray-400" ></lucide-angular>
              </div>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="filterAnalyses()"
                placeholder="Buscar análises..."
                class="ibm-input pl-10"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando análises..."
          ></app-loading-spinner>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && filteredAnalyses.length === 0"
          icon="search"
          title="Nenhuma análise encontrada"
          description="Crie sua primeira análise para começar a explorar seus documentos com IA."
        >
          <button
            (click)="navigateToCreate()"
            class="ibm-button-primary"
          >
            <lucide-angular name="sparkles" size="20" class="mr-2" ></lucide-angular>
            Nova Análise
          </button>
        </app-empty-state>

        <!-- Analyses Grid -->
        <div *ngIf="!isLoading && filteredAnalyses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            *ngFor="let analysis of filteredAnalyses"
            class="ibm-card p-6 hover:shadow-ibm-lg transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="p-3 bg-purple-100 rounded-ibm mr-4">
                  <lucide-angular name="bar-chart-3" size="24" class="text-ibm-purple" ></lucide-angular>
                </div>
                <div>
                  <h3 class="ibm-heading-3 text-ibm-gray-900">{{ analysis.document?.title || 'Documento' }}</h3>
                  <p class="text-sm text-ibm-gray-600">{{ formatDate(analysis.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Summary Preview -->
            <div class="mb-4">
              <p class="text-sm text-ibm-gray-700 line-clamp-3">
                {{ analysis.summary }}
              </p>
            </div>

            <!-- Topics -->
            <div *ngIf="analysis.topics.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let topic of analysis.topics.slice(0, 3)"
                  class="px-2 py-1 bg-ibm-purple text-white text-xs rounded-ibm"
                >
                  {{ topic }}
                </span>
                <span
                  *ngIf="analysis.topics.length > 3"
                  class="px-2 py-1 bg-ibm-gray-200 text-ibm-gray-600 text-xs rounded-ibm"
                >
                  +{{ analysis.topics.length - 3 }} mais
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                (click)="viewAnalysis(analysis.id)"
                class="flex-1 ibm-button-secondary text-sm py-2"
              >
                <lucide-angular name="eye" size="16" class="mr-1" ></lucide-angular>
                Ver Detalhes
              </button>
              <button
                (click)="deleteAnalysis(analysis.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-ibm transition-colors"
              >
                <lucide-angular name="trash-2" size="16" ></lucide-angular>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AnalysisListComponent implements OnInit, OnDestroy {
  analyses: Analysis[] = [];
  filteredAnalyses: Analysis[] = [];
  searchTerm = '';
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private analysisService: AnalysisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnalyses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnalyses(): void {
    this.analysisService.getAnalyses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analyses: any) => {
          this.analyses = analyses;
          this.filteredAnalyses = analyses;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar análises:', error);
          this.isLoading = false;
        }
      });
  }

  filterAnalyses(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAnalyses = this.analyses;
    } else {
      this.filteredAnalyses = this.analyses.filter(analysis =>
        analysis.summary.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        analysis.document?.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        analysis.topics.some((topic: any) => topic.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/analysis/create']);
  }

  navigateToStats(): void {
    this.router.navigate(['/analysis/stats']);
  }

  viewAnalysis(id: string): void {
    this.router.navigate(['/analysis', id]);
  }

  deleteAnalysis(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta análise?')) {
      this.analysisService.deleteAnalysis(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadAnalyses();
          },
          error: (error: any) => {
            console.error('Erro ao excluir análise:', error);
          }
        });
    }
  }
}
