import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';


@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.html',
  imports: [CommonModule, FormsModule,RouterModule]
})
export class SignupComponent {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSignup(form: NgForm) {
    if (form.invalid) return;

    this.authService.signup(form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.log(err)
    });
  }
}
