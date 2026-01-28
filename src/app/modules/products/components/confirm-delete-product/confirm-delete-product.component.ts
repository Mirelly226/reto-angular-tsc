import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';

@Component({
  selector: 'app-confirm-delete-product',
  imports: [ConfirmModalComponent],
  templateUrl: './confirm-delete-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteProductComponent {
  private readonly productService = inject(ProductService);

  product = input.required<IProduct>();

  deleted = output<string>();
  cancelled = output<void>();

  get message(): string {
    return `¿Estás seguro de eliminar el producto ${this.product().name}?`;
  }

  onConfirm(): void {
    this.productService.deleteProduct(this.product().id).subscribe({
      next: () => {
        this.deleted.emit(this.product().id);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.cancelled.emit();
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
