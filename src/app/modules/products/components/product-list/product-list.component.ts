import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  imports: [SearchBoxComponent, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent { }
