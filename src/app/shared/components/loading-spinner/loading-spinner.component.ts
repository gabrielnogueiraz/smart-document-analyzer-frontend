import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center p-8" [class]="containerClass">
      <div class="flex flex-col items-center space-y-4">
        <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
        <p *ngIf="message" class="text-ibm-gray-600 font-light">{{ message }}</p>
      </div>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() color: string = 'primary';
  @Input() message: string = '';
  @Input() containerClass: string = '';
}
