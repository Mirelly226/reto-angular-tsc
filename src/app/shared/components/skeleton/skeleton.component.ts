import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly rows = input<number>(5);
  readonly type = input<'table' | 'text'>('table');

  get rowsArray(): number[] {
    return Array(this.rows()).fill(0).map((_, i) => i);
  }
}
