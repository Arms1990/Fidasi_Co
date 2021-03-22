import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExceptionService } from './exception.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationServerURL = environment.authenticationServerURL;
  authenticated: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private exception: ExceptionService
  ) { }

  authenticate() {
    const qs = new URLSearchParams(window.location.search);
    const token = qs.get('id');
    return this.http.post(
      `${this.authenticationServerURL}/oauth/end-user/token`, 
      `token=${token}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .pipe(
      catchError( (error) => this.exception.throw(error) )
    )
    .subscribe( (response: any) => {

      console.log(response);
      // if(response.user) {
      //   localStorage.setItem('user', JSON.stringify(response.user));
      // }
      if(response.user_id) {
        localStorage.setItem('user_id', `${response.user_id}`);
        localStorage.setItem('token', `${token}`);
        this.authenticated.next(true);
      }
      // return response.accessToken;
    });
  }
}
