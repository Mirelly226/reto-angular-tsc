import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PAGINATION_OPTIONS } from '../../constants/pagination.constants';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  totalResults = input<number>(0);
  pageSize = input<number>(5);

  pageSizeChange = output<number>();

  readonly paginationOptions = PAGINATION_OPTIONS;

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(select.value));
  }
}
