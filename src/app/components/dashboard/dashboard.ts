import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent {

  usuario: any = {};

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : {};
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
