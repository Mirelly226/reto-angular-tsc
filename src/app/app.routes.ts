import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./modules/products/components/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  },
  {
    path: 'products/new',
    loadComponent: () => import('./modules/products/components/product-form/product-form.component')
      .then(m => m.ProductFormComponent),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./modules/products/components/product-form/product-form.component')
      .then(m => m.ProductFormComponent),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
