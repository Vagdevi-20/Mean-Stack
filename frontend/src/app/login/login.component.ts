// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   @Output() readonly loginSubmitted = new EventEmitter<LoginCredentials>();

//   email = '';
//   password = '';

//   submitLogin(): void {
//     if (!this.email.trim() || !this.password) {
//       return;
//     }

//     this.loginSubmitted.emit({
//       email: this.email.trim(),
//       password: this.password,
//     });
//   }
// }
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// //import { Router } from '@angular/router';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   user = { username: '', password: '' };

//   constructor(private http: HttpClient, private router: Router) {}

//   onLogin() {
//     this.http.post<{ token: string }>('http://localhost:3000/api/users/login', this.user)
//       .subscribe({
//         next: (res) => {
//           localStorage.setItem('authToken', res.token); // save JWT
//           alert('Login successful!');
//           this.router.navigate(['/dashboard']);        // redirect to dashboard
//         },
//         error: () => alert('Invalid credentials')
//       });
//   }
// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { username: '', password: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    // ✅ Basic validation
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.http.post<{ token: string }>('http://localhost:3000/api/users/login', this.user)
      .subscribe({
        next: (res) => {
          localStorage.setItem('authToken', res.token);   // ✅ consistent key
          alert('Login successful!');
          this.router.navigate(['/dashboard']);           // ✅ redirect
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid credentials';
        }
      });
  }
}
