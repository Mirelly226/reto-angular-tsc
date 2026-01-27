import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

@Component({
  selector: 'app-error-message',
  imports: [PrimaryButtonComponent],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  message = input.required<string>();
  showRetryButton = input<boolean>(true);
  retryButtonLabel = input<string>('Reintentar');

  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
