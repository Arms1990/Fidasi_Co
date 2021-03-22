import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './shared/services/authentication.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  notifications: any = [];
  authenticated = false;

  constructor(
    private notification: NotificationService,
    private auth: AuthenticationService
  ) {
    this.auth.authenticate();
  }

  ngOnInit() {
    this.auth.authenticated.subscribe( (value: boolean) => {
      console.log(value);
      this.authenticated = value;
    });

    this.notification.notification.subscribe( (value: any) => {
      this.notifications = [
        { ...value, rendered: false },
        ...this.notifications
      ];
      setTimeout( () => {
        this.notifications = this.notifications.filter( (notification: any) => notification.rendered !== false );
      }, 5000);
    });
  }

}
