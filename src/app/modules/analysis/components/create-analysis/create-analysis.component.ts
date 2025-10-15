import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { DocumentService } from 'src/app/core/services/document.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Document } from 'src/app/core/models/document.model';
import { CreateAnalysisRequest } from 'src/app/core/models/analysis.model';

@Component({
  selector: 'app-create-analysis',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
                Nova Análise
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Document Selection -->
        <div *ngIf="!selectedDocument" class="mb-8">
          <h2 class="ibm-heading-2 mb-4">Selecionar Documento</h2>
          <div class="ibm-card p-6">
            <div *ngIf="isLoadingDocuments" class="flex justify-center py-8">
              <app-loading-spinner [size]="32" message="Carregando documentos..."></app-loading-spinner>
            </div>
            
            <div *ngIf="!isLoadingDocuments && documents.length === 0" class="text-center py-8">
              <lucide-angular name="file-text" size="48" class="text-ibm-gray-400 mx-auto mb-4" ></lucide-angular>
              <h3 class="ibm-heading-3 mb-2">Nenhum documento encontrado</h3>
              <p class="ibm-body text-ibm-gray-600 mb-4">
                Faça upload de um documento primeiro para poder analisá-lo.
              </p>
              <button
                (click)="navigateToDocuments()"
                class="ibm-button-primary"
              >
                Ir para Documentos
              </button>
            </div>

            <div *ngIf="!isLoadingDocuments && documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                *ngFor="let doc of documents"
                (click)="selectDocument(doc)"
                class="p-4 border border-ibm-gray-200 rounded-ibm hover:border-ibm-blue hover:bg-blue-50 cursor-pointer transition-all duration-200"
              >
                <div class="flex items-center mb-2">
                  <lucide-angular name="file-text" size="20" class="text-red-600 mr-3" ></lucide-angular>
                  <h4 class="ibm-heading-3">{{ doc.title }}</h4>
                </div>
                <p class="text-sm text-ibm-gray-600">{{ doc.filename }}</p>
                <p class="text-xs text-ibm-gray-500 mt-1">
                  {{ formatDate(doc.uploadedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Analysis Form -->
        <div *ngIf="selectedDocument" class="space-y-8">
          <!-- Selected Document -->
          <div class="ibm-card p-6">
            <h2 class="ibm-heading-2 mb-4">Documento Selecionado</h2>
            <div class="flex items-center">
              <lucide-angular name="file-text" size="24" class="text-red-600 mr-3" ></lucide-angular>
              <div>
                <h3 class="ibm-heading-3">{{ selectedDocument.title }}</h3>
                <p class="text-sm text-ibm-gray-600">{{ selectedDocument.filename }}</p>
              </div>
              <button
                (click)="selectedDocument = null"
                class="ml-auto text-ibm-gray-400 hover:text-ibm-gray-600"
              >
                <lucide-angular name="x" size="20" ></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Analysis Configuration -->
          <form [formGroup]="analysisForm" (ngSubmit)="createAnalysis()" class="space-y-6">
            <div class="ibm-card p-6">
              <h3 class="ibm-heading-3 mb-4">Configuração da Análise</h3>
              
              <!-- Groq API Key -->
              <div class="mb-6">
                <label for="groqApiKey" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                  <lucide-angular name="key" size="16" class="inline mr-2" ></lucide-angular>
                  Chave da API Groq *
                </label>
                <input
                  id="groqApiKey"
                  type="password"
                  formControlName="groqApiKey"
                  class="ibm-input"
                  placeholder="gsk_..."
                  [class.border-red-500]="analysisForm.get('groqApiKey')?.invalid && analysisForm.get('groqApiKey')?.touched"
                />
                <div *ngIf="analysisForm.get('groqApiKey')?.invalid && analysisForm.get('groqApiKey')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  <p *ngIf="analysisForm.get('groqApiKey')?.errors?.['required']">Chave da API é obrigatória</p>
                </div>
                <p class="text-xs text-ibm-gray-500 mt-1">
                  Obtenha sua chave gratuita em 
                  <a href="https://console.groq.com/keys" target="_blank" class="text-ibm-blue hover:underline">
                    console.groq.com
                  </a>
                </p>
              </div>

              <!-- Custom Prompt -->
              <div class="mb-6">
                <label for="customPrompt" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                  <lucide-angular name="sparkles" size="16" class="inline mr-2" ></lucide-angular>
                  Prompt Personalizado (Opcional)
                </label>
                <textarea
                  id="customPrompt"
                  formControlName="customPrompt"
                  rows="4"
                  class="ibm-input resize-none"
                  placeholder="Descreva como você gostaria que o documento fosse analisado..."
                ></textarea>
                <p class="text-xs text-ibm-gray-500 mt-1">
                  Deixe em branco para usar o prompt padrão de análise
                </p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                (click)="goBack()"
                class="px-4 py-2 text-ibm-gray-600 hover:text-ibm-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="analysisForm.invalid || isCreating"
                class="ibm-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <app-loading-spinner 
                  *ngIf="isCreating" 
                  [size]="20" 
                  message=""
                  containerClass="!p-0"
                ></app-loading-spinner>
                <span *ngIf="!isCreating">
                  <lucide-angular name="sparkles" size="20" class="mr-2" ></lucide-angular>
                  Iniciar Análise
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class CreateAnalysisComponent implements OnInit, OnDestroy {
  analysisForm: FormGroup;
  documents: Document[] = [];
  selectedDocument: Document | null = null;
  isLoadingDocuments = true;
  isCreating = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private analysisService: AnalysisService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.analysisForm = this.fb.group({
      groqApiKey: ['', [Validators.required]],
      customPrompt: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
    
    // Check if documentId is provided in query params
    const documentId = this.route.snapshot.queryParamMap.get('documentId');
    if (documentId) {
      this.loadDocumentById(documentId);
    }
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
          this.isLoadingDocuments = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar documentos:', error);
          this.isLoadingDocuments = false;
        }
      });
  }

  private loadDocumentById(id: string): void {
    this.documentService.getDocument(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (document: any) => {
          this.selectedDocument = document;
        },
        error: (error: any) => {
          console.error('Erro ao carregar documento:', error);
        }
      });
  }

  selectDocument(document: Document): void {
    this.selectedDocument = document;
  }

  createAnalysis(): void {
    if (this.analysisForm.valid && this.selectedDocument) {
      this.isCreating = true;
      
      const request: CreateAnalysisRequest = {
        documentId: this.selectedDocument.id,
        groqApiKey: this.analysisForm.value.groqApiKey,
        customPrompt: this.analysisForm.value.customPrompt || undefined
      };

      this.analysisService.createAnalysis(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (analysis: any) => {
            this.snackBar.open('Análise criada com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['ibm-success-snackbar']
            });
            this.router.navigate(['/analysis', analysis.id]);
          },
            error: (error: any) => {
            this.isCreating = false;
            this.snackBar.open('Erro ao criar análise. Verifique sua chave da API.', 'Fechar', {
              duration: 5000,
              panelClass: ['ibm-error-snackbar']
            });
          }
        });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  navigateToDocuments(): void {
    this.router.navigate(['/documents']);
  }

  goBack(): void {
    this.router.navigate(['/analysis']);
  }
}
