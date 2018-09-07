import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthinterceptorService implements HttpInterceptor{

  constructor(private _authService : AuthService) { }

  intercept(req, next){
    var reqClone = req.clone({
      headers: new HttpHeaders().set('authorization', this._authService.checkLogin())
    });
    return next.handle(reqClone);
  }
}
