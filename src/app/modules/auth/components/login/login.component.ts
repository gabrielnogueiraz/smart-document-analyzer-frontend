import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideIconsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-ibm-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-ibm-blue rounded-ibm flex items-center justify-center">
            <lucide-angular name="file-text" size="24" class="text-white" ></lucide-angular>
          </div>
          <h2 class="mt-6 ibm-heading-1">Entrar</h2>
          <p class="mt-2 text-sm text-ibm-gray-600">
            Acesse sua conta do Smart Document Analyzer
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <lucide-angular name="mail" size="20" class="text-ibm-gray-400" ></lucide-angular>
                </div>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="ibm-input pl-10"
                  placeholder="seu@email.com"
                  [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                />
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="loginForm.get('email')?.errors?.['required']">Email é obrigatório</p>
                <p *ngIf="loginForm.get('email')?.errors?.['email']">Email inválido</p>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                Senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <lucide-angular name="lock" size="20" class="text-ibm-gray-400" ></lucide-angular>
                </div>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="ibm-input pl-10 pr-10"
                  placeholder="Sua senha"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <lucide-angular name="eye" *ngIf="!showPassword" size="20" class="text-ibm-gray-400 hover:text-ibm-gray-600" ></lucide-angular>
                  <lucide-angular name="eye-off" *ngIf="showPassword" size="20" class="text-ibm-gray-400 hover:text-ibm-gray-600" ></lucide-angular>
                </button>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="loginForm.get('password')?.errors?.['required']">Senha é obrigatória</p>
                <p *ngIf="loginForm.get('password')?.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full ibm-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <app-loading-spinner 
                *ngIf="isLoading" 
                [size]="20" 
                message=""
                containerClass="!p-0"
              ></app-loading-spinner>
              <span *ngIf="!isLoading">Entrar</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <p class="text-sm text-ibm-gray-600">
              Não tem uma conta?
              <a routerLink="/auth/register" class="font-medium text-ibm-blue hover:text-blue-700">
                Criar conta
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['ibm-success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao fazer login. Verifique suas credenciais.', 'Fechar', {
            duration: 5000,
            panelClass: ['ibm-error-snackbar']
          });
        }
      });
    }
  }
}
