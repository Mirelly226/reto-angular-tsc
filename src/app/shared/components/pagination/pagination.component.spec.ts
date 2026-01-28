import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { PAGINATION_OPTIONS } from '../../constants/pagination.constants';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have totalResults as 0 by default', () => {
      expect(component.totalResults()).toBe(0);
    });

    it('should have pageSize as 5 by default', () => {
      expect(component.pageSize()).toBe(5);
    });

    it('should have paginationOptions defined', () => {
      expect(component.paginationOptions).toEqual(PAGINATION_OPTIONS);
    });
  });

  describe('onPageSizeChange', () => {
    it('should emit pageSizeChange with selected value', () => {
      const pageSizeChangeSpy = jest.fn();
      component.pageSizeChange.subscribe(pageSizeChangeSpy);

      const mockEvent = {
        target: { value: '10' }
      } as any;

      component.onPageSizeChange(mockEvent);

      expect(pageSizeChangeSpy).toHaveBeenCalledWith(10);
    });

    it('should convert string value to number', () => {
      const pageSizeChangeSpy = jest.fn();
      component.pageSizeChange.subscribe(pageSizeChangeSpy);

      const mockEvent = {
        target: { value: '20' }
      } as any;

      component.onPageSizeChange(mockEvent);

      expect(pageSizeChangeSpy).toHaveBeenCalledWith(20);
      expect(typeof pageSizeChangeSpy.mock.calls[0][0]).toBe('number');
    });

    it('should handle different page sizes', () => {
      const pageSizeChangeSpy = jest.fn();
      component.pageSizeChange.subscribe(pageSizeChangeSpy);

      const mockEvent5 = { target: { value: '5' } } as any;
      component.onPageSizeChange(mockEvent5);

      const mockEvent10 = { target: { value: '10' } } as any;
      component.onPageSizeChange(mockEvent10);

      const mockEvent20 = { target: { value: '20' } } as any;
      component.onPageSizeChange(mockEvent20);

      expect(pageSizeChangeSpy).toHaveBeenCalledTimes(3);
      expect(pageSizeChangeSpy.mock.calls[0][0]).toBe(5);
      expect(pageSizeChangeSpy.mock.calls[1][0]).toBe(10);
      expect(pageSizeChangeSpy.mock.calls[2][0]).toBe(20);
    });
  });
});
