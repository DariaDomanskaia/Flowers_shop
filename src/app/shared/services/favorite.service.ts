import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  http = inject(HttpClient);

  constructor() { }

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType>  {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

  removeFavorite(productId: string): Observable<DefaultResponseType>  {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}});
  }

  addToFavorites(productId: string): Observable<FavoriteType | DefaultResponseType>  {
    return this.http.post<FavoriteType | DefaultResponseType>(environment.api + 'favorites', {productId});
  }
}
