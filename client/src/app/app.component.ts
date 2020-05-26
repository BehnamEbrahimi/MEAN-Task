import { AuthService } from 'src/app/auth.service';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommunicationService } from './communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'IC';
  user: { name: string; _id: string; isManager: boolean };
  url: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private communicationService: CommunicationService
  ) {
    communicationService.changeEmitted$.subscribe((data) => {
      this.user = data;
      communicationService.user = data;
    });

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.url = val.url;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.communicationService.user = this.user;
  }

  logout() {
    this.authService.logout();
  }
}
