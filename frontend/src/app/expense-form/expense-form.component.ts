import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent {
  expense = { amount: 0, date: '', category: '', otherCategory: '' };
  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    // ✅ Check for auth token first
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to save expenses.');
      return;
    }

    if (this.expense.category === 'Other' && this.expense.otherCategory.trim()) {
      this.expense.category = this.expense.otherCategory.trim();
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // this.http.post('http://localhost:3000/expenses', this.expense, {
    //   headers: { Authorization: `Bearer ${token}` }   // ✅ consistent key
    this.http.post('http://localhost:3000/api/users/expenses', this.expense, {
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
})

    .subscribe({
      next: () => {
        this.successMessage = 'Expense saved successfully!';
        this.expense = { amount: 0, date: '', category: '', otherCategory: '' };
        this.saving = false;
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        if (err.status === 401) {
          localStorage.removeItem('authToken');
          this.errorMessage = 'Your session has expired or is invalid. Please log in again to save this expense.';
          return;
        }

        this.errorMessage = 'Could not save expense: ' + (err.error?.message || err.message);
      }
    });
  }
}
