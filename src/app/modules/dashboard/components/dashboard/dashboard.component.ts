import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { User, UserStats } from 'src/app/core/models/user.model';
import { AnalysisStats } from 'src/app/core/models/analysis.model';

@Component({
  selector: 'app-dashboard',
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
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-ibm-blue rounded-ibm flex items-center justify-center">
                  <lucide-angular name="file-text" size="20" class="text-white" ></lucide-angular>
                </div>
              </div>
              <h1 class="ml-3 text-xl font-light text-ibm-gray-900">
                Smart Document Analyzer
              </h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-sm text-ibm-gray-600">
                Olá, {{ currentUser?.name || 'Usuário' }}
              </span>
              <button
                (click)="logout()"
                class="text-sm text-ibm-gray-600 hover:text-ibm-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="ibm-heading-1">Dashboard</h2>
          <p class="ibm-body text-ibm-gray-600">
            Bem-vindo ao Smart Document Analyzer. Analise seus documentos com inteligência artificial.
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando estatísticas..."
          ></app-loading-spinner>
        </div>

        <!-- Stats Grid -->
        <div *ngIf="!isLoading" class="ibm-grid mb-8">
          <app-stat-card
            icon="file-text"
            label="Total de Documentos"
            [value]="userStats?.documents || 0"
            color="blue"
          ></app-stat-card>
          
          <app-stat-card
            icon="bar-chart-3"
            label="Análises Realizadas"
            [value]="userStats?.analyses || 0"
            color="purple"
          ></app-stat-card>
          
          <app-stat-card
            icon="trending-up"
            label="Análises Recentes"
            [value]="analysisStats?.recentAnalyses || 0"
            color="green"
          ></app-stat-card>
        </div>

        <!-- Quick Actions -->
        <div *ngIf="!isLoading" class="mb-8">
          <h3 class="ibm-heading-2 mb-4">Ações Rápidas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              (click)="navigateToDocuments()"
              class="ibm-card p-6 text-left hover:shadow-ibm-lg transition-all duration-200 group"
            >
              <div class="flex items-center mb-4">
                <div class="p-3 bg-blue-100 rounded-ibm mr-4">
                  <lucide-angular name="upload" size="24" class="text-ibm-blue" ></lucide-angular>
                </div>
                <h4 class="ibm-heading-3">Upload de Documento</h4>
              </div>
              <p class="ibm-body text-ibm-gray-600">
                Faça upload de um novo documento PDF para análise
              </p>
            </button>

            <button
              (click)="navigateToAnalysis()"
              class="ibm-card p-6 text-left hover:shadow-ibm-lg transition-all duration-200 group"
            >
              <div class="flex items-center mb-4">
                <div class="p-3 bg-purple-100 rounded-ibm mr-4">
                  <lucide-angular name="bar-chart-3" size="24" class="text-ibm-purple" ></lucide-angular>
                </div>
                <h4 class="ibm-heading-3">Ver Análises</h4>
              </div>
              <p class="ibm-body text-ibm-gray-600">
                Visualize e gerencie suas análises realizadas
              </p>
            </button>

            <button
              (click)="navigateToProfile()"
              class="ibm-card p-6 text-left hover:shadow-ibm-lg transition-all duration-200 group"
            >
              <div class="flex items-center mb-4">
                <div class="p-3 bg-green-100 rounded-ibm mr-4">
                  <lucide-angular name="user" size="24" class="text-green-600" ></lucide-angular>
                </div>
                <h4 class="ibm-heading-3">Perfil</h4>
              </div>
              <p class="ibm-body text-ibm-gray-600">
                Gerencie suas informações pessoais
              </p>
            </button>
          </div>
        </div>


        <!-- Analysis Stats Chart -->
        <div *ngIf="!isLoading && analysisStats?.mostFrequentTopics?.length" class="mb-8">
          <h3 class="ibm-heading-2 mb-4">Tópicos Mais Analisados</h3>
          <div class="ibm-card p-6">
            <div class="space-y-4">
              <div
                *ngFor="let topic of analysisStats?.mostFrequentTopics || []"
                class="flex items-center justify-between"
              >
                <span class="text-ibm-gray-900 font-medium">{{ topic.topic }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-ibm-gray-200 rounded-full h-2">
                    <div
                      class="bg-ibm-blue h-2 rounded-full"
                      [style.width.%]="(topic.count / maxTopicCount) * 100"
                    ></div>
                  </div>
                  <span class="text-sm text-ibm-gray-600 w-8">{{ topic.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userStats: UserStats | null = null;
  analysisStats: AnalysisStats | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private analysisService: AnalysisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  private loadStats(): void {
    // Load user stats
    this.userService.getUserStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats: any) => {
          this.userStats = stats;
        },
        error: (error: any) => {
          console.error('Erro ao carregar estatísticas do usuário:', error);
        }
      });

    // Load analysis stats
    this.analysisService.getAnalysisStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats: any) => {
          this.analysisStats = stats;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar estatísticas de análise:', error);
          this.isLoading = false;
        }
      });
  }

  get maxTopicCount(): number {
    if (!this.analysisStats?.mostFrequentTopics?.length) return 0;
    return Math.max(...this.analysisStats.mostFrequentTopics.map((t: any) => t.count));
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDocuments(): void {
    this.router.navigate(['/documents']);
  }

  navigateToAnalysis(): void {
    this.router.navigate(['/analysis']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
