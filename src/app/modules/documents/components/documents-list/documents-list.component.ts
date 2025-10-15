import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { DocumentService } from 'src/app/core/services/document.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { Document } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-documents-list',
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
                Documentos
              </h1>
            </div>
            
            <button
              (click)="navigateToUpload()"
              class="ibm-button-primary flex items-center space-x-2"
            >
              <lucide-angular name="plus" size="20" ></lucide-angular>
              <span>Novo Documento</span>
            </button>
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
                (ngModelChange)="filterDocuments()"
                placeholder="Buscar documentos..."
                class="ibm-input pl-10"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando documentos..."
          ></app-loading-spinner>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && filteredDocuments.length === 0"
          icon="file"
          title="Nenhum documento encontrado"
          description="Faça upload do seu primeiro documento para começar a análise."
        >
          <button
            (click)="navigateToUpload()"
            class="ibm-button-primary"
          >
            <lucide-angular name="plus" size="20" class="mr-2" ></lucide-angular>
            Upload de Documento
          </button>
        </app-empty-state>

        <!-- Documents Grid -->
        <div *ngIf="!isLoading && filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let document of filteredDocuments"
            class="ibm-card p-6 hover:shadow-ibm-lg transition-all duration-200"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="p-3 bg-red-100 rounded-ibm mr-3">
                  <lucide-angular name="file-text" size="24" class="text-red-600" ></lucide-angular>
                </div>
                <div>
                  <h3 class="ibm-heading-3 text-ibm-gray-900">{{ document.title }}</h3>
                  <p class="text-sm text-ibm-gray-600">{{ document.filename }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-ibm-gray-600">
                <lucide-angular name="hard-drive" size="16" class="mr-2" ></lucide-angular>
                <span>{{ formatFileSize(document.fileSize) }}</span>
              </div>
              <div class="flex items-center text-sm text-ibm-gray-600">
                <lucide-angular name="calendar" size="16" class="mr-2" ></lucide-angular>
                <span>{{ formatDate(document.uploadedAt) }}</span>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                (click)="viewDocument(document.id)"
                class="flex-1 ibm-button-secondary text-sm py-2"
              >
                <lucide-angular name="eye" size="16" class="mr-1" ></lucide-angular>
                Ver
              </button>
              <button
                (click)="analyzeDocument(document.id)"
                class="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded-ibm hover:bg-green-700 transition-colors"
              >
                <lucide-angular name="bar-chart-3" size="16" class="mr-1" ></lucide-angular>
                Analisar
              </button>
              <button
                (click)="deleteDocument(document.id)"
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
  styles: []
})
export class DocumentsListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  searchTerm = '';
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocuments(): void {
    this.documentService.getDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (documents: any) => {
          this.documents = documents;
          this.filteredDocuments = documents;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar documentos:', error);
          this.isLoading = false;
        }
      });
  }

  filterDocuments(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocuments = this.documents;
    } else {
      this.filteredDocuments = this.documents.filter(doc =>
        doc.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.filename.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToUpload(): void {
    this.router.navigate(['/documents/upload']);
  }

  viewDocument(id: string): void {
    this.router.navigate(['/documents', id]);
  }

  analyzeDocument(id: string): void {
    this.router.navigate(['/analysis'], { queryParams: { documentId: id } });
  }

  deleteDocument(id: string): void {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      this.documentService.deleteDocument(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadDocuments();
          },
          error: (error: any) => {
            console.error('Erro ao excluir documento:', error);
          }
        });
    }
  }
}
