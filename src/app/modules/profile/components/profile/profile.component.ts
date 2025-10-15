import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User as UserModel } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-profile',
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
                Perfil do Usuário
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <app-loading-spinner 
            [size]="40" 
            message="Carregando perfil..."
          ></app-loading-spinner>
        </div>

        <!-- Profile Content -->
        <div *ngIf="!isLoading && user" class="space-y-8">
          <!-- User Info -->
          <div class="ibm-card p-6">
            <div class="flex items-center mb-6">
              <div class="p-4 bg-ibm-blue text-white rounded-ibm mr-4">
                <lucide-angular name="user" size="32" ></lucide-angular>
              </div>
              <div>
                <h2 class="ibm-heading-2">{{ user.name }}</h2>
                <p class="text-ibm-gray-600">{{ user.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ibm-gray-600">
              <div class="flex items-center">
                <lucide-angular name="calendar" size="16" class="mr-2" ></lucide-angular>
                <span>Membro desde {{ formatDate(user.createdAt) }}</span>
              </div>
              <div class="flex items-center">
                <lucide-angular name="mail" size="16" class="mr-2" ></lucide-angular>
                <span>{{ user.email }}</span>
              </div>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="ibm-card p-6">
            <h3 class="ibm-heading-3 mb-4">Editar Perfil</h3>
            
            <div class="space-y-4">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  class="ibm-input"
                  placeholder="Seu nome completo"
                  [class.border-red-500]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched"
                />
                <div *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  <p *ngIf="profileForm.get('name')?.errors?.['required']">Nome é obrigatório</p>
                  <p *ngIf="profileForm.get('name')?.errors?.['minlength']">Nome deve ter pelo menos 2 caracteres</p>
                </div>
              </div>

              <!-- Email (readonly) -->
              <div>
                <label for="email" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  [value]="user.email"
                  class="ibm-input bg-ibm-gray-100 cursor-not-allowed"
                  readonly
                />
                <p class="text-xs text-ibm-gray-500 mt-1">
                  O email não pode ser alterado
                </p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
              <button
                type="submit"
                [disabled]="profileForm.invalid || isUpdating"
                class="ibm-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <app-loading-spinner 
                  *ngIf="isUpdating" 
                  [size]="20" 
                  message=""
                  containerClass="!p-0"
                ></app-loading-spinner>
                <span *ngIf="!isUpdating">
                  <lucide-angular name="save" size="20" class="mr-2" ></lucide-angular>
                  Salvar Alterações
                </span>
              </button>
            </div>
          </form>

          <!-- Danger Zone -->
          <div class="ibm-card p-6 border-red-200">
            <h3 class="ibm-heading-3 mb-4 text-red-600">Zona de Perigo</h3>
            <p class="ibm-body text-ibm-gray-600 mb-4">
              Ações irreversíveis que afetarão permanentemente sua conta e dados.
            </p>
            
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-ibm">
              <div>
                <h4 class="font-medium text-red-900 mb-1">Excluir Conta</h4>
                <p class="text-sm text-red-700">
                  Excluir permanentemente sua conta e todos os dados associados.
                </p>
              </div>
              <button
                (click)="deleteAccount()"
                class="bg-red-600 text-white px-4 py-2 rounded-ibm hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <lucide-angular name="trash-2" size="16" ></lucide-angular>
                <span>Excluir Conta</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: UserModel | null = null;
  profileForm: FormGroup;
  isLoading = true;
  isUpdating = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    this.userService.getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.user = user;
          this.profileForm.patchValue({
            name: user.name
          });
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar perfil:', error);
          this.isLoading = false;
        }
      });
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.user) {
      this.isUpdating = true;
      const updatedData = {
        name: this.profileForm.value.name
      };

      this.userService.updateUserProfile(updatedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser: any) => {
            this.user = updatedUser;
            this.authService.getCurrentUser(); // Refresh auth state
            this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['ibm-success-snackbar']
            });
            this.isUpdating = false;
          },
          error: (error) => {
            this.isUpdating = false;
            this.snackBar.open('Erro ao atualizar perfil. Tente novamente.', 'Fechar', {
              duration: 5000,
              panelClass: ['ibm-error-snackbar']
            });
          }
        });
    }
  }

  deleteAccount(): void {
    const confirmed = confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente.'
    );

    if (confirmed) {
      const doubleConfirmed = confirm(
        'ÚLTIMA CONFIRMAÇÃO: Digite "EXCLUIR" para confirmar a exclusão da conta.'
      );

      if (doubleConfirmed) {
        this.userService.deleteUser()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Conta excluída com sucesso.', 'Fechar', {
                duration: 3000,
                panelClass: ['ibm-success-snackbar']
              });
              this.authService.logout();
            },
            error: (error: any) => {
              this.snackBar.open('Erro ao excluir conta. Tente novamente.', 'Fechar', {
                duration: 5000,
                panelClass: ['ibm-error-snackbar']
              });
            }
          });
      }
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

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
