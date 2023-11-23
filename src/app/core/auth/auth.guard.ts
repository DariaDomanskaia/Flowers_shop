import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {Location} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const isLoggedIn = authService.getIsLoggedIn();
  if (!isLoggedIn){
    snackBar.open('Для просмотра избранных товаров необходимо авторизоваться');
  }
  return isLoggedIn;
};
