import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have primary variant by default', () => {
      expect(component.variant()).toBe('primary');
    });

    it('should have button type by default', () => {
      expect(component.type()).toBe('button');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe('onClick', () => {
    it('should emit clicked event when onClick is called', () => {
      const clickedSpy = jest.fn();
      component.clicked.subscribe(clickedSpy);

      component.onClick();

      expect(clickedSpy).toHaveBeenCalled();
    });

    it('should emit clicked event once per click', () => {
      const clickedSpy = jest.fn();
      component.clicked.subscribe(clickedSpy);

      component.onClick();
      component.onClick();

      expect(clickedSpy).toHaveBeenCalledTimes(2);
    });
  });
});
