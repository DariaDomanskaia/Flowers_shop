import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithType} from "../../../../types/category-with-type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit{

  @Input() categoryWithType: CategoryWithType | null = null;
  @Input() type: string | null = null;
  open = false;
  activeParams: ActiveParamsType = {types: []};
  from: number | null = null;
  to: number | null = null;

  get title(): string {
    if (this.categoryWithType) {
      return this.categoryWithType.name
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота'
      } else if (this.type) {
        if (this.type === 'diameter') {
          return 'Диаметр'
        }
      }
    }
    return ''
  };

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtil.processParams(params);

      if (this.type) {
        if (this.type === 'height'){
          this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo);
          this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
          this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
        } else if (this.type === 'diameter'){
          this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo);
          this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
          this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      } else {
        if (params['type']){
          this.activeParams.types = Array.isArray(params['type']) ? params['type'] : [params['type']];
        }

        if (this.categoryWithType && this.categoryWithType.types
          && this.categoryWithType.types.length > 0 &&
          this.categoryWithType.types.some(type => this.activeParams.types.find(item => type.url === item))){
          this.open = true;
        }
      }
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParams(url: string, checked: boolean) {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url)
      } else if (!existingTypeInParams && checked) {
        // this.activeParams.types.push(url);
        this.activeParams.types = [...this.activeParams.types, url];
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    })
  }

  updateFilterParamsFromTo(param: string, value: string) {
    if (param === 'heightFrom' || param === 'heightTo' || param === 'diameterFrom' || param === 'diameterTo') {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }
      this.activeParams.page = 1;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      })
    }
  }


}
