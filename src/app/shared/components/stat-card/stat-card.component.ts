import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="ibm-card p-6 hover:shadow-ibm-lg transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 rounded-ibm" [class]="iconBgClass">
          <ng-content select="[slot=icon]"></ng-content>
        </div>
        <div class="text-right">
          <p class="text-2xl font-light text-ibm-gray-900">{{ value }}</p>
          <p class="text-sm text-ibm-gray-600">{{ label }}</p>
        </div>
      </div>
      
      <div *ngIf="trend" class="flex items-center text-sm" [class]="trendClass">
        <ng-content select="[slot=trend-icon]"></ng-content>
        <span class="ml-1">{{ trend }}%</span>
        <span class="ml-1">vs mês anterior</span>
      </div>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() trend?: number;
  @Input() iconBgClass: string = 'bg-ibm-blue-100';
  @Input() trendClass: string = 'text-green-600';
}