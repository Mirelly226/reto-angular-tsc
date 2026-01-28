import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../buttons/button/button.component';

@Component({
  selector: 'app-error-message',
  imports: [ButtonComponent],
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
