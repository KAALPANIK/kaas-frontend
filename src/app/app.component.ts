import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { User } from './models/user';
import { Role } from './models/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  user?: User | null;

  constructor(private authenticationService: AuthService) {
      this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    return this.user?.role === Role.Admin;
}

  logout() {
    this.authenticationService.logout();
  }
}
