import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found for profile');
      return;
    }

    this.http.get('http://localhost:3000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => this.user = data,
      error: (err) => console.error('Profile load error:', err)
    });
  }
}
