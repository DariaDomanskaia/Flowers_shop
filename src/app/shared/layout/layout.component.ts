import {Component, OnInit} from '@angular/core';
import {CategoryType} from "../../../types/category.type";
import {CategoryService} from "../services/category.service";
import {CategoryWithType} from "../../../types/category-with-type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit{

  constructor(private categoryService: CategoryService) {
  }

  categories: CategoryWithType[] = [];


  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithType[]) => {
        this.categories = categories.map(item => {
          return Object.assign({typesUrl: item.types.map(item => item.url)}, item);
        });
      })
  }
}
