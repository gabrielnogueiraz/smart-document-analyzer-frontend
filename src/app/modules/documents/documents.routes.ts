import { Routes } from '@angular/router';

export const documentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/documents-list/documents-list.component').then(m => m.DocumentsListComponent)
  },
  {
    path: 'upload',
    loadComponent: () => import('./components/document-upload/document-upload.component').then(m => m.DocumentUploadComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/document-detail/document-detail.component').then(m => m.DocumentDetailComponent)
  }
];
