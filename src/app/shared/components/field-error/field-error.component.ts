import { ChangeDetectionStrategy, Component, input, effect, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';

interface IErrorMessage {
  key: string;
  message: string;
}

@Component({
  selector: 'app-field-error',
  template: `
    @for (error of activeErrors(); track error.key) {
      <span class="error-text">{{ error.message }}</span>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .error-text {
      display: block;
      font-size: 12px;
      color: #dc2626;
      margin-top: 4px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorComponent {
  private readonly destroyRef = inject(DestroyRef);

  control = input.required<AbstractControl | null>();
  messages = input.required<Record<string, string>>();

  readonly activeErrors = signal<IErrorMessage[]>([]);

  constructor() {
    effect(() => {
      const ctrl = this.control();
      
      if (!ctrl) {
        this.activeErrors.set([]);
        return;
      }

      this.updateErrors(ctrl);
      this.setupListeners(ctrl);
    });
  }

  private setupListeners(ctrl: AbstractControl): void {
    merge(ctrl.statusChanges, ctrl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrors(ctrl));

    const interval = setInterval(() => this.updateErrors(ctrl), 200);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  private updateErrors(ctrl: AbstractControl): void {
    if (!ctrl.errors || (!ctrl.touched && !ctrl.dirty)) {
      this.activeErrors.set([]);
      return;
    }

    const msgs = this.messages();
    const errors: IErrorMessage[] = [];

    Object.keys(ctrl.errors).forEach(key => {
      if (msgs[key]) {
        errors.push({ key, message: msgs[key] });
      }
    });

    this.activeErrors.set(errors);
  }
}
