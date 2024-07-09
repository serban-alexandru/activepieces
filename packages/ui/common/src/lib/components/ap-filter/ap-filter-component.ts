import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FilterConfig } from '../../models/filter-config.interface';
import { UiCommonModule } from '../../ui-common.module';
import { CommonModule } from '@angular/common';
import { DropdownSearchControlComponent } from '../dropdown-search-control/dropdown-search-control.component';
import { Observable, of } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { SelectAllDirective } from '../../directives/select-all.directive';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ap-filter',
  templateUrl: './ap-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    UiCommonModule,
    CommonModule,
    DropdownSearchControlComponent,
    SelectAllDirective,
    MatSelect,
  ],
})
export class ApFilterComponent implements OnInit {
  @Input() filters: FilterConfig<any, any>[];

  availableFilters: {
    queryParam: string;
    name: string;
  }[] = [];
  selectedFilters: string[] = [];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.availableFilters = this.filters.map(({ queryParam, name }) => ({
      queryParam,
      name,
    }));
    this.filters = this.filters.map((filter) => ({
      ...filter,
      allValues:
        filter.allValues$ instanceof Observable
          ? filter.allValues$
          : of(filter.allValues$),
      options:
        filter.options$ instanceof Observable
          ? filter.options$
          : of(filter.options$ || []),
    }));
    this.selectedFilters = this.filters
      .map(({ queryParam }) =>
        this.activatedRoute.snapshot.queryParamMap.get(queryParam)
          ? queryParam
          : null
      )
      .filter((query): query is string => query !== null);
  }

  onAddFilter(filter: string) {
    this.selectedFilters = this.selectedFilters.includes(filter)
      ? this.selectedFilters.filter((f) => f !== filter)
      : [...this.selectedFilters, filter];
  }
}