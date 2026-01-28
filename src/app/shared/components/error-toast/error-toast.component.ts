import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {
  readonly errorService = inject(ErrorHandlerService);
}
