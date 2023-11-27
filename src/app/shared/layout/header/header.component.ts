import {Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithType} from "../../../../types/category-with-type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl, FormControlName} from "@angular/forms";
import {debounceTime, Subject} from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchField = new FormControl;
  showedSearch: boolean = false;
  serverStaticPath: string = environment.serverStaticPath;
  products: ProductType[] = [];
  // searchValue: string = '';
  isLogged: boolean = false;
  count: number = 0
  @Input() categories: CategoryWithType[] = [];

  productService = inject(ProductService);

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cartService: CartService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
        } else {
          this.products = [];
        }
      });

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;
      });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }


  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Выход из системы выполнен');
    this.router.navigate(['/']);
    this.cartService.setCount(0);
  }

  /*changedSearchValue(newValue: string) {
    this.searchValue = newValue;
    if (this.searchValue && this.searchValue.length > 2) {
      this.productService.searchProducts(this.searchValue)
        .subscribe((data: ProductType[]) => {
          this.products = data;
          this.showedSearch = true;
        });
    } else {
      this.products = [];
    }
  }*/

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    // this.searchValue = '';
    this.products = [];
    this.searchField.setValue('');
  }

  @HostListener('document: click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1){
      this.showedSearch = false;
    }
  }
}
