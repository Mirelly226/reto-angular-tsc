import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PrimaryButtonComponent {
  label = input<string>();
  disabled = input<boolean>(false);

  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
