import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  authenticated = false;

  constructor(
    private auth: AuthenticationService
  ) {
    this.auth.authenticated.subscribe( (value: boolean) => {
      this.authenticated = value;
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: any = localStorage.getItem('token');
    if(this.authenticated) {
      const newReq = request.clone({
        headers: request.headers.set('token', token)
      });
      return next.handle(newReq);
    }
    return next.handle(request);
  }
}
