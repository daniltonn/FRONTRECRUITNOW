import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule,RouterModule]
})
export class LoginComponent {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.document.body.classList.add('bg-gradient-primary');
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.log(err)
    });
  }
  ngAfterViewInit() {
  console.log("LOGIN RENDERIZADO");
}
}
