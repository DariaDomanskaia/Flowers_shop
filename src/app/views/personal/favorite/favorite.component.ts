import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  @Input() countInCart: number | undefined = 0;

  favoriteService = inject(FavoriteService);
  cartService = inject(CartService);

  serverStaticPath = environment.serverStaticPath;
  products: FavoriteType[] = [];
  productInCart: CartType | null = null;
  count: number = 1;

/*constructor() {
  this.updateFavorite();
}*/

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];
        if (this.products && this.products.length > 0){
          this.updateFavorite();
        }
      });
  }

  updateFavorite() {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error(((cartData as DefaultResponseType).message));
        }
        this.productInCart = cartData as CartType;
        if (this.products && (this.productInCart && this.productInCart.items.length > 0)) {
          for (let i = 0; i < this.productInCart.items.length; i++) {
            this.productInCart.items.forEach(product => {
              if (product.product.id === this.products[i].id) {
                this.products[i].cartCount = product.quantity;
                this.products[i].isInCount = true;
              }
            });
          }
        }
      });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
        this.updateFavorite();
      });
  }

  addToCart(productId: string) {
    this.cartService.updateCart(productId, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = this.count;
        this.updateFavorite();
      });
  }

  updateCount(value: number, productId: string) {

    if (this.countInCart) {
      this.cartService.updateCart(productId, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.countInCart = value;
          this.cartService.getCartCount();
          this.updateFavorite();
        });
    }
  }

}
