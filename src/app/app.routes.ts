import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./modules/products/components/product-list/product-list.component')
    .then(m => m.ProductListComponent),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
