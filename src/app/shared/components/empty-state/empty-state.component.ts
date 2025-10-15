import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../lucide-icons/lucide-icons.module';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center">
      <div class="mb-6 p-4 bg-ibm-gray-100 rounded-full">
        <ng-container [ngSwitch]="icon">
          <lucide-angular name="file-text" *ngSwitchCase="'file'" size="48" class="text-ibm-gray-400" ></lucide-angular>
          <lucide-angular name="search" *ngSwitchCase="'search'" size="48" class="text-ibm-gray-400" ></lucide-angular>
          <lucide-angular name="file-text" *ngSwitchDefault size="48" class="text-ibm-gray-400" ></lucide-angular>
        </ng-container>
      </div>
      
      <h3 class="ibm-heading-3 mb-2">{{ title }}</h3>
      <p class="ibm-body text-ibm-gray-600 mb-6 max-w-md">{{ description }}</p>
      
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  @Input() icon: 'file' | 'search' = 'file';
  @Input() title: string = 'Nenhum item encontrado';
  @Input() description: string = 'Não há dados para exibir no momento.';
}
