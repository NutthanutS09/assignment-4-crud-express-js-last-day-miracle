import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'restuarant';
  logined: boolean = false;

  constructor(private usersService: UsersService, private router: Router) {
    if (localStorage.getItem('username') !== '' && localStorage.getItem('username') !== null) {
      this.logined = true;
      this.router.navigate(['/admin/manage']);
    }
  }

  logout() {
    localStorage.setItem('username', '');
    this.logined = false;
  }

}
