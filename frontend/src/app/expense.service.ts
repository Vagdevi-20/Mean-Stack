import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Expense {
  _id?: string;
  amount: number;
  category: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly apiUrl = 'http://localhost:3000/api/users/expenses';
  private readonly expenseAddedSubject = new Subject<void>();
  readonly expenseAdded$ = this.expenseAddedSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl, {
      headers: this.authHeaders()
    });
  }

  addExpense(expense: Omit<Expense, '_id'>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense, {
      headers: this.authHeaders()
    });
  }

  notifyExpenseAdded(): void {
    this.expenseAddedSubject.next();
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('You must be signed in to access expenses.');
    }

    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }
}
