import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IProduct } from '../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let consoleErrorSpy: jest.SpyInstance;

  const mockProducts: IProduct[] = [
    {
      id: 'test-1',
      name: 'Product One',
      description: 'First test product',
      logo: 'https://example.com/logo1.png',
      releaseDate: new Date(2026, 0, 1, 12, 0, 0, 0),
      revisionDate: new Date(2027, 0, 1, 12, 0, 0, 0)
    },
    {
      id: 'test-2',
      name: 'Product Two',
      description: 'Second test product',
      logo: 'https://example.com/logo2.png',
      releaseDate: new Date(2026, 1, 1, 12, 0, 0, 0),
      revisionDate: new Date(2027, 1, 1, 12, 0, 0, 0)
    },
    {
      id: 'test-3',
      name: 'Another Product',
      description: 'Third test product',
      logo: 'https://example.com/logo3.png',
      releaseDate: new Date(2026, 2, 1, 12, 0, 0, 0),
      revisionDate: new Date(2027, 2, 1, 12, 0, 0, 0)
    }
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products on initialization', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));

      fixture.detectChanges();

      expect(mockProductService.getProducts).toHaveBeenCalled();
      expect(component.products()).toEqual(mockProducts);
      expect(component.isLoading()).toBe(false);
    });

    it('should handle errors when loading products', () => {
      mockProductService.getProducts.mockReturnValue(throwError(() => new Error('Server error')));

      fixture.detectChanges();

      expect(component.error()).toBe('Error al cargar los productos. Por favor, intente nuevamente.');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('loadProducts', () => {
    it('should set loading state during loading', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      component.isLoading.set(false);

      component.loadProducts();

      fixture.detectChanges();
      expect(component.products()).toEqual(mockProducts);
    });

    it('should clear previous errors', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      component.error.set('Previous error');

      component.loadProducts();

      expect(component.error()).toBeNull();
    });

    it('should load and set products', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));

      component.loadProducts();

      expect(component.products()).toEqual(mockProducts);
      expect(component.products().length).toBe(3);
    });
  });

  describe('Search functionality', () => {
    beforeEach(() => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should filter products by name', () => {
      component.onSearch('Product One');

      expect(component.filteredProducts().length).toBe(1);
      expect(component.filteredProducts()[0].name).toBe('Product One');
    });

    it('should filter products case-insensitively', () => {
      component.onSearch('product two');

      expect(component.filteredProducts().length).toBe(1);
      expect(component.filteredProducts()[0].name).toBe('Product Two');
    });

    it('should return all products when search term is empty', () => {
      component.onSearch('');

      expect(component.filteredProducts().length).toBe(3);
    });

    it('should return multiple matching products', () => {
      component.onSearch('Product');

      expect(component.filteredProducts().length).toBe(3);
    });

    it('should return empty array when no matches', () => {
      component.onSearch('NonExistent');

      expect(component.filteredProducts().length).toBe(0);
    });

    it('should reset to first page when searching', () => {
      component.currentPage.set(3);

      component.onSearch('Product');

      expect(component.currentPage()).toBe(1);
    });

    it('should trim search term', () => {
      component.onSearch('  Product One  ');

      expect(component.filteredProducts().length).toBe(1);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      const manyProducts: IProduct[] = Array.from({ length: 25 }, (_, i) => ({
        id: `test-${i}`,
        name: `Product ${i}`,
        description: `Description ${i}`,
        logo: `https://example.com/logo${i}.png`,
        releaseDate: new Date(2026, 0, 1, 12, 0, 0, 0),
        revisionDate: new Date(2027, 0, 1, 12, 0, 0, 0)
      }));

      mockProductService.getProducts.mockReturnValue(of(manyProducts));
      fixture.detectChanges();
    });

    it('should paginate products correctly', () => {
      component.pageSize.set(5);
      component.currentPage.set(1);

      expect(component.paginatedProducts().length).toBe(5);
      expect(component.paginatedProducts()[0].name).toBe('Product 0');
    });

    it('should show correct page of products', () => {
      component.pageSize.set(5);
      component.currentPage.set(2);

      expect(component.paginatedProducts().length).toBe(5);
      expect(component.paginatedProducts()[0].name).toBe('Product 5');
    });

    it('should change page size', () => {
      component.onPageSizeChange(10);

      expect(component.pageSize()).toBe(10);
      expect(component.paginatedProducts().length).toBe(10);
    });

    it('should reset to first page when changing page size', () => {
      component.currentPage.set(3);

      component.onPageSizeChange(20);

      expect(component.currentPage()).toBe(1);
    });

    it('should handle last page with fewer items', () => {
      component.pageSize.set(10);
      component.currentPage.set(3);

      expect(component.paginatedProducts().length).toBe(5);
    });
  });

  describe('totalResults', () => {
    it('should calculate total results correctly', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();

      expect(component.totalResults()).toBe(3);
    });

    it('should update total results after filtering', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();

      component.onSearch('Product');

      expect(component.totalResults()).toBe(3);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should navigate to add product form', () => {
      component.onAddProduct();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/new']);
    });

    it('should navigate to edit product form', () => {
      const product = mockProducts[0];

      component.onProductAction('edit', product);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/edit', 'test-1']);
    });
  });

  describe('Delete product', () => {
    beforeEach(() => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should show delete modal when delete action triggered', () => {
      const product = mockProducts[0];

      component.onProductAction('delete', product);

      expect(component.showDeleteModal()).toBe(true);
      expect(component.productToDelete()).toEqual(product);
    });

    it('should close delete modal when cancelled', () => {
      component.showDeleteModal.set(true);
      component.productToDelete.set(mockProducts[0]);

      component.onDeleteCancelled();

      expect(component.showDeleteModal()).toBe(false);
      expect(component.productToDelete()).toBeNull();
    });

    it('should remove product from list after deletion', () => {
      component.products.set([...mockProducts]);

      component.onProductDeleted('test-1');

      expect(component.products().length).toBe(2);
      expect(component.products().find(p => p.id === 'test-1')).toBeUndefined();
    });

    it('should close modal after deletion', () => {
      component.showDeleteModal.set(true);
      component.productToDelete.set(mockProducts[0]);

      component.onProductDeleted('test-1');

      expect(component.showDeleteModal()).toBe(false);
      expect(component.productToDelete()).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should retry loading products', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));

      component.onRetry();

      expect(mockProductService.getProducts).toHaveBeenCalled();
    });

    it('should clear error and load products on retry', () => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      component.error.set('Previous error');

      component.onRetry();

      expect(component.error()).toBeNull();
      expect(component.products()).toEqual(mockProducts);
    });
  });

  describe('Menu options', () => {
    it('should have menu options defined', () => {
      expect(component.menuOptions).toBeDefined();
      expect(component.menuOptions.length).toBeGreaterThan(0);
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      mockProductService.getProducts.mockReturnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should update filteredProducts when products change', () => {
      expect(component.filteredProducts().length).toBe(3);

      component.products.set([mockProducts[0]]);

      expect(component.filteredProducts().length).toBe(1);
    });

    it('should update paginatedProducts when page changes', () => {
      const manyProducts: IProduct[] = Array.from({ length: 15 }, (_, i) => ({
        id: `test-${i}`,
        name: `Product ${i}`,
        description: `Description ${i}`,
        logo: `https://example.com/logo${i}.png`,
        releaseDate: new Date(2026, 0, 1, 12, 0, 0, 0),
        revisionDate: new Date(2027, 0, 1, 12, 0, 0, 0)
      }));

      component.products.set(manyProducts);
      component.pageSize.set(5);
      component.currentPage.set(1);

      expect(component.paginatedProducts()[0].name).toBe('Product 0');

      component.currentPage.set(2);

      expect(component.paginatedProducts()[0].name).toBe('Product 5');
    });

    it('should update totalResults when filtered products change', () => {
      expect(component.totalResults()).toBe(3);

      component.searchTerm.set('Product One');

      expect(component.totalResults()).toBe(1);
    });
  });
});
