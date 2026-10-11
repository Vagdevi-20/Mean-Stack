import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  expenses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found for expense list');
      return;
    }

    this.http.get<any[]>('http://localhost:3000/api/users/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.expenses = data,
      error: (err) => console.error('Failed to load expenses', err)
    });
  }
}
