import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ExceptionService } from './exception.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  gatewayURL = environment.gatewayURL;

  constructor(
    private http: HttpClient,
    private exception: ExceptionService
  ) { }

  onboard(data: any) {
    const userId = localStorage.getItem('user_id');
    return this.http.post(`${this.gatewayURL}/onboard/${userId}`, data)
      .pipe(
        catchError( (error) => this.exception.throw(error) )
      );
  }

  getUser() {
    const id = localStorage.getItem('user_id');
    return this.http.get(`${this.gatewayURL}/user/${id}`)
      .pipe(
        catchError( (error) => this.exception.throw(error) )
      );
  }

}
