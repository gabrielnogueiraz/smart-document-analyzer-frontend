import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { DocumentService } from 'src/app/core/services/document.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload',
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
                Upload de Documento
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Upload Area -->
        <div class="ibm-card p-8">
          <div
            class="border-2 border-dashed border-ibm-gray-300 rounded-ibm p-12 text-center hover:border-ibm-blue transition-colors"
            [class.border-ibm-blue]="isDragOver"
            [class.bg-blue-50]="isDragOver"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input
              #fileInput
              type="file"
              accept=".pdf"
              (change)="onFileSelected($event)"
              class="hidden"
            />
            
            <div *ngIf="!selectedFile && !isUploading">
              <div class="mx-auto h-16 w-16 bg-ibm-gray-100 rounded-ibm flex items-center justify-center mb-4">
                <lucide-angular name="upload" size="32" class="text-ibm-gray-400" ></lucide-angular>
              </div>
              <h3 class="ibm-heading-3 mb-2">Arraste e solte seu PDF aqui</h3>
              <p class="ibm-body text-ibm-gray-600 mb-4">
                ou clique para selecionar um arquivo
              </p>
              <p class="text-sm text-ibm-gray-500">
                Apenas arquivos PDF são aceitos
              </p>
            </div>

            <!-- Selected File -->
            <div *ngIf="selectedFile && !isUploading" class="space-y-4">
              <div class="flex items-center justify-center">
                <div class="p-3 bg-red-100 rounded-ibm mr-4">
                  <lucide-angular name="file-text" size="32" class="text-red-600" ></lucide-angular>
                </div>
                <div class="text-left">
                  <h4 class="ibm-heading-3">{{ selectedFile.name }}</h4>
                  <p class="text-sm text-ibm-gray-600">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button
                  (click)="removeFile()"
                  class="ml-4 p-2 text-ibm-gray-400 hover:text-red-600 transition-colors"
                >
                  <lucide-angular name="x" size="20" ></lucide-angular>
                </button>
              </div>
              
              <button
                (click)="uploadFile()"
                class="ibm-button-primary"
                [disabled]="isUploading"
              >
                <lucide-angular name="upload" size="20" class="mr-2" ></lucide-angular>
                Fazer Upload
              </button>
            </div>

            <!-- Uploading State -->
            <div *ngIf="isUploading" class="space-y-4">
              <app-loading-spinner 
                [size]="40" 
                message="Fazendo upload do documento..."
              ></app-loading-spinner>
              
              <div class="w-full bg-ibm-gray-200 rounded-full h-2">
                <div
                  class="bg-ibm-blue h-2 rounded-full transition-all duration-300"
                  [style.width.%]="uploadProgress"
                ></div>
              </div>
              
              <p class="text-sm text-ibm-gray-600">
                {{ uploadProgress }}% concluído
              </p>
            </div>
          </div>
        </div>

        <!-- Upload Instructions -->
        <div class="mt-8 ibm-card p-6">
          <h3 class="ibm-heading-3 mb-4">Instruções de Upload</h3>
          <div class="space-y-3">
            <div class="flex items-start">
              <lucide-angular name="check-circle" size="20" class="text-green-600 mr-3 mt-0.5 flex-shrink-0" ></lucide-angular>
              <p class="ibm-body text-ibm-gray-600">
                Apenas arquivos PDF são aceitos
              </p>
            </div>
            <div class="flex items-start">
              <lucide-angular name="check-circle" size="20" class="text-green-600 mr-3 mt-0.5 flex-shrink-0" ></lucide-angular>
              <p class="ibm-body text-ibm-gray-600">
                Tamanho máximo: 10MB por arquivo
              </p>
            </div>
            <div class="flex items-start">
              <lucide-angular name="check-circle" size="20" class="text-green-600 mr-3 mt-0.5 flex-shrink-0" ></lucide-angular>
              <p class="ibm-body text-ibm-gray-600">
                O texto será extraído automaticamente após o upload
              </p>
            </div>
            <div class="flex items-start">
              <lucide-angular name="check-circle" size="20" class="text-green-600 mr-3 mt-0.5 flex-shrink-0" ></lucide-angular>
              <p class="ibm-body text-ibm-gray-600">
                Você poderá analisar o documento com IA após o upload
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFile(target.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Validate file type
    if (file.type !== 'application/pdf') {
      this.snackBar.open('Apenas arquivos PDF são aceitos', 'Fechar', {
        duration: 5000,
        panelClass: ['ibm-error-snackbar']
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('Arquivo muito grande. Tamanho máximo: 10MB', 'Fechar', {
        duration: 5000,
        panelClass: ['ibm-error-snackbar']
      });
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.documentService.uploadDocument(this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: any) => {
          if (event.type === 1) { // HttpEventType.UploadProgress
            this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
          } else if (event.type === 4) { // HttpEventType.Response
            this.snackBar.open('Documento enviado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['ibm-success-snackbar']
            });
            this.router.navigate(['/documents']);
          }
        },
        error: (error: any) => {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.snackBar.open('Erro ao enviar documento. Tente novamente.', 'Fechar', {
            duration: 5000,
            panelClass: ['ibm-error-snackbar']
          });
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

  goBack(): void {
    this.router.navigate(['/documents']);
  }
}
