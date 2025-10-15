import { Routes } from '@angular/router';

export const analysisRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/analysis-list/analysis-list.component').then(m => m.AnalysisListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/create-analysis/create-analysis.component').then(m => m.CreateAnalysisComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/analysis-detail/analysis-detail.component').then(m => m.AnalysisDetailComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/analysis-stats/analysis-stats.component').then(m => m.AnalysisStatsComponent)
  }
];
