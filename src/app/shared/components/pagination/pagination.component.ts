import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PAGINATION_OPTIONS } from '../../constants/pagination.constants';

@Component({
  selector: 'pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PaginationComponent {


  get paginationOptions(): number[] {
    return PAGINATION_OPTIONS;
  } 
}