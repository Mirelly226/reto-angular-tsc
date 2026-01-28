import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInput', () => {
    it('should emit search event with value', () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);

      component.onInput('test search');

      expect(searchSpy).toHaveBeenCalledWith('test search');
    });

    it('should emit search event with empty string', () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);

      component.onInput('');

      expect(searchSpy).toHaveBeenCalledWith('');
    });

    it('should emit search event multiple times', () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);

      component.onInput('first');
      component.onInput('second');
      component.onInput('third');

      expect(searchSpy).toHaveBeenCalledTimes(3);
      expect(searchSpy.mock.calls[0][0]).toBe('first');
      expect(searchSpy.mock.calls[1][0]).toBe('second');
      expect(searchSpy.mock.calls[2][0]).toBe('third');
    });
  });
});
