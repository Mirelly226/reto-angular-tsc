import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { IProduct } from '../../models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const mockProduct: IProduct = {
    id: 'test-123',
    name: 'Test Product Name',
    description: 'Test product description for testing',
    logo: 'https://example.com/logo.png',
    releaseDate: new Date(2026, 5, 15, 12, 0, 0, 0),
    revisionDate: new Date(2027, 5, 15, 12, 0, 0, 0)
  };

  beforeEach(async () => {
    mockProductService = {
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      verifyProductId: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values in create mode', () => {
      fixture.detectChanges();

      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('logo')?.value).toBe('');
      expect(component.isEditMode()).toBe(false);
    });

    it('should have correct validators on fields', () => {
      fixture.detectChanges();

      const idControl = component.productForm.get('id');
      const nameControl = component.productForm.get('name');
      const descriptionControl = component.productForm.get('description');

      idControl?.setValue('');
      expect(idControl?.hasError('required')).toBe(true);

      idControl?.setValue('ab');
      expect(idControl?.hasError('minlength')).toBe(true);

      idControl?.setValue('12345678901');
      expect(idControl?.hasError('maxlength')).toBe(true);

      nameControl?.setValue('abc');
      expect(nameControl?.hasError('minlength')).toBe(true);

      descriptionControl?.setValue('short');
      expect(descriptionControl?.hasError('minlength')).toBe(true);
    });

    it('should have revisionDate disabled by default', () => {
      fixture.detectChanges();

      const revisionDateControl = component.productForm.get('revisionDate');
      expect(revisionDateControl?.disabled).toBe(true);
    });
  });

  describe('Edit mode', () => {
    beforeEach(() => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('test-123');
      mockProductService.getProductById.mockReturnValue(of(mockProduct));
    });

    it('should detect edit mode from route', () => {
      fixture.detectChanges();

      expect(component.isEditMode()).toBe(true);
      expect(component.productId()).toBe('test-123');
    });

    it('should load product data in edit mode', () => {
      fixture.detectChanges();

      expect(mockProductService.getProductById).toHaveBeenCalledWith('test-123');
      expect(component.productForm.get('name')?.value).toBe('Test Product Name');
      expect(component.productForm.get('description')?.value).toBe('Test product description for testing');
    });

    it('should disable id field in edit mode', () => {
      fixture.detectChanges();

      const idControl = component.productForm.get('id');
      expect(idControl?.disabled).toBe(true);
    });

    it('should show correct form title in edit mode', () => {
      fixture.detectChanges();

      expect(component.formTitle()).toBe('Formulario de Edición');
    });
  });

  describe('Create mode', () => {
    beforeEach(() => {
      mockProductService.verifyProductId.mockReturnValue(of(false));
    });

    it('should show correct form title in create mode', () => {
      fixture.detectChanges();

      expect(component.formTitle()).toBe('Formulario de Registro');
    });

    it('should add async validator to id field in create mode', () => {
      fixture.detectChanges();

      const idControl = component.productForm.get('id');
      expect(idControl?.asyncValidator).toBeDefined();
    });
  });

  describe('Release date validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should accept today date', () => {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      component.productForm.get('releaseDate')?.setValue(todayString);

      expect(component.productForm.get('releaseDate')?.hasError('minDate')).toBe(false);
    });

    it('should accept future date', () => {
      component.productForm.get('releaseDate')?.setValue('2027-12-31');

      expect(component.productForm.get('releaseDate')?.hasError('minDate')).toBe(false);
    });

    it('should reject past date', () => {
      component.productForm.get('releaseDate')?.setValue('2020-01-01');

      expect(component.productForm.get('releaseDate')?.hasError('minDate')).toBe(true);
    });
  });

  describe('Revision date auto-calculation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should calculate revision date as 1 year after release date', (done) => {
      component.productForm.get('releaseDate')?.setValue('2026-06-15');

      setTimeout(() => {
        const revisionDateValue = component.productForm.get('revisionDate')?.value;
        expect(revisionDateValue).toBe('2027-06-15');
        done();
      }, 100);
    });

    it('should update revision date when release date changes', (done) => {
      component.productForm.get('releaseDate')?.setValue('2026-01-01');

      setTimeout(() => {
        expect(component.productForm.get('revisionDate')?.value).toBe('2027-01-01');

        component.productForm.get('releaseDate')?.setValue('2026-12-31');

        setTimeout(() => {
          expect(component.productForm.get('revisionDate')?.value).toBe('2027-12-31');
          done();
        }, 100);
      }, 100);
    });
  });

  describe('ID async validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate id does not exist', (done) => {
      mockProductService.verifyProductId.mockReturnValue(of(false));

      const idControl = component.productForm.get('id');
      idControl?.setValue('new-id-123');

      setTimeout(() => {
        expect(mockProductService.verifyProductId).toHaveBeenCalledWith('new-id-123');
        expect(idControl?.hasError('idExists')).toBe(false);
        done();
      }, 500);
    });

    it('should not validate id shorter than 3 characters', (done) => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('ab');

      setTimeout(() => {
        expect(mockProductService.verifyProductId).not.toHaveBeenCalled();
        done();
      }, 500);
    });
  });

  describe('Form submission - Create', () => {
    beforeEach(() => {
      mockProductService.verifyProductId.mockReturnValue(of(false));
      mockProductService.createProduct.mockReturnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('should create product when form is valid', (done) => {
      component.productForm.patchValue({
        id: 'new-123',
        name: 'New Product Name',
        description: 'New product description',
        logo: 'https://example.com/logo.png',
        releaseDate: '2026-06-15'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(mockProductService.createProduct).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should navigate to products list after successful creation', (done) => {
      component.productForm.patchValue({
        id: 'new-123',
        name: 'New Product Name',
        description: 'New product description',
        logo: 'https://example.com/logo.png',
        releaseDate: '2026-06-15'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
        expect(component.isSubmitting()).toBe(false);
        done();
      }, 100);
    });

    it('should not submit when form is invalid', () => {
      component.productForm.patchValue({
        id: '',
        name: '',
        description: ''
      });

      component.onSubmit();

      expect(mockProductService.createProduct).not.toHaveBeenCalled();
      expect(component.productForm.touched).toBe(true);
    });

    it('should handle creation errors', (done) => {
      mockProductService.createProduct.mockReturnValue(throwError(() => new Error('Server error')));

      component.productForm.patchValue({
        id: 'new-123',
        name: 'New Product Name',
        description: 'New product description',
        logo: 'https://example.com/logo.png',
        releaseDate: '2026-06-15'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.isSubmitting()).toBe(false);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('Form submission - Update', () => {
    beforeEach(() => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('test-123');
      mockProductService.getProductById.mockReturnValue(of(mockProduct));
      mockProductService.updateProduct.mockReturnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('should update product when form is valid', () => {
      component.productForm.patchValue({
        name: 'Updated Product Name',
        description: 'Updated product description'
      });

      component.onSubmit();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(mockProductService.updateProduct.mock.calls[0][0]).toBe('test-123');
    });

    it('should navigate to products list after successful update', (done) => {
      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
        expect(component.isSubmitting()).toBe(false);
        done();
      }, 100);
    });

    it('should handle update errors', (done) => {
      mockProductService.updateProduct.mockReturnValue(throwError(() => new Error('Server error')));

      component.onSubmit();

      setTimeout(() => {
        expect(component.isSubmitting()).toBe(false);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('Form reset', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset form in create mode', () => {
      component.productForm.patchValue({
        id: 'test-123',
        name: 'Test Name',
        description: 'Test description'
      });

      component.onReset();

      expect(component.productForm.get('id')?.value).toBe(null);
      expect(component.productForm.get('name')?.value).toBe(null);
      expect(component.productForm.get('description')?.value).toBe(null);
    });

    it('should reload product data in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('test-123');
      mockProductService.getProductById.mockReturnValue(of(mockProduct));
      component.ngOnInit();

      component.productForm.get('name')?.setValue('Changed Name');
      component.onReset();

      expect(mockProductService.getProductById).toHaveBeenCalledTimes(2);
    });
  });

  describe('Utility methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should check if field is invalid', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBe(true);
    });

    it('should return false for valid field', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('Valid Product Name');
      nameControl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBe(false);
    });

    it('should check if id is validating', () => {
      expect(component.isIdValidating).toBe(false);
    });
  });
});
