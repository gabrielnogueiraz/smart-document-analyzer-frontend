import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { Analysis } from 'src/app/core/models/analysis.model';

@Component({
  selector: 'app-analysis-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideIconsModule,
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
                <lucide-angular name="arrow-left" size="20" class="text-ibm-gray-600"></lucide-angular>
              </button>
              <h1 class="text-xl font-light text-ibm-gray-900">
                {{ analysis?.document?.title || 'Análise' }}
              </h1>
            </div>
            
            <div class="flex space-x-2">
              <button
                (click)="copyAnalysis()"
                class="flex items-center space-x-2 text-ibm-gray-600 hover:text-ibm-gray-900 transition-colors"
              >
                <lucide-angular *ngIf="!analysisCopied" name="copy" size="20"></lucide-angular>
                <lucide-angular *ngIf="analysisCopied" name="check" size="20" class="text-green-600"></lucide-angular>
                <span>{{ analysisCopied ? 'Copiado!' : 'Copiar' }}</span>
              </button>
              <button
                (click)="exportAnalysis()"
                class="flex items-center space-x-2 text-ibm-gray-600 hover:text-ibm-gray-900 transition-colors"
              >
                <lucide-angular name="download" size="20"></lucide-angular>
                <span>Exportar</span>
              </button>
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
            message="Carregando análise..."
          ></app-loading-spinner>
        </div>

        <!-- Analysis Content -->
        <div *ngIf="!isLoading && analysis" class="space-y-8">
          <!-- Analysis Info -->
          <div class="ibm-card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="p-3 bg-purple-100 rounded-ibm mr-4">
                  <lucide-angular name="bar-chart-3" size="24" class="text-ibm-purple"></lucide-angular>
                </div>
                <div>
                  <h2 class="ibm-heading-2">Análise de IA</h2>
                  <p class="text-ibm-gray-600">{{ analysis.document?.title }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-ibm-gray-600">
                  <lucide-angular name="calendar" size="16" class="inline mr-1"></lucide-angular>
                  {{ formatDate(analysis.createdAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4 flex items-center">
              <lucide-angular name="sparkles" size="20" class="mr-2 text-ibm-purple"></lucide-angular>
              Resumo
            </h3>
            <div class="prose max-w-none">
              <p class="ibm-body text-ibm-gray-900 leading-relaxed">{{ analysis.summary }}</p>
            </div>
          </div>

          <!-- Topics -->
          <div *ngIf="analysis.topics.length > 0" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4">Tópicos Identificados</h3>
            <div class="flex flex-wrap gap-2">
              <span
                *ngFor="let topic of analysis.topics"
                class="px-3 py-1 bg-ibm-purple text-white text-sm rounded-ibm"
              >
                {{ topic }}
              </span>
            </div>
          </div>

          <!-- Insights -->
          <div *ngIf="analysis.insights" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4">Insights e Observações</h3>
            <div class="prose max-w-none">
              <p class="ibm-body text-ibm-gray-900 leading-relaxed">{{ analysis.insights }}</p>
            </div>
          </div>

          <!-- Document Reference -->
          <div *ngIf="analysis.document" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4">Documento Original</h3>
            <div class="flex items-center">
              <lucide-angular name="file-text" size="24" class="text-red-600 mr-3"></lucide-angular>
              <div>
                <h4 class="ibm-heading-3">{{ analysis.document.title }}</h4>
                <p class="text-sm text-ibm-gray-600">{{ analysis.document.filename }}</p>
              </div>
              <button
                (click)="viewDocument(analysis.document.id)"
                class="ml-auto ibm-button-secondary"
              >
                Ver Documento
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center">
            <button
              (click)="deleteAnalysis()"
              class="bg-red-600 text-white px-4 py-2 rounded-ibm hover:bg-red-700 transition-colors"
            >
              Excluir Análise
            </button>
            
            <div class="flex space-x-4">
              <button
                (click)="createNewAnalysis()"
                class="ibm-button-primary flex items-center space-x-2"
              >
                <lucide-angular name="sparkles" size="20"></lucide-angular>
                <span>Nova Análise</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .prose {
      color: #161616;
    }
  `]
})
export class AnalysisDetailComponent implements OnInit, OnDestroy {
  analysis: Analysis | null = null;
  isLoading = true;
  analysisCopied = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analysisService: AnalysisService
  ) {}

  ngOnInit(): void {
    const analysisId = this.route.snapshot.paramMap.get('id');
    if (analysisId) {
      this.loadAnalysis(analysisId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnalysis(id: string): void {
    this.analysisService.getAnalysis(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analysis: any) => {
          this.analysis = analysis;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar análise:', error);
          this.isLoading = false;
        }
      });
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

  copyAnalysis(): void {
    if (this.analysis) {
      const analysisText = this.formatAnalysisForCopy();
      navigator.clipboard.writeText(analysisText).then(() => {
        this.analysisCopied = true;
        setTimeout(() => {
          this.analysisCopied = false;
        }, 2000);
      });
    }
  }

  private formatAnalysisForCopy(): string {
    if (!this.analysis) return '';
    
    let text = `# Análise de IA\n\n`;
    text += `**Documento:** ${this.analysis.document?.title || 'N/A'}\n`;
    text += `**Data:** ${this.formatDate(this.analysis.createdAt)}\n\n`;
    text += `## Resumo\n\n${this.analysis.summary}\n\n`;
    
    if (this.analysis.topics.length > 0) {
      text += `## Tópicos\n\n`;
      this.analysis.topics.forEach((topic: any) => {
        text += `- ${topic}\n`;
      });
      text += `\n`;
    }
    
    if (this.analysis.insights) {
      text += `## Insights\n\n${this.analysis.insights}\n`;
    }
    
    return text;
  }

  exportAnalysis(): void {
    if (this.analysis) {
      const analysisText = this.formatAnalysisForCopy();
      const blob = new Blob([analysisText], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analise-${this.analysis.id}.md`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  viewDocument(documentId: string): void {
    this.router.navigate(['/documents', documentId]);
  }

  createNewAnalysis(): void {
    this.router.navigate(['/analysis/create']);
  }

  deleteAnalysis(): void {
    if (this.analysis && confirm('Tem certeza que deseja excluir esta análise?')) {
      this.analysisService.deleteAnalysis(this.analysis.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/analysis']);
          },
          error: (error: any) => {
            console.error('Erro ao excluir análise:', error);
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/analysis']);
  }
}
