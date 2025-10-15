import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideIconsModule } from 'src/app/shared/components/lucide-icons/lucide-icons.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
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
          <h2 class="mt-6 ibm-heading-1">Criar Conta</h2>
          <p class="mt-2 text-sm text-ibm-gray-600">
            Comece a analisar seus documentos com IA
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                Nome completo
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <lucide-angular name="user" size="20" class="text-ibm-gray-400" ></lucide-angular>
                </div>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  class="ibm-input pl-10"
                  placeholder="Seu nome completo"
                  [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                />
              </div>
              <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="registerForm.get('name')?.errors?.['required']">Nome é obrigatório</p>
                <p *ngIf="registerForm.get('name')?.errors?.['minlength']">Nome deve ter pelo menos 2 caracteres</p>
              </div>
            </div>

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
                  [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                />
              </div>
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="registerForm.get('email')?.errors?.['required']">Email é obrigatório</p>
                <p *ngIf="registerForm.get('email')?.errors?.['email']">Email inválido</p>
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
                  [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
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
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="registerForm.get('password')?.errors?.['required']">Senha é obrigatória</p>
                <p *ngIf="registerForm.get('password')?.errors?.['minlength']">Senha deve ter pelo menos 6 caracteres</p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-ibm-gray-900 mb-2">
                Confirmar senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <lucide-angular name="lock" size="20" class="text-ibm-gray-400" ></lucide-angular>
                </div>
                <input
                  id="confirmPassword"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  class="ibm-input pl-10 pr-10"
                  placeholder="Confirme sua senha"
                  [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                />
                <button
                  type="button"
                  (click)="toggleConfirmPassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <lucide-angular name="eye" *ngIf="!showConfirmPassword" size="20" class="text-ibm-gray-400 hover:text-ibm-gray-600" ></lucide-angular>
                  <lucide-angular name="eye-off" *ngIf="showConfirmPassword" size="20" class="text-ibm-gray-400 hover:text-ibm-gray-600" ></lucide-angular>
                </button>
              </div>
              <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <p *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirmação de senha é obrigatória</p>
                <p *ngIf="registerForm.get('confirmPassword')?.errors?.['mismatch']">Senhas não coincidem</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full ibm-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <app-loading-spinner 
                *ngIf="isLoading" 
                [size]="20" 
                message=""
                containerClass="!p-0"
              ></app-loading-spinner>
              <span *ngIf="!isLoading">Criar Conta</span>
            </button>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <p class="text-sm text-ibm-gray-600">
              Já tem uma conta?
              <a routerLink="/auth/login" class="font-medium text-ibm-blue hover:text-blue-700">
                Fazer login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      if (confirmPassword?.errors?.['mismatch']) {
        delete confirmPassword.errors['mismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          this.snackBar.open('Conta criada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['ibm-success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao criar conta. Tente novamente.', 'Fechar', {
            duration: 5000,
            panelClass: ['ibm-error-snackbar']
          });
        }
      });
    }
  }
}
