// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';  // ✅ import Router

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [FormsModule, RouterModule],  // ✅ include RouterModule
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css']
// })
// export class SignupComponent {
//   user = { username: '', password: '', email: '' };

//   constructor(private http: HttpClient, private router: Router) {}  // ✅ inject Router

//   onSignup() {
//     this.http.post('http://localhost:3000/api/users/signup', this.user).subscribe({
//       next: () => {
//         alert('Signup successful!');
//         this.router.navigate(['/']);   // ✅ now works
//       },
//       error: (err) => {
//         alert(err.error?.message || 'Signup failed');
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],  // ✅ required
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: '',
    role: ''   // ✅ make sure role exists
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    this.http.post('http://localhost:3000/api/users/signup', this.user).subscribe({
      next: () => {
        alert('Signup successful!');
        this.router.navigate(['/']); // back to login
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed');
      }
    });
  }
}
