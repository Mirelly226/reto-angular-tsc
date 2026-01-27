import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';

@Component({
  imports: [DatePipe, UpperCasePipe, NgTemplateOutlet, SearchBoxComponent, PaginationComponent, SkeletonComponent, PrimaryButtonComponent, IconButtonComponent, ErrorMessageComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<IProduct[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal<string>('');
  readonly pageSize = signal<number>(5);
  readonly currentPage = signal<number>(1);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.products();
    }
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
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
      error: (err) => {
        this.error.set('Error al cargar los productos. Por favor, intente nuevamente.');
        this.isLoading.set(false);
        console.error('Error loading products:', err);
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
}
