import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  template: `
    <div class="min-h-screen bg-ibm-gray-50">
      <!-- Global Loading Spinner -->
      <div 
        *ngIf="loadingService.loading$()" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-ibm shadow-ibm-lg flex items-center space-x-4">
          <mat-spinner diameter="24"></mat-spinner>
          <span class="text-ibm-gray-900 font-medium">Carregando...</span>
        </div>
      </div>

      <!-- Main Content -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    public loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize auth state
    this.authService.isLoggedIn();
  }
}
