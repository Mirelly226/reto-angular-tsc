import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  icon = input<string>();
  ariaLabel = input<string>();

  clicked = output<void>();

  onClick(event: Event): void {
    event.stopPropagation();
    this.clicked.emit();
  }
}
