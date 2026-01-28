import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of, debounceTime, switchMap, first } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';
import { PRODUCT_FORM_ERRORS } from '../../constants/form-errors.constants';

@Component({
    selector: 'app-product-form',
    imports: [ReactiveFormsModule, ButtonComponent, FieldErrorComponent],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly productService = inject(ProductService);
    private readonly destroyRef = inject(DestroyRef);

    readonly isEditMode = signal<boolean>(false);
    readonly isSubmitting = signal<boolean>(false);
    readonly productId = signal<string | null>(null);
    readonly formErrors = PRODUCT_FORM_ERRORS;

    readonly formTitle = computed(() =>
        this.isEditMode() ? 'Formulario de Edición' : 'Formulario de Registro'
    );

    readonly productForm = this.fb.group({
        id: ['', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10)
        ]],
        // NOTE: Document specifies min 5 chars, but backend validates min 6. Adjusted to 6 to match backend validation.
        name: ['', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100)
        ]],
        description: ['', [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(200)
        ]],
        logo: ['', [Validators.required]],
        releaseDate: ['', [Validators.required, this.releaseDateValidator.bind(this)]],
        revisionDate: [{ value: '', disabled: true }, [Validators.required]]
    });

    ngOnInit(): void {
        this.setupReleaseDateListener();
        this.checkEditMode();
    }

    private setupReleaseDateListener(): void {
        this.productForm.get('releaseDate')?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                if (value) {
                    const [year, month, day] = value.split('-').map(Number);
                    const revisionDate = new Date(year + 1, month - 1, day, 12, 0, 0, 0);
                    this.productForm.get('revisionDate')?.setValue(this.formatDateForInput(revisionDate));
                }
            });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.productId.set(id);
            this.productForm.get('id')?.disable();
            this.loadProduct(id);
        } else {
            this.productForm.get('id')?.addAsyncValidators(this.idExistsValidator.bind(this));
            this.productForm.get('id')?.updateValueAndValidity();
        }
    }

    private loadProduct(id: string): void {
        this.productService.getProductById(id).subscribe({
            next: (product) => {
                if (product) {
                    this.productForm.patchValue({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        logo: product.logo,
                        releaseDate: this.formatDateForInput(product.releaseDate),
                        revisionDate: this.formatDateForInput(product.revisionDate)
                    });
                }
            },
            error: () => {
                this.router.navigate(['/products']);
            }
        });
    }

    private releaseDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [year, month, day] = control.value.split('-').map(Number);
        const releaseDate = new Date(year, month - 1, day, 12, 0, 0, 0);
        releaseDate.setHours(0, 0, 0, 0);

        if (releaseDate < today) return { minDate: true };
        return null;
    }

    private idExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.length < 3) {
            return of(null);
        }
        return of(control.value).pipe(
            debounceTime(300),
            switchMap(id => this.productService.verifyProductId(id)),
            map(exists => exists ? { idExists: true } : null),
            catchError(() => of(null)),
            first()
        );
    }

    private formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private parseDateFromInput(dateString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day, 12, 0, 0, 0);
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.productForm.getRawValue();

        const product: IProduct = {
            id: formValue.id!,
            name: formValue.name!,
            description: formValue.description!,
            logo: formValue.logo!,
            releaseDate: this.parseDateFromInput(formValue.releaseDate!),
            revisionDate: this.parseDateFromInput(formValue.revisionDate!)
        };

        const operation$ = this.isEditMode()
            ? this.productService.updateProduct(this.productId()!, product)
            : this.productService.createProduct(product);

        operation$.subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/products']);
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }

    onReset(): void {
        if (this.isEditMode()) {
            this.loadProduct(this.productId()!);
        } else {
            this.productForm.reset();
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.productForm.get(fieldName);
        return control ? control.invalid && control.touched : false;
    }

    get isIdValidating(): boolean {
        return this.productForm.get('id')?.pending ?? false;
    }
}
