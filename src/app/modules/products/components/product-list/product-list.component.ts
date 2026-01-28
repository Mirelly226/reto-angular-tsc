import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { DropdownMenuComponent } from '../../../../shared/components/dropdown-menu/dropdown-menu.component';
import { IDropdownOption, MenuAction } from '../../../../shared/types/menu.types';
import { ConfirmDeleteProductComponent } from '../confirm-delete-product/confirm-delete-product.component';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';
import { MENU_OPTIONS } from '../../../../shared/constants/menu.constants';

@Component({
  imports: [NgTemplateOutlet, DatePipe, UpperCasePipe, SearchBoxComponent, PaginationComponent, SkeletonComponent, ButtonComponent, ErrorMessageComponent, DropdownMenuComponent, ConfirmDeleteProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly menuOptions: IDropdownOption[] = MENU_OPTIONS;

  readonly products = signal<IProduct[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal<string>('');
  readonly pageSize = signal<number>(5);
  readonly currentPage = signal<number>(1);
  readonly showDeleteModal = signal<boolean>(false);
  readonly productToDelete = signal<IProduct | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.products();
    }
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term)
    );
  });

  readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  readonly totalResults = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los productos. Por favor, intente nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  onRetry(): void {
    this.loadProducts();
  }

  onAddProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onProductAction(action: MenuAction, product: IProduct): void {
    if (action === 'edit') {
      this.router.navigate(['/products/edit', product.id]);
    } else if (action === 'delete') {
      this.productToDelete.set(product);
      this.showDeleteModal.set(true);
    }
  }

  onProductDeleted(productId: string): void {
    this.products.update(products => products.filter(p => p.id !== productId));
    this.closeDeleteModal();
  }

  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}
