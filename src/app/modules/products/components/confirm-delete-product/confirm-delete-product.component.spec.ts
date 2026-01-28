import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDeleteProductComponent } from './confirm-delete-product.component';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';
import { of, throwError } from 'rxjs';

describe('ConfirmDeleteProductComponent', () => {
  let component: ConfirmDeleteProductComponent;
  let fixture: ComponentFixture<ConfirmDeleteProductComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let consoleErrorSpy: jest.SpyInstance;

  const mockProduct: IProduct = {
    id: 'test-123',
    name: 'Test Product',
    description: 'Test description',
    logo: 'https://example.com/logo.png',
    releaseDate: new Date(2026, 0, 1, 12, 0, 0, 0),
    revisionDate: new Date(2027, 0, 1, 12, 0, 0, 0)
  };

  beforeEach(async () => {
    mockProductService = {
      deleteProduct: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteProductComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('message', () => {
    it('should return confirmation message with product name', () => {
      expect(component.message).toBe('¿Estás seguro de eliminar el producto Test Product?');
    });

    it('should update message when product changes', () => {
      const newProduct: IProduct = {
        ...mockProduct,
        name: 'Another Product'
      };

      fixture.componentRef.setInput('product', newProduct);
      fixture.detectChanges();

      expect(component.message).toBe('¿Estás seguro de eliminar el producto Another Product?');
    });
  });

  describe('onConfirm', () => {
    it('should call deleteProduct service', () => {
      mockProductService.deleteProduct.mockReturnValue(of(undefined));

      component.onConfirm();

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('test-123');
    });

    it('should emit deleted event with product id on success', (done) => {
      mockProductService.deleteProduct.mockReturnValue(of(undefined));

      component.deleted.subscribe((productId) => {
        expect(productId).toBe('test-123');
        done();
      });

      component.onConfirm();
    });

    it('should emit cancelled event on error', (done) => {
      mockProductService.deleteProduct.mockReturnValue(throwError(() => new Error('Delete failed')));

      component.cancelled.subscribe(() => {
        expect(mockProductService.deleteProduct).toHaveBeenCalled();
        done();
      });

      component.onConfirm();
    });
  });

  describe('onCancel', () => {
    it('should emit cancelled event', () => {
      const cancelledSpy = jest.fn();
      component.cancelled.subscribe(cancelledSpy);

      component.onCancel();

      expect(cancelledSpy).toHaveBeenCalled();
    });
  });
});
