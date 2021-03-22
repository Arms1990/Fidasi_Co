import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() { }

  success(title: string, message: string) {
    return this.notification.next({
      title,
      message,
      type: 'success'
    });
  }

  error(title: string, message: string) {
    return this.notification.next({
      title,
      message,
      type: 'error'
    });
  }
}
