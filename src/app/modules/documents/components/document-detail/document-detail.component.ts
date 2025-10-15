import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { DocumentService } from 'src/app/core/services/document.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { Document, DocumentText } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-document-detail',
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
                <lucide-angular name="arrow-left" size="20" class="text-ibm-gray-600" ></lucide-angular>
              </button>
              <h1 class="text-xl font-light text-ibm-gray-900">
                {{ document?.title || 'Carregando...' }}
              </h1>
            </div>
            
            <button
              *ngIf="document"
              (click)="analyzeDocument()"
              class="ibm-button-primary flex items-center space-x-2"
            >
              <lucide-angular name="bar-chart-3" size="20" ></lucide-angular>
              <span>Analisar com IA</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando documento..."
          ></app-loading-spinner>
        </div>

        <!-- Document Info -->
        <div *ngIf="!isLoading && document" class="mb-8">
          <div class="ibm-card p-6">
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center">
                <div class="p-4 bg-red-100 rounded-ibm mr-4">
                  <lucide-angular name="file-text" size="32" class="text-red-600" ></lucide-angular>
                </div>
                <div>
                  <h2 class="ibm-heading-2">{{ document.title }}</h2>
                  <p class="text-ibm-gray-600">{{ document.filename }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center text-ibm-gray-600">
                <lucide-angular name="hard-drive" size="20" class="mr-3" ></lucide-angular>
                <span>{{ formatFileSize(document.fileSize) }}</span>
              </div>
              <div class="flex items-center text-ibm-gray-600">
                <lucide-angular name="calendar" size="20" class="mr-3" ></lucide-angular>
                <span>{{ formatDate(document.uploadedAt) }}</span>
              </div>
              <div class="flex items-center text-ibm-gray-600">
                <span class="text-sm">{{ document.mimeType }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Extracted Text -->
        <div *ngIf="!isLoading && documentText" class="mb-8">
          <div class="ibm-card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="ibm-heading-3">Texto Extraído</h3>
              <button
                (click)="copyText()"
                class="flex items-center space-x-2 text-ibm-blue hover:text-blue-700 transition-colors"
              >
                <lucide-angular name="copy" *ngIf="!textCopied" size="16" ></lucide-angular>
                <lucide-angular name="check" *ngIf="textCopied" size="16" class="text-green-600" ></lucide-angular>
                <span class="text-sm">{{ textCopied ? 'Copiado!' : 'Copiar' }}</span>
              </button>
            </div>
            
            <div class="bg-ibm-gray-50 rounded-ibm p-4 max-h-96 overflow-y-auto">
              <pre class="whitespace-pre-wrap text-sm text-ibm-gray-900 font-mono">{{ documentText.text }}</pre>
            </div>
            
            <p class="text-xs text-ibm-gray-500 mt-2">
              Extraído em: {{ formatDate(documentText.extractedAt) }}
            </p>
          </div>
        </div>

        <!-- No Text Extracted -->
        <div *ngIf="!isLoading && document && !documentText" class="mb-8">
          <div class="ibm-card p-6 text-center">
            <div class="mx-auto h-16 w-16 bg-ibm-gray-100 rounded-ibm flex items-center justify-center mb-4">
              <lucide-angular name="file-text" size="32" class="text-ibm-gray-400" ></lucide-angular>
            </div>
            <h3 class="ibm-heading-3 mb-2">Texto não extraído</h3>
            <p class="ibm-body text-ibm-gray-600">
              O texto deste documento ainda não foi extraído. 
              Isso pode acontecer com documentos escaneados ou com formatação complexa.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div *ngIf="!isLoading && document" class="flex space-x-4">
          <button
            (click)="analyzeDocument()"
            class="ibm-button-primary flex items-center space-x-2"
          >
            <lucide-angular name="bar-chart-3" size="20" ></lucide-angular>
            <span>Analisar com IA</span>
          </button>
          
          <button
            (click)="deleteDocument()"
            class="bg-red-600 text-white px-4 py-2 rounded-ibm hover:bg-red-700 transition-colors"
          >
            Excluir Documento
          </button>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: Document | null = null;
  documentText: DocumentText | null = null;
  isLoading = true;
  textCopied = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.loadDocument(documentId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocument(id: string): void {
    // Load document info
    this.documentService.getDocument(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (document: any) => {
          this.document = document;
        },
        error: (error: any) => {
          console.error('Erro ao carregar documento:', error);
          this.isLoading = false;
        }
      });

    // Load document text
    this.documentService.getDocumentText(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (text: any) => {
          this.documentText = text;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar texto do documento:', error);
          this.isLoading = false;
        }
      });
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  copyText(): void {
    if (this.documentText) {
      navigator.clipboard.writeText(this.documentText.text).then(() => {
        this.textCopied = true;
        setTimeout(() => {
          this.textCopied = false;
        }, 2000);
      });
    }
  }

  analyzeDocument(): void {
    if (this.document) {
      this.router.navigate(['/analysis'], { queryParams: { documentId: this.document.id } });
    }
  }

  deleteDocument(): void {
    if (this.document && confirm('Tem certeza que deseja excluir este documento?')) {
      this.documentService.deleteDocument(this.document.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/documents']);
          },
          error: (error: any) => {
            console.error('Erro ao excluir documento:', error);
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }
}
