import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { IProduct } from '../models/product.model';
import { IProductApi } from '../models/product-api.model';
import { IApiListResponse, IApiMessageResponse, IApiDeleteResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/bp/products`;

  const mockApiProduct: IProductApi = {
    id: 'test-123',
    name: 'Test Product',
    description: 'Test product description',
    logo: 'https://example.com/logo.png',
    date_release: '2026-06-15',
    date_revision: '2027-06-15'
  };

  const mockProduct: IProduct = {
    id: 'test-123',
    name: 'Test Product',
    description: 'Test product description',
    logo: 'https://example.com/logo.png',
    releaseDate: new Date(2026, 5, 15, 12, 0, 0, 0),
    revisionDate: new Date(2027, 5, 15, 12, 0, 0, 0)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch products and transform them', (done) => {
      const mockResponse: IApiListResponse<IProductApi> = {
        data: [mockApiProduct, { ...mockApiProduct, id: 'test-456' }]
      };

      service.getProducts().subscribe({
        next: (products) => {
          expect(products.length).toBe(2);
          expect(products[0].id).toBe('test-123');
          expect(products[1].id).toBe('test-456');
          expect(products[0].releaseDate).toBeInstanceOf(Date);
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when no products', (done) => {
      const mockResponse: IApiListResponse<IProductApi> = {
        data: []
      };

      service.getProducts().subscribe({
        next: (products) => {
          expect(products).toEqual([]);
          expect(products.length).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(mockResponse);
    });

    it('should handle HTTP errors', (done) => {
      service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getProductById', () => {
    it('should fetch product by id', (done) => {
      const mockResponse: IApiListResponse<IProductApi> = {
        data: [mockApiProduct, { ...mockApiProduct, id: 'test-456' }]
      };

      service.getProductById('test-123').subscribe({
        next: (product) => {
          expect(product).toBeDefined();
          expect(product?.id).toBe('test-123');
          expect(product?.name).toBe('Test Product');
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(mockResponse);
    });

    it('should return undefined when product not found', (done) => {
      const mockResponse: IApiListResponse<IProductApi> = {
        data: [mockApiProduct]
      };

      service.getProductById('non-existent').subscribe({
        next: (product) => {
          expect(product).toBeUndefined();
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(mockResponse);
    });

    it('should return undefined when empty list', (done) => {
      const mockResponse: IApiListResponse<IProductApi> = {
        data: []
      };

      service.getProductById('test-123').subscribe({
        next: (product) => {
          expect(product).toBeUndefined();
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(mockResponse);
    });
  });

  describe('createProduct', () => {
    it('should create a product', (done) => {
      const mockResponse: IApiMessageResponse<IProductApi> = {
        message: 'Product added successfully',
        data: mockApiProduct
      };

      service.createProduct(mockProduct).subscribe({
        next: (product) => {
          expect(product.id).toBe('test-123');
          expect(product.name).toBe('Test Product');
          expect(product.releaseDate).toBeInstanceOf(Date);
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBe('test-123');
      expect(req.request.body.date_release).toBe('2026-06-15');
      req.flush(mockResponse);
    });

    it('should handle creation errors', (done) => {
      service.createProduct(mockProduct).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', (done) => {
      const productUpdate: Omit<IProduct, 'id'> = {
        name: 'Updated Product',
        description: 'Updated description',
        logo: 'https://example.com/new-logo.png',
        releaseDate: new Date(2026, 5, 15, 12, 0, 0, 0),
        revisionDate: new Date(2027, 5, 15, 12, 0, 0, 0)
      };

      const mockResponse: IApiMessageResponse<IProductApi> = {
        message: 'Product updated successfully',
        data: {
          name: 'Updated Product',
          description: 'Updated description',
          logo: 'https://example.com/new-logo.png',
          date_release: '2026-06-15',
          date_revision: '2027-06-15'
        } as IProductApi
      };

      service.updateProduct('test-123', productUpdate).subscribe({
        next: (product) => {
          expect(product.id).toBe('test-123');
          expect(product.name).toBe('Updated Product');
          expect(product.description).toBe('Updated description');
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test-123`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBeUndefined();
      expect(req.request.body.name).toBe('Updated Product');
      req.flush(mockResponse);
    });

    it('should handle update errors', (done) => {
      const productUpdate: Omit<IProduct, 'id'> = {
        name: 'Updated Product',
        description: 'Updated description',
        logo: 'https://example.com/logo.png',
        releaseDate: new Date(2026, 5, 15, 12, 0, 0, 0),
        revisionDate: new Date(2027, 5, 15, 12, 0, 0, 0)
      };

      service.updateProduct('test-123', productUpdate).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test-123`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', (done) => {
      const mockResponse: IApiDeleteResponse = {
        message: 'Product removed successfully'
      };

      service.deleteProduct('test-123').subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test-123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle delete errors', (done) => {
      service.deleteProduct('test-123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test-123`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('verifyProductId', () => {
    it('should verify existing product id', (done) => {
      service.verifyProductId('test-123').subscribe({
        next: (exists) => {
          expect(exists).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/verification/test-123`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should verify non-existing product id', (done) => {
      service.verifyProductId('non-existent').subscribe({
        next: (exists) => {
          expect(exists).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/verification/non-existent`);
      req.flush(false);
    });

    it('should handle verification errors', (done) => {
      service.verifyProductId('test-123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/verification/test-123`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
