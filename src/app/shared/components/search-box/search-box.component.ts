import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'search-box',
  imports: [],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent { }
